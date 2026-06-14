import React from 'react';
import { X } from 'lucide-react';
import type { CanvasChamber } from '../../types';

interface AgentDetailPanelProps {
  node: CanvasChamber;
  onClose: () => void;
}

export function AgentDetailPanel({ node, onClose }: AgentDetailPanelProps) {
  return (
    <aside
      className="hud-widget glass-panel agent-floating-panel"
      role="complementary"
      aria-label={`${node.coworkerName} agent details`}
    >
      <div className="panel-header">
        <div className="panel-header-info">
          <span className="panel-title">{node.coworkerName}</span>
          <span className="panel-subtitle">
            {node.name} — {node.shape.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onClose}
          className="btn btn-icon"
          aria-label="Close agent details"
          type="button"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="panel-body">
        <div className="panel-stat-row">
          <span>Status</span>
          <span
            className={`panel-stat-val ${node.status === 'COMPROMISED' ? 'text-error' : 'text-success'}`}
          >
            {node.status}
          </span>
        </div>
        <div className="panel-stat-row">
          <span>Reputation</span>
          <span className="panel-stat-val">{node.reputation}/100</span>
        </div>

        <hr className="panel-divider" />

        <div className="panel-section">
          <span className="panel-section-title">Personality</span>
          <span className="panel-section-text">"{node.personality}"</span>
        </div>

        <div className="panel-section">
          <span className="panel-section-title">Current Objective</span>
          <span className="panel-section-value">{node.objective}</span>
        </div>

        <div className="panel-section">
          <span className="panel-section-title">Recent Memory</span>
          <span className="panel-section-muted">{node.recentMemory}</span>
        </div>

        <hr className="panel-divider" />

        <div className="panel-section">
          <span className="panel-section-title">Reasoning Chain</span>
          <div className="panel-reasoning-list">
            {node.reasoningChain.map((step, idx) => (
              <div key={idx} className="panel-reasoning-step">{step}</div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
