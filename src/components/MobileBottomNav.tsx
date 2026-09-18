import React from 'react';
import { ViewTab } from '../types';
import { BookOpen, PlusCircle, Layers, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  unreadCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  const items: { id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'compendio', label: 'Compêndio', icon: BookOpen },
    { id: 'registrar', label: 'Registrar', icon: PlusCircle },
    { id: 'deck_ativo', label: 'Deck Ativo', icon: Layers },
    { id: 'ajustes', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141311]/95 backdrop-blur-lg border-t border-[#332e26] safe-bottom shadow-2xl">
      <div className="grid grid-cols-4 h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-colors min-h-[44px] ${
                isActive ? 'text-[#e4c281]' : 'text-[#7a7365] hover:text-[#d0c5b5]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#c2a264]' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#c2a264]" />
                )}
              </div>
              <span className="text-[10px] font-sans font-medium tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
