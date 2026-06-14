import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  SecurityEvent,
  AgentMetric,
  SystemConfig,
  PredictionReport,
  BlackBoxLog,
  ImmuneRule,
  SimulatedEcosystemAgent,
} from '../types';

interface ApiState {
  events: SecurityEvent[];
  metrics: AgentMetric[];
  configs: SystemConfig[];
  simulations: any[];
  ecosystemAgents: SimulatedEcosystemAgent[];
  prediction: PredictionReport;
  blackBoxLogs: BlackBoxLog[];
  immuneRules: ImmuneRule[];
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_PREDICTION: PredictionReport = {
  probability: 12,
  predictedVector: 'None',
  targetAgent: 'None',
  recommendedPreemptiveAction: 'System nominal.',
  status: 'LOW',
};

export function useApi() {
  const [state, setState] = useState<ApiState>({
    events: [],
    metrics: [],
    configs: [],
    simulations: [],
    ecosystemAgents: [],
    prediction: DEFAULT_PREDICTION,
    blackBoxLogs: [],
    immuneRules: [],
    isLoading: true,
    error: null,
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [evtsRes, metricsRes, configsRes, simsRes, predRes, bbRes, immRes, ecoRes] =
        await Promise.all([
          fetch('/api/events'),
          fetch('/api/metrics'),
          fetch('/api/configs'),
          fetch('/api/simulations'),
          fetch('/api/prediction'),
          fetch('/api/blackbox'),
          fetch('/api/immune'),
          fetch('/api/ecosystem'),
        ]);

      const [events, metrics, configs, simulations, prediction, blackBoxLogs, immuneRules, ecosystemAgents] =
        await Promise.all([
          evtsRes.json(),
          metricsRes.json(),
          configsRes.json(),
          simsRes.json(),
          predRes.json(),
          bbRes.json(),
          immRes.json(),
          ecoRes.json(),
        ]);

      if (isMounted.current) {
        setState({
          events,
          metrics,
          configs,
          simulations,
          ecosystemAgents,
          prediction,
          blackBoxLogs,
          immuneRules,
          isLoading: false,
          error: null,
        });
      }
    } catch (err) {
      if (isMounted.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load data. Backend may be offline.',
        }));
      }
    }
  }, []);

  const setMetrics = useCallback((metrics: AgentMetric[]) => {
    if (isMounted.current) {
      setState(prev => ({ ...prev, metrics }));
    }
  }, []);

  const updateConfig = useCallback(async (key: string, value: string) => {
    try {
      await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value }),
      });
      fetchData();
    } catch (err) {
      console.error('Config update failed:', err);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, fetchData, setMetrics, updateConfig };
}
