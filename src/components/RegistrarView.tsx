import React, { useState } from 'react';
import { SealedPool, Card, ManaColor, CardRarity } from '../types';
import { CARD_DATABASE } from '../data/cards';
import { CardRow } from './CardRow';
import { ManaBadge } from './ManaBadge';
import { Search, Sparkles, PlusCircle, CheckCircle, PackagePlus, Zap } from 'lucide-react';

interface RegistrarViewProps {
  activePool: SealedPool;
  onUpdatePoolCards: (updatedCards: Record<string, number>, newTotal: number) => void;
  onForgeDeck: () => void;
  onInspectCard: (card: Card) => void;
}

export const RegistrarView: React.FC<RegistrarViewProps> = ({
  activePool,
  onUpdatePoolCards,
  onForgeDeck,
  onInspectCard,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColor, setSelectedColor] = useState<ManaColor | 'all'>('all');
  const [selectedRarity, setSelectedRarity] = useState<CardRarity | 'all'>('all');
  const [onlyInPool, setOnlyInPool] = useState(false);

  // Available cards for active set
  const setCards = CARD_DATABASE.filter(c => c.setCode === activePool.setCode);

  // Filter cards
  const filteredCards = setCards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.oracleText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.subtype && card.subtype.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesColor =
      selectedColor === 'all' ||
      card.colors.includes(selectedColor as ManaColor) ||
      (selectedColor === 'C' && card.colors.length === 0);

    const matchesRarity = selectedRarity === 'all' || card.rarity === selectedRarity;

    const countInPool = activePool.cards[card.id] || 0;
    const matchesOnlyInPool = !onlyInPool || countInPool > 0;

    return matchesSearch && matchesColor && matchesRarity && matchesOnlyInPool;
  });

  const handleAddCard = (cardId: string) => {
    const current = activePool.cards[cardId] || 0;
    const updated = { ...activePool.cards, [cardId]: current + 1 };
    onUpdatePoolCards(updated, activePool.totalCount + 1);
  };

  const handleRemoveCard = (cardId: string) => {
    const current = activePool.cards[cardId] || 0;
    if (current <= 0) return;
    const updated = { ...activePool.cards };
    if (current === 1) {
      delete updated[cardId];
    } else {
      updated[cardId] = current - 1;
    }
    onUpdatePoolCards(updated, Math.max(0, activePool.totalCount - 1));
  };

  const handleSimulateBooster = () => {
    // Add 1 rare/mythic, 3 uncommons, 10 commons from set
    const rares = setCards.filter(c => c.rarity === 'rare' || c.rarity === 'mythic');
    const uncommons = setCards.filter(c => c.rarity === 'uncommon');
    const commons = setCards.filter(c => c.rarity === 'common');

    const updated = { ...activePool.cards };
    let added = 0;

    // Pick 1 rare
    if (rares.length > 0) {
      const r = rares[Math.floor(Math.random() * rares.length)];
      updated[r.id] = (updated[r.id] || 0) + 1;
      added += 1;
    }
    // Pick 3 uncommons
    for (let i = 0; i < 3; i++) {
      if (uncommons.length > 0) {
        const u = uncommons[Math.floor(Math.random() * uncommons.length)];
        updated[u.id] = (updated[u.id] || 0) + 1;
        added += 1;
      }
    }
    // Pick 10 commons
    for (let i = 0; i < 10; i++) {
      if (commons.length > 0) {
        const c = commons[Math.floor(Math.random() * commons.length)];
        updated[c.id] = (updated[c.id] || 0) + 1;
        added += 1;
      }
    }

    onUpdatePoolCards(updated, activePool.totalCount + added);
  };

  const handleFillRealisticPool = () => {
    const updated: Record<string, number> = {};
    let count = 0;
    for (const card of setCards) {
      const qty = card.rarity === 'mythic' ? 1 : card.rarity === 'rare' ? 1 : card.rarity === 'uncommon' ? 2 : 3;
      updated[card.id] = qty;
      count += qty;
    }
    onUpdatePoolCards(updated, count);
  };

  const progressPct = Math.min(100, Math.round((activePool.totalCount / 84) * 100));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header Info */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#2e2a24] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#c2a264]">{activePool.code}</span>
              <h2 className="font-serif text-2xl font-bold text-[#e4c281]">
                Registrar Pool Selada
              </h2>
            </div>
            <p className="text-xs text-[#998f81] font-sans mt-0.5">
              Edição: <strong className="text-[#e6e2de]">{activePool.setName}</strong> • Adicione as 84 cartas obtidas nos 6 boosters para forjar o deck.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateBooster}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-[#26231f] border border-[#4d463a] text-[#d0c5b5] hover:border-[#c2a264] hover:text-[#e4c281] transition font-sans"
              title="Gera 14 cartas proporcionais aleatórias da edição"
            >
              <PackagePlus className="w-3.5 h-3.5 text-[#c2a264]" />
              <span>+1 Booster (14 Cartas)</span>
            </button>

            <button
              onClick={handleFillRealisticPool}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded bg-[#2b2a27] border border-[#c2a264]/40 text-[#e4c281] hover:bg-[#363432] transition font-sans"
              title="Preenche instantaneamente uma pool competitiva completa"
            >
              <Zap className="w-3.5 h-3.5 text-[#ffd54f]" />
              <span>Autopreencher Pool</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-[#998f81]">Progresso do Selado:</span>
            <span className={activePool.totalCount >= 40 ? 'text-[#a5d6a7]' : 'text-[#ffd54f]'}>
              <strong>{activePool.totalCount}</strong> / 84 Cartas ({progressPct}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#141311] overflow-hidden border border-[#2e2a24]">
            <div
              className={`h-full transition-all duration-300 ${
                activePool.totalCount >= 40 ? 'bg-[#c2a264]' : 'bg-[#ffd54f]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-[#1c1a17] border border-[#2e2a24] rounded-lg p-3.5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#7a7365] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome, tipo, texto de regras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141311] border border-[#332e26] rounded pl-9 pr-3 py-1.5 text-xs text-[#e6e2de] placeholder-[#7a7365] focus:outline-none focus:border-[#c2a264]"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setSelectedColor('all')}
              className={`px-2 py-1 rounded text-xs font-mono transition border ${
                selectedColor === 'all'
                  ? 'bg-[#2b2a27] text-[#e4c281] border-[#c2a264]'
                  : 'bg-[#141311] text-[#998f81] border-[#332e26]'
              }`}
            >
              Todas
            </button>
            {(['W', 'U', 'B', 'R', 'G', 'C'] as ManaColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(selectedColor === c ? 'all' : c)}
                className={`p-1 rounded transition border ${
                  selectedColor === c
                    ? 'ring-2 ring-[#c2a264] border-transparent'
                    : 'border-[#332e26] hover:border-[#7a7365]'
                }`}
                title={`Filtrar por mana {${c}}`}
              >
                <ManaBadge color={c} size="sm" />
              </button>
            ))}

            <div className="h-4 w-px bg-[#332e26] mx-1" />

            <button
              onClick={() => setOnlyInPool(!onlyInPool)}
              className={`px-2 py-1 rounded text-xs font-sans transition border ${
                onlyInPool
                  ? 'bg-[#2b2a27] text-[#e4c281] border-[#c2a264]'
                  : 'bg-[#141311] text-[#998f81] border-[#332e26]'
              }`}
            >
              Na Pool ({Object.values(activePool.cards).reduce((a, b) => a + b, 0)})
            </button>
          </div>
        </div>

        {/* Rarities Row */}
        <div className="flex items-center gap-2 text-xs font-mono pt-2 border-t border-[#25221d] overflow-x-auto">
          <span className="text-[#7a7365]">Raridade:</span>
          {[
            { id: 'all', label: 'Todas' },
            { id: 'mythic', label: 'Míticas' },
            { id: 'rare', label: 'Raras' },
            { id: 'uncommon', label: 'Incomuns' },
            { id: 'common', label: 'Comuns' },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRarity(r.id as CardRarity | 'all')}
              className={`px-2 py-0.5 rounded text-[11px] transition ${
                selectedRarity === r.id
                  ? 'bg-[#2b2a27] text-[#c2a264] border border-[#c2a264]/60'
                  : 'text-[#998f81] hover:text-[#e6e2de]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List with Stepper */}
      <div className="space-y-2">
        {filteredCards.length === 0 ? (
          <div className="text-center py-12 bg-[#1c1a17] border border-[#2e2a24] rounded-lg text-xs text-[#998f81]">
            Nenhuma carta encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredCards.map((card) => {
            const count = activePool.cards[card.id] || 0;
            return (
              <CardRow
                key={card.id}
                card={card}
                count={count}
                mode="catalog"
                onAdd={() => handleAddCard(card.id)}
                onRemove={() => handleRemoveCard(card.id)}
                onInspect={onInspectCard}
              />
            );
          })
        )}
      </div>

      {/* Floating or bottom Action Button to Forge Deck */}
      <div className="sticky bottom-4 z-20 flex justify-end">
        <button
          id="btn-forjar-deck"
          onClick={onForgeDeck}
          className="flex items-center gap-2 rounded-lg bg-[#c2a264] px-6 py-3 text-sm font-bold text-[#141311] shadow-xl hover:bg-[#d4b77d] transition transform active:scale-95 border border-[#ffdea4]/50"
        >
          <Sparkles className="w-4 h-4 text-[#141311]" />
          <span>Forjar Deck Otimizado com IA</span>
        </button>
      </div>
    </div>
  );
};
