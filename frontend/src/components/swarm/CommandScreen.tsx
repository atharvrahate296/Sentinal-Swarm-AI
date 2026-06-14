import React from 'react';
import { Search } from 'lucide-react';

interface CommandScreenProps {
  onOpenSpotlight: () => void;
  onShortcut: (query: string) => void;
  onTravelSpace: () => void;
}

const SHORTCUTS = [
  {
    title: 'Simulate Attack Chain',
    desc: 'Launch an automated compromise audit simulation',
    action: 'SIMULATE',
    query: 'Simulate attack chain',
  },
  {
    title: 'Audit Swarm Coworkers',
    desc: 'Perform local agent reputation compliance audits',
    action: 'HEALTH',
    query: 'Audit Swarm health',
  },
  {
    title: 'Predict Threat Anomalies',
    desc: 'Query forecast logs of threat probabilities',
    action: 'FORECAST',
    query: 'Predict attacks',
  },
];

export function CommandScreen({ onOpenSpotlight, onShortcut, onTravelSpace }: CommandScreenProps) {
  return (
    <section className="command-first-container" aria-label="Command center">
      <h1 className="opening-title">What would you like the swarm to do?</h1>

      <button
        className="glass-card opening-search-box"
        onClick={onOpenSpotlight}
        type="button"
        aria-label="Open command search"
      >
        <Search size={22} aria-hidden="true" />
        <span className="opening-search-placeholder">Command Sentinel Swarm OS...</span>
        <kbd className="spotlight-kbd">Ctrl+K</kbd>
      </button>

      <div className="opening-shortcuts-grid">
        {SHORTCUTS.map((s) => (
          <button
            key={s.query}
            className="glass-card opening-shortcut-card"
            onClick={() => onShortcut(s.query)}
            type="button"
          >
            <div className="shortcut-info">
              <span className="opening-shortcut-title">{s.title}</span>
              <span className="shortcut-desc">{s.desc}</span>
            </div>
            <span className="opening-shortcut-action">{s.action}</span>
          </button>
        ))}

        <button
          className="glass-card opening-shortcut-card"
          onClick={onTravelSpace}
          type="button"
        >
          <div className="shortcut-info">
            <span className="opening-shortcut-title">Travel Swarm Space</span>
            <span className="shortcut-desc">Interact with core chambers in 3D orbit</span>
          </div>
          <span className="opening-shortcut-action">TRAVEL</span>
        </button>
      </div>
    </section>
  );
}
