import React from 'react';
import { Card } from '../types';
import { X, Sparkles, Shield, Swords, Layers } from 'lucide-react';
import { ManaCostDisplay } from './ManaBadge';

interface CardInspectModalProps {
  card: Card | null;
  onClose: () => void;
}

export const CardInspectModal: React.FC<CardInspectModalProps> = ({ card, onClose }) => {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-[#1c1a17] border border-[#9a7b3e] shadow-2xl p-6 text-[#e6e2de] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded text-[#998f81] hover:text-[#e6e2de] hover:bg-[#2b2a27] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row gap-5">
          {card.imageUrl ? (
            <div className="sm:w-48 flex-shrink-0 flex flex-col items-center">
              <img
                src={card.imageUrl}
                alt={card.name}
                className="w-full rounded-md border border-[#332e26] shadow-lg object-cover"
              />
              <span className="text-[10px] text-[#7a7365] font-mono mt-2 text-center">
                Scryfall Card Art • {card.setCode} #{card.collectorNumber}
              </span>
            </div>
          ) : (
            <div className="sm:w-44 h-56 bg-[#26231f] rounded border border-[#332e26] flex items-center justify-center text-center p-4">
              <span className="text-xs text-[#998f81]">{card.name}</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 border-b border-[#332e26] pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#e4c281] leading-tight">
                  {card.name}
                </h3>
                <p className="text-xs text-[#998f81] font-sans mt-0.5">
                  {card.subtype || card.type}
                </p>
              </div>
              <div className="text-right">
                <ManaCostDisplay cost={card.manaCost} />
                <div className="text-[11px] font-mono text-[#998f81] mt-1">
                  CMC {card.cmc}
                </div>
              </div>
            </div>

            <div className="my-3 p-3 rounded bg-[#141311] border border-[#2e2a24] text-xs text-[#d0c5b5] font-sans leading-relaxed">
              <p className="whitespace-pre-line">{card.oracleText}</p>
            </div>

            {card.power !== undefined && card.toughness !== undefined && (
              <div className="flex items-center gap-4 text-xs font-mono mb-3 p-2 bg-[#211f1d] rounded border border-[#332e26]">
                <div className="flex items-center gap-1.5 text-[#ffab91]">
                  <Swords className="w-3.5 h-3.5" />
                  <span>Poder: <strong>{card.power}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-[#90caf9]">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Resistência: <strong>{card.toughness}</strong></span>
                </div>
              </div>
            )}

            <div className="space-y-1.5 text-[11px]">
              <div className="text-[#998f81]">
                <strong>Raridade:</strong> <span className="capitalize text-[#e6e2de]">{card.rarity}</span>
              </div>
              <div className="text-[#998f81]">
                <strong>Tags Arcanas:</strong>{' '}
                <span className="text-[#c2a264]">{card.tags.join(' • ')}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#332e26] flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#998f81] font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#c2a264]" />
                Pareamento Heurístico
              </span>
              <span className="text-[11px] text-[#e4c281] font-medium">
                Prioridade calculada pelo arquétipo HOB
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#2b2a27] hover:bg-[#363432] text-xs font-medium text-[#e6e2de] transition border border-[#4d463a]"
          >
            Fechar Folio
          </button>
        </div>
      </div>
    </div>
  );
};
