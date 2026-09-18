import React from 'react';
import { ViewTab, ViewportMode } from '../types';
import { BookOpen, PlusCircle, Layers, Settings, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  viewportMode: ViewportMode;
  onViewportModeChange: (mode: ViewportMode) => void;
  activePoolCode?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  viewportMode,
  onViewportModeChange,
  activePoolCode = '#0094-ARC',
}) => {
  const navItems: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'compendio', label: 'Compêndio', icon: BookOpen },
    { id: 'registrar', label: 'Registrar', icon: PlusCircle },
    { id: 'deck_ativo', label: 'Deck Ativo', icon: Layers },
    { id: 'ajustes', label: 'Ajustes & Portabilidade', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#141311]/95 backdrop-blur-md border-b border-[#332e26] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onTabChange('compendio')}
        >
          {/* Arcane Codex Glyph */}
          <div className="w-9 h-9 rounded bg-[#1c1a17] border border-[#c2a264]/60 flex items-center justify-center p-1.5 shadow-sm group hover:border-[#c2a264] transition">
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
              <polygon points="50,20 54,24 50,28 46,24" fill="#c2a264" />
              <path d="M22 34 L50 20 L78 34 L78 78 L50 90 L22 78 Z" stroke="#c2a264" strokeWidth="3" strokeLinejoin="round" />
              <path d="M50 20 L50 90" stroke="#c2a264" strokeWidth="2.5" />
              <path d="M30 46 C38 42 45 42 50 44" stroke="#c2a264" strokeWidth="2" />
              <path d="M50 44 C55 42 62 42 70 46" stroke="#c2a264" strokeWidth="2" />
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg sm:text-xl font-bold tracking-wider text-[#e4c281] uppercase leading-none">
                Grimoire MTG
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#2b2a27] text-[#c2a264] border border-[#4d463a] hidden sm:inline">
                {activePoolCode}
              </span>
            </div>
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#998f81] block font-medium">
              MTG Sealed Deckbuilder
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1c1a17] border border-[#2e2a24] rounded-lg p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#2b2a27] text-[#e4c281] shadow-xs border border-[#c2a264]/50'
                    : 'text-[#998f81] hover:text-[#e6e2de] hover:bg-[#211f1d]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c2a264]' : 'text-[#7a7365]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Viewport Simulator & PWA Install */}
        <div className="flex items-center gap-2">
          {/* Viewport Frame Toggle (lets user verify mobile vs desktop mode) */}
          <div className="hidden sm:flex items-center bg-[#1c1a17] border border-[#2e2a24] rounded-md p-0.5 text-xs">
            <button
              onClick={() => onViewportModeChange('responsive')}
              className={`p-1.5 rounded transition ${
                viewportMode === 'responsive'
                  ? 'bg-[#2b2a27] text-[#c2a264]'
                  : 'text-[#7a7365] hover:text-[#d0c5b5]'
              }`}
              title="Layout Fluido Responsivo"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewportModeChange('mobile_frame')}
              className={`p-1.5 rounded transition ${
                viewportMode === 'mobile_frame'
                  ? 'bg-[#2b2a27] text-[#c2a264]'
                  : 'text-[#7a7365] hover:text-[#d0c5b5]'
              }`}
              title="Simular Moldura Mobile (iPhone / Android)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <PWAInstallButton className="hidden sm:flex" />
        </div>
      </div>
    </header>
  );
};
