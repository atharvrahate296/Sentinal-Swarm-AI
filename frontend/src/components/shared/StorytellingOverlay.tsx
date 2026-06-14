import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { StorytellingPhase } from '../../types';

interface StorytellingOverlayProps {
  phase: StorytellingPhase;
  log: string;
}

export function StorytellingOverlay({ phase, log }: StorytellingOverlayProps) {
  if (phase === 'IDLE') return null;

  return (
    <div className="storytelling-overlay" role="alert" aria-live="polite">
      <RefreshCw size={14} className="storytelling-spinner" aria-hidden="true" />
      <div className="storytelling-content">
        <span className="storytelling-label">Spatial Storytelling Active</span>
        <span className="storytelling-log">{log}</span>
      </div>
      <span className="storytelling-phase">{phase}</span>
    </div>
  );
}
