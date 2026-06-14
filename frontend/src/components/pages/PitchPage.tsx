import React from 'react';
import { Briefcase } from 'lucide-react';
import { COMPETITIVE_MATRIX } from '../../types';

export function PitchPage() {
  return (
    <section className="pane-container" aria-label="Strategic roadmap">
      <div className="pane-title-row">
        <Briefcase size={28} aria-hidden="true" />
        <h2 className="pane-title">Strategic Roadmap</h2>
      </div>

      <div className="glass-card">
        <div className="table-wrapper">
          <table className="fluent-table" role="table">
            <thead>
              <tr>
                <th scope="col">Feature Moat</th>
                <th scope="col" className="text-info">Sentinel Swarm</th>
                <th scope="col">Security Copilot</th>
                <th scope="col">CrowdStrike</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITIVE_MATRIX.map((row, i) => (
                <tr key={i}>
                  <td className="font-semibold">{row.feature}</td>
                  <td className="text-info font-bold">{row.sentinel}</td>
                  <td>{row.copilot}</td>
                  <td>{row.crowdstrike}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
