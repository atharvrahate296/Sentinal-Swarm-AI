import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { config } from './config';
import apiRouter from './routes/api';
import { db } from './database/db';

const app = express();
const server = createServer(app);

// Enable CORS for frontend interaction
app.use(cors());
app.use(express.json());

// Main API Routes
app.use('/api', apiRouter);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'HEALTHY', timestamp: new Date().toISOString() });
});

// Setup WebSockets for Real-time telemetry broadcast (Simulates system stream logs)
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Telemetry client connected.');

  // Send initial metrics dump
  ws.send(JSON.stringify({ type: 'METRICS_DUMP', data: db.getMetrics() }));

  // Broadcast random fluctuating CPU/Memory/Latency metrics every 3 seconds to emulate active systems
  const broadcastInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      // Fluctuate health metrics
      const currentMetrics = db.getMetrics().map(metric => {
        const cpuDelta = (Math.random() - 0.5) * 4;
        const memoryDelta = (Math.random() - 0.5) * 2;
        return {
          ...metric,
          cpuUsage: Math.max(1, Math.min(99, Math.floor(metric.cpuUsage + cpuDelta))),
          memoryUsage: Math.max(10, Math.min(100, Math.floor(metric.memoryUsage + memoryDelta)))
        };
      });

      ws.send(JSON.stringify({
        type: 'REALTIME_TELEMETRY',
        data: {
          metrics: currentMetrics,
          globalCpu: Math.floor(currentMetrics.reduce((acc, m) => acc + m.cpuUsage, 0) / currentMetrics.length),
          globalMemory: Math.floor(currentMetrics.reduce((acc, m) => acc + m.memoryUsage, 0) / currentMetrics.length),
          timestamp: new Date().toISOString()
        }
      }));
    }
  }, 3000);

  ws.on('close', () => {
    clearInterval(broadcastInterval);
    console.log('Telemetry client disconnected.');
  });
});

server.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(` SENTINEL SWARM AI SECURITY ENGINE RUNNING ON PORT ${config.port}`);
  console.log(` Zero Trust Mode: ACTIVE | Database Engine: SQLite(Mock)`);
  console.log(`=======================================================`);
});
