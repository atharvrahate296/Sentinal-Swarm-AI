import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import type { SystemConfig } from '../../types';

interface SettingsPageProps {
  configs: SystemConfig[];
  onUpdateConfig: (key: string, value: string) => void;
}

export function SettingsPage({ configs, onUpdateConfig }: SettingsPageProps) {
  const getConfigValue = (key: string, fallback: string) =>
    configs.find(c => c.key === key)?.value || fallback;

  return (
    <section className="pane-container" aria-label="Threshold policies settings">
      <div className="pane-title-row">
        <SettingsIcon size={28} aria-hidden="true" />
        <h2 className="pane-title">Threshold Policies</h2>
      </div>

      <div className="glass-card settings-form">
        <div className="form-group">
          <label htmlFor="keyvault-sync" className="form-label">
            Azure Key Vault sync interval (ms)
          </label>
          <select
            id="keyvault-sync"
            className="glass-select"
            value={getConfigValue('azure.keyvault.sync.ms', '60000')}
            onChange={(e) => onUpdateConfig('azure.keyvault.sync.ms', e.target.value)}
          >
            <option value="10000">10,000ms (Real-time)</option>
            <option value="60000">60,000ms (Nominal)</option>
            <option value="300000">300,000ms (Eco)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="risk-threshold" className="form-label">
            RiskAgent compromise sensitivity threshold
          </label>
          <select
            id="risk-threshold"
            className="glass-select"
            value={getConfigValue('risk.compromise.threshold', '0.70')}
            onChange={(e) => onUpdateConfig('risk.compromise.threshold', e.target.value)}
          >
            <option value="0.85">0.85 (Strict compliance)</option>
            <option value="0.70">0.70 (Standard tolerance)</option>
            <option value="0.50">0.50 (Permissive testing)</option>
          </select>
        </div>
      </div>
    </section>
  );
}
