import React from 'react';
import {
  Activity,
  Globe,
  Users,
  Play,
  Settings as SettingsIcon,
  Briefcase,
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface DockProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const DOCK_ITEMS: { id: ActiveTab; icon: React.ElementType; label: string }[] = [
  { id: 'swarm', icon: Activity, label: 'Swarm Space' },
  { id: 'memory', icon: Globe, label: 'Memory Universe' },
  { id: 'executive', icon: Users, label: 'Executive Board' },
  { id: 'reveal', icon: Play, label: 'Launch Keynote' },
  { id: 'settings', icon: SettingsIcon, label: 'Policies' },
  { id: 'pitch', icon: Briefcase, label: 'Pitch Deck' },
];

export function Dock({ activeTab, onTabChange }: DockProps) {
  return (
    <div className="glass-dock-wrapper" role="navigation" aria-label="Main navigation">
      <nav className="glass-dock">
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`dock-item ${isActive ? 'active' : ''}`}
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              type="button"
            >
              <Icon size={22} aria-hidden="true" />
              <span className="dock-label">{item.label}</span>
              <span className="dock-tooltip" aria-hidden="true">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
