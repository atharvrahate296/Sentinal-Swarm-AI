import { Router, Request, Response } from 'express';
import { db } from '../database/db';
import { orchestrator } from '../swarm/Orchestrator';
import { ATTACK_DATASET, AttackSimulator } from '../services/attackSimulator';
import { PredictionEngine } from '../services/predictionEngine';

const router = Router();

// Retrieve all security events
router.get('/events', (req: Request, res: Response) => {
  res.json(db.getEvents());
});

// Retrieve all agent health metrics
router.get('/metrics', (req: Request, res: Response) => {
  res.json(db.getMetrics());
});

// Retrieve configuration settings
router.get('/configs', (req: Request, res: Response) => {
  res.json(db.getConfigs());
});

// Update configuration setting
router.post('/configs', (req: Request, res: Response) => {
  const { key, value } = req.body;
  if (!key || value === undefined) {
    return res.status(400).json({ error: 'Key and Value are required.' });
  }
  db.updateConfig(key, value);
  res.json({ success: true, configs: db.getConfigs() });
});

// Run a manual user query through the swarm orchestrator
router.post('/orchestrate', async (req: Request, res: Response) => {
  const { prompt, role } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const result = await orchestrator.run(prompt, role || 'Guest');
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all simulation scenarios
router.get('/simulations', (req: Request, res: Response) => {
  res.json(ATTACK_DATASET);
});

// Run specific simulation
router.post('/simulations/run', async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Simulation ID is required.' });
  }

  try {
    const result = await AttackSimulator.runSimulation(id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Judge Demo Mode - Trigger all attacks in a burst to populate dashboard
router.post('/simulations/auto', async (req: Request, res: Response) => {
  try {
    const results = [];
    for (const scenario of ATTACK_DATASET) {
      const result = await AttackSimulator.runSimulation(scenario.id);
      results.push(result);
    }
    res.json({
      success: true,
      message: 'Judge Demo Mode execution complete. All security threat mitigations triggered.',
      results
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/prediction - Retrieve live threat prediction stats
router.get('/prediction', (req: Request, res: Response) => {
  const reportsCount = db.getEvents().length;
  const prediction = PredictionEngine.calculateThreatPrediction(reportsCount);
  res.json(prediction);
});

// GET /api/blackbox - Retrieve black box logs for forensics replaying
router.get('/blackbox', (req: Request, res: Response) => {
  res.json(db.getBlackBoxLogs());
});

// GET /api/immune - Retrieve digital immune guidelines learned
router.get('/immune', (req: Request, res: Response) => {
  res.json(db.getImmuneRules());
});

// GET /api/ecosystem - Retrieve simulated agent marketplace agents list
router.get('/ecosystem', (req: Request, res: Response) => {
  res.json(db.getSimulatedEcosystemAgents());
});

export default router;
