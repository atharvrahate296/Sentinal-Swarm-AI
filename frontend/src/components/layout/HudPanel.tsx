import React from 'react';
import { Lock, Search } from 'lucide-react';
import type { ThreatLevel, BoardroomPersona, RbacRole } from '../../types';

interface HudPanelProps {
  systemThreatLevel: ThreatLevel;
  boardroomPersona: BoardroomPersona;
  predictionProbability: number;
  rbacRole: RbacRole;
  onRbacChange: (role: RbacRole) => void;
  onMissionControl: () => void;
  onOpenSpotlight: () => void;
}

export function HudPanel({
  systemThreatLevel,
  boardroomPersona,
  predictionProbability,
  rbacRole,
  onRbacChange,
  onMissionControl,
  onOpenSpotlight,
}: HudPanelProps) {
  const getStatusText = () => {
    switch (systemThreatLevel) {
      case 'NOMINAL': return 'SENTINEL OS: ACTIVE';
      case 'EVALUATING': return 'PIPELINE AUDIT...';
      case 'MITIGATED': return 'THREAT INTERCEPTED';
      case 'COMPROMISED': return 'COMPROMISED';
      default: return 'SENTINEL OS: ACTIVE';
    }
  };

  const getOrbClass = () => {
    if (systemThreatLevel === 'COMPROMISED') return 'orb compromised';
    if (systemThreatLevel === 'EVALUATING') return 'orb scanning';
    return 'orb';
  };

  return (
    <>
      {/* Status Panel — Top Left */}
      <div className="hud-widget hud-top-left glass-panel" role="status" aria-live="polite">
        <div className="hud-status-orb">
          <div className={getOrbClass()} aria-hidden="true" />
          <span className="hud-status-text">{getStatusText()}</span>
        </div>
        <div className="hud-stats">
          <div>Persona: <strong>{boardroomPersona}</strong></div>
          <div>Threat Probability: <strong className="text-info">{predictionProbability}%</strong></div>
          <div>Consensus Trust: <strong className="text-success">99.2%</strong></div>
        </div>
      </div>

      {/* Controls Panel — Top Right */}
      <div className="hud-widget hud-top-right glass-panel">
        <div className="hud-control-label">
          <Lock size={12} aria-hidden="true" />
          <span>RBAC PROFILE</span>
        </div>
        <label className="sr-only" htmlFor="rbac-select">Select RBAC Role</label>
        <select
          id="rbac-select"
          className="glass-select"
          value={rbacRole}
          onChange={(e) => onRbacChange(e.target.value as RbacRole)}
        >
          <option value="Guest">Guest (Restricted)</option>
          <option value="Application Developer">Developer</option>
          <option value="Security Analyst">Security Analyst</option>
          <option value="Security Admin">Security Admin</option>
        </select>

        <div className="hud-actions">
          <button
            className="btn btn-secondary"
            onClick={onMissionControl}
            type="button"
          >
            Mission Control
          </button>
          <button
            className="btn btn-icon"
            onClick={onOpenSpotlight}
            aria-label="Open command search (Ctrl+K)"
            type="button"
          >
            <Search size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}
