import React from 'react';
import type { BoardroomPersona } from '../../types';

interface ExecutiveBoardProps {
  persona: BoardroomPersona;
  onPersonaChange: (persona: BoardroomPersona) => void;
  totalIntercepted: number;
}

const PERSONAS: BoardroomPersona[] = ['CEO', 'CISO', 'Operations', 'Investor'];

const PERSONA_CONTENT: Record<BoardroomPersona, { title: string; subtitle: string }> = {
  CEO: {
    title: 'Swarm Financial Storyboard',
    subtitle: 'Aggregating cost savings and business continuity records.',
  },
  CISO: {
    title: 'Mitigations & Zero-Trust Audit',
    subtitle: 'Detailed overview of system sanitization, injections blocked, and key rotations.',
  },
  Operations: {
    title: 'Telemetry Outage Diagnostics',
    subtitle: 'Uptime tracking, memory footprint, and autonomous healing details.',
  },
  Investor: {
    title: 'Strategic Moats & Market Deck',
    subtitle: 'Addressable market (TAM), contract growth indices, and moats.',
  },
};

export function ExecutiveBoard({ persona, onPersonaChange, totalIntercepted }: ExecutiveBoardProps) {
  const content = PERSONA_CONTENT[persona];

  return (
    <section className="executive-board-container" aria-label="Executive dashboard">
      <header className="editorial-header">
        <div className="persona-selector-row" role="tablist" aria-label="Persona selector">
          {PERSONAS.map((mode) => (
            <button
              key={mode}
              className={`persona-tab ${persona === mode ? 'active' : ''}`}
              onClick={() => onPersonaChange(mode)}
              role="tab"
              aria-selected={persona === mode}
              type="button"
            >
              {mode} MODE
            </button>
          ))}
        </div>
        <h2 className="editorial-title">{content.title}</h2>
        <p className="editorial-sub">{content.subtitle}</p>
      </header>

      <div className="editorial-grid" role="tabpanel">
        {persona === 'CEO' && (
          <>
            <div className="editorial-card span-full">
              <div className="editorial-number success">$1,280,000</div>
              <h3 className="editorial-label">Outage Loss Prevention Record</h3>
              <p className="editorial-desc">
                Consensus agent checks foiled four critical database prompt injections,
                protecting email sync automations. Estimated savings total $1.2M.
              </p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number">0</div>
              <h3 className="editorial-label">Critical Outages Detected</h3>
              <p className="editorial-desc">Uptime stood at 99.998% with zero downtime reported.</p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number success">100%</div>
              <h3 className="editorial-label">Audit GRC Passed</h3>
              <p className="editorial-desc">Compliance controls SOC2 Type II fully cleared.</p>
            </div>
          </>
        )}

        {persona === 'CISO' && (
          <>
            <div className="editorial-card span-full">
              <div className="editorial-number">{totalIntercepted}</div>
              <h3 className="editorial-label">Exploitation Vectors Intercepted</h3>
              <p className="editorial-desc">
                Pre-execution scanner blocked prompt injections, path traversals,
                and database exfiltration scripts at the gateway.
              </p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number">14/14</div>
              <h3 className="editorial-label">Key Vault Keys Synced</h3>
              <p className="editorial-desc">All secrets rotated with active zero-trust verification.</p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number success">99/100</div>
              <h3 className="editorial-label">Overall Security Posture Score</h3>
              <p className="editorial-desc">Highest score achieved this quarter, verifying baseline health.</p>
            </div>
          </>
        )}

        {persona === 'Operations' && (
          <>
            <div className="editorial-card span-full">
              <div className="editorial-number">12.2%</div>
              <h3 className="editorial-label">Average Core CPU Footprint</h3>
              <p className="editorial-desc">
                Decentralized consensus validation maintains low overhead
                processing under 50ms latency boundaries.
              </p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number">456 MB</div>
              <h3 className="editorial-label">Active Memory Usage</h3>
              <p className="editorial-desc">Swarm memory constellation cache fully optimized.</p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number success">650ms</div>
              <h3 className="editorial-label">Self-Healing Rollback SLA</h3>
              <p className="editorial-desc">Phoenix agent rollbacks complete in sub-second timelines.</p>
            </div>
          </>
        )}

        {persona === 'Investor' && (
          <>
            <div className="editorial-card span-full">
              <div className="editorial-number">$12.4 B</div>
              <h3 className="editorial-label">Total Addressable Market by 2028</h3>
              <p className="editorial-desc">
                As autonomous agent workforces expand, securing agent execution
                boundaries represents a crucial IT security standard.
              </p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number">99.2%</div>
              <h3 className="editorial-label">Consensus Trust Moat</h3>
              <p className="editorial-desc">Custom multi-signature verification pipeline presents a significant technical barrier.</p>
            </div>
            <div className="editorial-card">
              <div className="editorial-number success">$250K</div>
              <h3 className="editorial-label">Average Enterprise ACV</h3>
              <p className="editorial-desc">High contract value contracts driving rapid ARR growth curves.</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
