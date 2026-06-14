import { useEffect, useRef, useCallback } from 'react';
import type { AgentMetric } from '../types';

interface UseWebSocketOptions {
  onMetricsUpdate: (metrics: AgentMetric[]) => void;
}

export function useWebSocket({ onMetricsUpdate }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const isMounted = useRef(true);

  const connect = useCallback(() => {
    if (!isMounted.current) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}`);

      ws.onopen = () => {
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'REALTIME_TELEMETRY' && message.data?.metrics) {
            onMetricsUpdate(message.data.metrics);
          } else if (message.type === 'METRICS_DUMP' && message.data) {
            onMetricsUpdate(message.data);
          }
        } catch (err) {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        if (isMounted.current && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current += 1;
          reconnectTimeout.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      wsRef.current = ws;
    } catch {
      // WebSocket not available
    }
  }, [onMetricsUpdate]);

  useEffect(() => {
    isMounted.current = true;
    connect();

    return () => {
      isMounted.current = false;
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
}
