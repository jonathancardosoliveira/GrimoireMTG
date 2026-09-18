import React, { useState } from 'react';
import { Card } from '../types';
import { ManaCostDisplay } from './ManaBadge';
import { Eye, Plus, Minus, Info } from 'lucide-react';

interface CardRowProps {
  card: Card;
  count: number;
  mode?: 'deck' | 'catalog' | 'compact';
  onAdd?: () => void;
  onRemove?: () => void;
  onInspect?: (card: Card) => void;
}

export const CardRow: React.FC<CardRowProps> = ({
  card,
  count,
  mode = 'deck',
  onAdd,
  onRemove,
  onInspect,
}) => {
  const [showQuickDetail, setShowQuickDetail] = useState(false);

  // Rarity color bar
  const rarityColors: Record<string, string> = {
    mythic: '#b85c38', // Burnished Copper
    rare: '#c2a264',   // Antique Gold
    uncommon: '#95a3a4', // Silver Sage
    common: '#4a463f',  // Slate Charcoal
  };

  const badgeStyles: Record<string, string> = {
    'BOMBA MÍTICA': 'bg-[#402016] text-[#ffab91] border-[#b85c38]',
    'BOMBA': 'bg-[#3d2b0e] text-[#ffd54f] border-[#c2a264]',
    'MOTOR': 'bg-[#2b2a1a] text-[#fff59d] border-[#c2a264]/60',
    'EVASÃO': 'bg-[#182836] text-[#90caf9] border-[#3c5a72]',
    'SINERGIA MORCEGO': 'bg-[#2b211a] text-[#ffcc80] border-[#9a7b3e]',
    'EXÍLIO GLOBAL': 'bg-[#3b2a14] text-[#ffe082] border-[#c2a264]',
    'REMOÇÃO 2 CMC': 'bg-[#3b1717] text-[#ef9a9a] border-[#7b2d26]',
    'REMOÇÃO DIRETA': 'bg-[#3b1717] text-[#ef9a9a] border-[#7b2d26]',
    'LIFELINK': 'bg-[#252c1e] text-[#a5d6a7] border-[#4a6b53]',
  };

  const badgeClass = card.roleBadge && badgeStyles[card.roleBadge]
    ? badgeStyles[card.roleBadge]
    : 'bg-[#26231f] text-[#c2a264] border-[#332e26]';

  return (
    <div
      className="group relative flex flex-col bg-[#1c1a17] hover:bg-[#211f1d] border border-[#2e2a24] rounded transition-all duration-150 overflow-hidden"
    >
      {/* 2px Rarity Ribbon */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: rarityColors[card.rarity] || '#4a463f' }}
      />

      <div className="flex items-center justify-between p-2.5 pl-3.5 gap-2">
        {/* Left Quantity (for deck) or artwork thumb */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {mode === 'deck' && (
            <span className="font-mono text-sm font-semibold text-[#c2a264] w-6 flex-shrink-0">
              {count}x
            </span>
          )}

          {card.imageUrl ? (
            <img
              src={card.imageUrl}
              alt={card.name}
              className="w-8 h-8 rounded object-cover border border-[#332e26] flex-shrink-0 cursor-pointer hover:border-[#c2a264]"
              onClick={() => onInspect?.(card)}
              loading="lazy"
            />
          ) : (
            <div
              className="w-8 h-8 rounded bg-[#26231f] border border-[#332e26] flex items-center justify-center text-xs text-[#998f81] flex-shrink-0 cursor-pointer"
              onClick={() => onInspect?.(card)}
            >
              {card.type[0]}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                onClick={() => onInspect?.(card)}
                className="font-medium text-xs text-[#e6e2de] group-hover:text-[#ffd54f] transition cursor-pointer truncate"
              >
                {card.name}
              </span>

              {card.roleBadge && (
                <span className={`px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold rounded border tracking-wider ${badgeClass}`}>
                  {card.roleBadge}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#998f81] truncate font-sans mt-0.5">
              <span>{card.subtype || card.type}</span>
              {card.power !== undefined && card.toughness !== undefined && (
                <span className="text-[#c2a264] font-mono font-medium">
                  {card.power}/{card.toughness}
                </span>
              )}
              {card.tags.length > 0 && (
                <span className="text-[#7a7365] hidden sm:inline">• {card.tags.slice(0, 2).join(', ')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Mana cost & Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ManaCostDisplay cost={card.manaCost} />

          <div className="w-5 h-5 flex items-center justify-center rounded-full bg-[#141311] border border-[#332e26] text-[10px] font-mono text-[#998f81]">
            {card.cmc}
          </div>

          {/* Stepper controls if in catalog / registration mode */}
          {mode === 'catalog' && (
            <div className="flex items-center gap-1 bg-[#141311] border border-[#332e26] rounded p-0.5 ml-1">
              <button
                onClick={onRemove}
                disabled={count <= 0}
                className="w-6 h-6 flex items-center justify-center rounded text-[#998f81] hover:text-[#e6e2de] hover:bg-[#26231f] disabled:opacity-30 disabled:hover:bg-transparent"
                title="Remover 1 cópia"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-5 text-center text-xs font-mono font-semibold text-[#e4c281]">
                {count}
              </span>
              <button
                onClick={onAdd}
                className="w-6 h-6 flex items-center justify-center rounded text-[#c2a264] hover:text-white hover:bg-[#c2a264]/20"
                title="Adicionar 1 cópia"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={() => setShowQuickDetail(!showQuickDetail)}
            className="p-1 text-[#7a7365] hover:text-[#c2a264] transition rounded"
            title="Ver texto da carta"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accordion oracle text */}
      {showQuickDetail && (
        <div className="px-3.5 pb-2.5 pt-1 bg-[#161412] border-t border-[#2e2a24] text-[11px] text-[#d0c5b5] font-sans leading-relaxed">
          <p className="italic text-[#c2a264]/90 mb-1">{card.oracleText}</p>
          <div className="flex items-center justify-between text-[10px] text-[#7a7365] font-mono pt-1 border-t border-[#25221d]">
            <span>Edição: {card.setCode} #{card.collectorNumber || '—'}</span>
            <span>Raridade: {card.rarity.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
