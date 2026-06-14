import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SpotlightSearchProps {
  isOpen: boolean;
  query: string;
  response: string | null;
  onClose: () => void;
  onQueryChange: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClearResponse: () => void;
}

export function SpotlightSearch({
  isOpen,
  query,
  response,
  onClose,
  onQueryChange,
  onSubmit,
  onClearResponse,
}: SpotlightSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const focusableEls = overlay.querySelectorAll<HTMLElement>(
      'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    };

    overlay.addEventListener('keydown', handleTab);
    return () => overlay.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions = [
    { label: 'Simulate Attack Chain', action: 'EXECUTE SIM', actionClass: 'text-error', query: 'Simulate attack chain' },
    { label: 'Audit Swarm Health Index', action: 'HEALTH CHECK', actionClass: 'text-success', query: 'Audit Swarm health' },
    { label: 'Predict Swarm Anomaly Vectors', action: 'FORECAST', actionClass: 'text-info', query: 'Predict targeted threats' },
  ];

  return (
    <div
      className="spotlight-overlay"
      onClick={onClose}
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Command search"
    >
      <div className="spotlight-box glass-panel" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <div className="spotlight-input-row">
            <Search size={20} aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              className="spotlight-input"
              placeholder="Ask Sentinel anything..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              aria-label="Search command"
            />
            <kbd className="spotlight-kbd">ESC</kbd>
          </div>
        </form>

        <div className="spotlight-body">
          {!response && (
            <div className="spotlight-suggestions">
              <span className="spotlight-section-label">
                Suggested Operations
              </span>
              {suggestions.map((s) => (
                <button
                  key={s.query}
                  className="suggestion-pill"
                  type="button"
                  onClick={() => onQueryChange(s.query)}
                >
                  <span>{s.label}</span>
                  <span className={`suggestion-action ${s.actionClass}`}>{s.action}</span>
                </button>
              ))}
            </div>
          )}

          {response && (
            <div className="spotlight-response">
              <div className="spotlight-response-header">
                <span className="spotlight-response-label">Command Center Response</span>
                <button
                  onClick={onClearResponse}
                  className="btn btn-icon"
                  aria-label="Clear response"
                  type="button"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
              <div className="spotlight-response-text">{response}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
