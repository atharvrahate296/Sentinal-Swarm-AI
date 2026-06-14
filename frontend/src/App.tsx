import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  ActiveTab,
  BoardroomPersona,
  RbacRole,
  ThreatLevel,
  StorytellingPhase,
  CanvasChamber,
  SwarmStep,
  TerminalLog,
} from './types';

// Hooks
import { useApi } from './hooks/useApi';
import { useWebSocket } from './hooks/useWebSocket';

// Layout
import { Dock } from './components/layout/Dock';
import { HudPanel } from './components/layout/HudPanel';
import { SpotlightSearch } from './components/layout/SpotlightSearch';

// Swarm
import { SwarmCanvas } from './components/swarm/SwarmCanvas';
import { AgentDetailPanel } from './components/swarm/AgentDetailPanel';
import { CommandScreen } from './components/swarm/CommandScreen';

// Pages
import { ExecutiveBoard } from './components/pages/ExecutiveBoard';
import { MemoryCanvas } from './components/pages/MemoryCanvas';
import { SettingsPage } from './components/pages/SettingsPage';
import { PitchPage } from './components/pages/PitchPage';
import { CinematicRevealPlayer } from './components/CinematicRevealPlayer';

// Shared
import { StorytellingOverlay } from './components/shared/StorytellingOverlay';

const MAX_LOGS = 100;

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('swarm');
  const [showCommandScreen, setShowCommandScreen] = useState(true);
  const [boardroomPersona, setBoardroomPersona] = useState<BoardroomPersona>('CEO');
  const [rbacRole, setRbacRole] = useState<RbacRole>('Guest');

  // Spotlight
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [spotlightResponse, setSpotlightResponse] = useState<string | null>(null);

  // Agent details
  const [selectedNode, setSelectedNode] = useState<CanvasChamber | null>(null);

  // Simulation state
  const [storytellingPhase, setStorytellingPhase] = useState<StorytellingPhase>('IDLE');
  const [storytellingLog, setStorytellingLog] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [totalIntercepted, setTotalIntercepted] = useState(38);
  const [systemThreatLevel, setSystemThreatLevel] = useState<ThreatLevel>('NOMINAL');

  // Terminal logs (bounded)
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { agent: 'System', msg: 'Sentinel OS loaded.', time: new Date().toLocaleTimeString() },
  ]);

  // Cleanup refs for setTimeout chains
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Data fetching
  const {
    metrics, configs, prediction, fetchData, setMetrics, updateConfig, isLoading, error,
  } = useApi();

  // WebSocket
  useWebSocket({ onMetricsUpdate: setMetrics });

  // Keyboard shortcut for spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const addLog = useCallback((agent: string, msg: string) => {
    setTerminalLogs(prev => {
      const next = [...prev, { agent, msg, time: new Date().toLocaleTimeString() }];
      return next.length > MAX_LOGS ? next.slice(-MAX_LOGS) : next;
    });
  }, []);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutRefs.current.push(id);
    return id;
  }, []);

  // Simulation walkthrough
  const runVisualWalkthrough = useCallback(async (steps: SwarmStep[]) => {
    const chambers = (window as any).__swarmChambers;
    const camera = (window as any).__swarmCamera;
    if (!chambers || !camera) return;

    for (const step of steps) {
      const ch = chambers.find((c: CanvasChamber) => c.name === step.agentName);
      if (ch) {
        const isFailed = step.status === 'failed';
        ch.color = isFailed ? '#ff453a' : '#00e5ff';
        ch.status = isFailed ? 'COMPROMISED' : 'ACTIVE';
      }
      addLog(step.agentName, step.action);
      await new Promise<void>(r => scheduleTimeout(() => r(), 700));
      if (ch) {
        ch.color = ch.baseColor;
        ch.status = 'ACTIVE';
      }
    }

    if (camera) {
      camera.targetZoom.current = 1.0;
      camera.targetOffset.current = { x: 0, y: 0 };
    }
  }, [addLog, scheduleTimeout]);

  // Run simulation
  const handleRunSimulation = useCallback(async (id: string) => {
    setIsExecuting(true);
    setSystemThreatLevel('EVALUATING');

    try {
      const response = await fetch(`${API_BASE_URL}/api/simulations/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();

      setStorytellingPhase('REASON');
      setStorytellingLog('Validator auditing parameter anomalies.');
      await runVisualWalkthrough(data.steps);

      setStorytellingPhase('DECIDE');
      setStorytellingLog(data.success ? 'Output validated as secure.' : 'Attack blocked. Permissions suspended.');
      await new Promise<void>(r => scheduleTimeout(() => r(), 1500));

      if (!data.success) {
        setStorytellingPhase('RECOVER');
        setStorytellingLog('Recovery agent synchronizing baseline settings.');
        await new Promise<void>(r => scheduleTimeout(() => r(), 2000));
        setTotalIntercepted(prev => prev + 1);
      }

      setStorytellingPhase('SUMMARY');
      setStorytellingLog('GRC dashboard saved outage cost records.');
      await new Promise<void>(r => scheduleTimeout(() => r(), 2000));

      setStorytellingPhase('IDLE');
      setSystemThreatLevel(data.success ? 'NOMINAL' : 'MITIGATED');
      fetchData();
    } catch {
      setStorytellingPhase('IDLE');
      setSystemThreatLevel('NOMINAL');
    } finally {
      setIsExecuting(false);
    }
  }, [fetchData, runVisualWalkthrough, scheduleTimeout]);

  // Spotlight submit
  const handleSpotlightSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotlightQuery.trim()) return;

    const query = spotlightQuery.toLowerCase();
    setShowCommandScreen(false);

    if (query.includes('threat') || query.includes('attack') || query.includes('sim')) {
      setSpotlightResponse('Compromise simulation initializing...');
      setIsSpotlightOpen(false);
      setStorytellingPhase('DETECTED');
      setStorytellingLog('Anomaly detected on PlannerAgent buffer.');

      scheduleTimeout(() => {
        setStorytellingPhase('ASSEMBLE');
        setStorytellingLog('Security agents assembling consensus checks.');
      }, 1500);

      scheduleTimeout(() => {
        setStorytellingPhase('INVESTIGATE');
        setStorytellingLog('SecurityAgent auditing MCP filesystem parameters.');
        handleRunSimulation('dan-jailbreak');
      }, 3000);
    } else if (query.includes('audit') || query.includes('reputation')) {
      const comp = metrics.filter(m => m.status === 'Compromised');
      setSpotlightResponse(
        comp.length > 0
          ? `ALERT: Compromised departments: [${comp.map(c => c.agentName).join(', ')}].`
          : 'AUDIT COMPLETED: All departments verifying trust above 98%.'
      );
    } else if (query.includes('predict') || query.includes('forecast')) {
      setSpotlightResponse(
        `FORECAST: Anomaly curve at ${prediction.probability}%. Target: ${prediction.targetAgent}.`
      );
    } else {
      setIsExecuting(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/orchestrate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: spotlightQuery, role: rbacRole }),
        });
        const data = await response.json();
        await runVisualWalkthrough(data.steps);
        setSpotlightResponse(
          `Pipeline result: ${data.success ? 'Query compliant.' : 'Vector blocked.'} ID: ${data.traceId}`
        );
        fetchData();
      } catch {
        setSpotlightResponse('Error executing swarm pipeline.');
      } finally {
        setIsExecuting(false);
      }
    }
    setSpotlightQuery('');
  }, [spotlightQuery, metrics, prediction, rbacRole, fetchData, handleRunSimulation, runVisualWalkthrough, scheduleTimeout]);

  // Tab change handler
  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'swarm') {
      setShowCommandScreen(true);
    }
    setSelectedNode(null);
  }, []);

  // Shortcut handler
  const handleShortcut = useCallback((query: string) => {
    setSpotlightQuery(query);
    setIsSpotlightOpen(true);
  }, []);

  const handleNodeClick = useCallback((node: CanvasChamber | null) => {
    setSelectedNode(node);
  }, []);

  const handleResetNode = useCallback(() => {
    setSelectedNode(null);
    const camera = (window as any).__swarmCamera;
    if (camera) {
      camera.targetZoom.current = 1.0;
      camera.targetOffset.current = { x: 0, y: 0 };
    }
  }, []);

  return (
    <div className={`app-root theme-${boardroomPersona.toLowerCase()}`}>
      <a href="#main-content" className="sr-only sr-only-focusable">Skip to main content</a>

      {/* Canvases */}
      <SwarmCanvas
        isVisible={activeTab === 'swarm'}
        metrics={metrics}
        boardroomPersona={boardroomPersona}
        onNodeClick={handleNodeClick}
      />
      <MemoryCanvas isVisible={activeTab === 'memory'} />

      {/* HUD */}
      <HudPanel
        systemThreatLevel={systemThreatLevel}
        boardroomPersona={boardroomPersona}
        predictionProbability={prediction.probability}
        rbacRole={rbacRole}
        onRbacChange={setRbacRole}
        onMissionControl={() => { setShowCommandScreen(true); setActiveTab('swarm'); setSelectedNode(null); }}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
      />

      {/* Storytelling overlay */}
      {activeTab === 'swarm' && (
        <StorytellingOverlay phase={storytellingPhase} log={storytellingLog} />
      )}

      {/* Main Content */}
      <main
        id="main-content"
        className={`main-viewport ${activeTab === 'swarm' && !showCommandScreen ? 'canvas-mode' : ''}`}
      >
        {/* Error banner */}
        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button onClick={fetchData} className="btn btn-secondary btn-sm" type="button">Retry</button>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !error && (
          <div className="loading-indicator" role="status" aria-label="Loading data">
            <div className="loading-spinner" />
            <span>Loading swarm data...</span>
          </div>
        )}

        {activeTab === 'swarm' && showCommandScreen && (
          <CommandScreen
            onOpenSpotlight={() => setIsSpotlightOpen(true)}
            onShortcut={handleShortcut}
            onTravelSpace={() => setShowCommandScreen(false)}
          />
        )}

        {activeTab === 'executive' && (
          <ExecutiveBoard
            persona={boardroomPersona}
            onPersonaChange={setBoardroomPersona}
            totalIntercepted={totalIntercepted}
          />
        )}

        {activeTab === 'reveal' && (
          <section className="cinematic-reveal-pane" aria-label="Keynote presentation">
            <CinematicRevealPlayer />
          </section>
        )}

        {activeTab === 'settings' && (
          <SettingsPage configs={configs} onUpdateConfig={updateConfig} />
        )}

        {activeTab === 'pitch' && <PitchPage />}
      </main>

      {/* Agent detail panel */}
      {activeTab === 'swarm' && selectedNode && (
        <AgentDetailPanel node={selectedNode} onClose={handleResetNode} />
      )}

      {/* Spotlight */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        query={spotlightQuery}
        response={spotlightResponse}
        onClose={() => setIsSpotlightOpen(false)}
        onQueryChange={setSpotlightQuery}
        onSubmit={handleSpotlightSubmit}
        onClearResponse={() => setSpotlightResponse(null)}
      />

      {/* Dock */}
      <Dock activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
