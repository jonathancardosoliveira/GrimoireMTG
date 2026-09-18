import React, { useState } from 'react';
import { Deck, Card, SealedPool } from '../types';
import { CardRow } from './CardRow';
import { ManaCurveHistogram } from './ManaCurveHistogram';
import { ManaBadge } from './ManaBadge';
import { generateArenaDecklist, copyToClipboard } from '../utils/arenaExport';
import {
  Copy,
  RefreshCw,
  Download,
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Swords,
  Scroll,
  Info,
  Layers,
  Wand2
} from 'lucide-react';

interface DeckAtivoViewProps {
  deck: Deck;
  pool: SealedPool;
  onInspectCard: (card: Card) => void;
  onRegenerate: () => void;
  onSelectArchetypeBias?: (bias: 'orzhov' | 'golgari' | 'selesnya' | 'dimir') => void;
}

export const DeckAtivoView: React.FC<DeckAtivoViewProps> = ({
  deck,
  pool,
  onInspectCard,
  onRegenerate,
  onSelectArchetypeBias,
}) => {
  const [copied, setCopied] = useState(false);
  const [sideboardOpen, setSideboardOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'mainboard' | 'exegesis'>('mainboard');
  const [isGenerating, setIsGenerating] = useState(false);

  // Group cards into creatures and non-creatures
  const creatures = deck.mainboard.filter(e => e.card.type === 'Criatura');
  const nonCreatures = deck.mainboard.filter(e => e.card.type !== 'Criatura');

  const totalCreatures = creatures.reduce((acc, e) => acc + e.count, 0);
  const totalNonCreatures = nonCreatures.reduce((acc, e) => acc + e.count, 0);
  const totalLands = Object.values(deck.basicLands).reduce((acc, count) => acc + count, 0);
  const totalCards = totalCreatures + totalNonCreatures + totalLands;

  // Build CMC distribution
  const cmcDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  for (const entry of deck.mainboard) {
    const bucket = entry.card.cmc >= 6 ? 6 : entry.card.cmc || 1;
    cmcDist[bucket] = (cmcDist[bucket] || 0) + entry.count;
  }

  const handleCopyArena = async () => {
    const list = generateArenaDecklist(deck);
    const success = await copyToClipboard(list);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleExportTxt = () => {
    const list = generateArenaDecklist(deck);
    const blob = new Blob([list], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deck.title.replace(/\s+/g, '_')}_Arena.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const triggerRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      onRegenerate();
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Deck Header Bar */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#c2a264]">{pool.code}</span>
              <h2 className="font-serif text-2xl font-bold text-[#e4c281]">
                {deck.title}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#2b2a27] text-[#e6e2de] border border-[#4d463a]">
                {pool.setName}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#998f81] mt-1 font-sans flex-wrap">
              <span>{deck.archetype}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                {deck.colors.map(col => (
                  <ManaBadge key={col} color={col} size="sm" />
                ))}
              </div>
              <span>•</span>
              <span className="text-[#a5d6a7]">Sinergia Orzhov: 92%</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btn-copiar-arena"
              onClick={handleCopyArena}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[#c2a264] text-[#141311] hover:bg-[#d4b77d] transition shadow"
              title="Copiar lista de deck compatível com MTG Arena"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado p/ Arena!' : 'Copiar p/ Arena'}</span>
            </button>

            <button
              id="btn-regenerar-seed"
              onClick={triggerRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded bg-[#26231f] border border-[#4d463a] text-[#d0c5b5] hover:border-[#c2a264] hover:text-[#e4c281] transition disabled:opacity-50"
              title="Regerar deck utilizando nova seed aleatória no motor genético"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c2a264] ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerar Seed</span>
            </button>

            <button
              onClick={handleExportTxt}
              className="p-2 text-xs rounded bg-[#26231f] border border-[#4d463a] text-[#998f81] hover:text-[#e6e2de] hover:border-[#7a7365] transition"
              title="Baixar arquivo .TXT"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Toggle Bar (visible on smaller screens) */}
        <div className="flex lg:hidden mt-4 pt-3 border-t border-[#2e2a24] gap-2">
          <button
            onClick={() => setMobileTab('mainboard')}
            className={`flex-1 py-2 text-xs font-serif font-semibold rounded transition border ${
              mobileTab === 'mainboard'
                ? 'bg-[#2b2a27] text-[#e4c281] border-[#c2a264]'
                : 'bg-[#141311] text-[#998f81] border-[#332e26]'
            }`}
          >
            Folium Sinistrum (Mainboard)
          </button>
          <button
            onClick={() => setMobileTab('exegesis')}
            className={`flex-1 py-2 text-xs font-serif font-semibold rounded transition border ${
              mobileTab === 'exegesis'
                ? 'bg-[#2b2a27] text-[#e4c281] border-[#c2a264]'
                : 'bg-[#141311] text-[#998f81] border-[#332e26]'
            }`}
          >
            Folium Dextrum (Exegese IA)
          </button>
        </div>
      </div>

      {/* Two-Leaf Grimoire Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT LEAF: FOLIUM SINISTRUM (Mainboard Codex) */}
        <div
          className={`lg:col-span-7 space-y-4 ${
            mobileTab === 'exegesis' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-4 shadow-sm space-y-4">
            {/* Leaf Title */}
            <div className="flex items-center justify-between border-b border-[#2e2a24] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#998f81] block">
                  Folium Sinistrum
                </span>
                <h3 className="font-serif text-xl font-bold text-[#e6e2de]">
                  Códice do Mainboard
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-[#c2a264] px-2 py-0.5 rounded bg-[#2b2a27] border border-[#4d463a]">
                  {totalCards}/40 Cartas
                </span>
                <span className="text-[10px] text-[#7a7365] block mt-0.5 font-mono">
                  {totalCreatures + totalNonCreatures} Mágicas • {totalLands} Terrenos
                </span>
              </div>
            </div>

            {/* Mana Curve Histogram */}
            <ManaCurveHistogram
              distribution={cmcDist}
              avgCmc={deck.exegesis.curveArch.avgCmc}
              targetFit={98}
            />

            {/* Creatures Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-[#e4c281] border-b border-[#2e2a24] pb-1">
                <span className="flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-[#c2a264]" />
                  Criaturas ({totalCreatures})
                </span>
                <span className="text-[11px] font-mono text-[#7a7365]">CMC 1–5</span>
              </div>
              <div className="space-y-1.5">
                {creatures.map(entry => (
                  <CardRow
                    key={entry.card.id}
                    card={entry.card}
                    count={entry.count}
                    mode="deck"
                    onInspect={onInspectCard}
                  />
                ))}
              </div>
            </div>

            {/* Non-Creatures / Removals Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-[#e4c281] border-b border-[#2e2a24] pb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#c2a264]" />
                  Remoções & Mágicas ({totalNonCreatures})
                </span>
                <span className="text-[11px] font-mono text-[#7a7365]">CMC 1–3</span>
              </div>
              <div className="space-y-1.5">
                {nonCreatures.map(entry => (
                  <CardRow
                    key={entry.card.id}
                    card={entry.card}
                    count={entry.count}
                    mode="deck"
                    onInspect={onInspectCard}
                  />
                ))}
              </div>
            </div>

            {/* Basic Lands Section */}
            <div className="space-y-2 pt-2 border-t border-[#2e2a24]">
              <div className="flex items-center justify-between text-xs font-serif font-bold text-[#e4c281] pb-1">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#c2a264]" />
                  Terrenos Básicos ({totalLands})
                </span>
                <span className="text-[11px] font-mono text-[#7a7365]">17 Recomendados</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-[#141311] border border-[#2e2a24] rounded p-2.5">
                  <div className="flex items-center gap-2">
                    <ManaBadge color="W" size="sm" />
                    <div>
                      <span className="text-xs font-medium text-[#e6e2de]">Planícies</span>
                      <span className="text-[10px] text-[#7a7365] block font-mono">13 pips no deck</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#c2a264]">
                    {deck.basicLands.W}x
                  </span>
                </div>

                <div className="flex items-center justify-between bg-[#141311] border border-[#2e2a24] rounded p-2.5">
                  <div className="flex items-center gap-2">
                    <ManaBadge color="B" size="sm" />
                    <div>
                      <span className="text-xs font-medium text-[#e6e2de]">Pântanos</span>
                      <span className="text-[10px] text-[#7a7365] block font-mono">11 pips no deck</span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#c2a264]">
                    {deck.basicLands.B}x
                  </span>
                </div>
              </div>
            </div>

            {/* Sideboard Collapsible */}
            <div className="pt-2 border-t border-[#2e2a24]">
              <button
                onClick={() => setSideboardOpen(!sideboardOpen)}
                className="w-full flex items-center justify-between text-xs text-[#998f81] hover:text-[#e4c281] py-1 transition font-mono"
              >
                <span>Sideboard ({deck.sideboard.reduce((a, b) => a + b.count, 0)} cartas)</span>
                {sideboardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {sideboardOpen && (
                <div className="space-y-1.5 mt-2 pt-2 border-t border-[#25221d]">
                  {deck.sideboard.map(entry => (
                    <CardRow
                      key={entry.card.id}
                      card={entry.card}
                      count={entry.count}
                      mode="deck"
                      onInspect={onInspectCard}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT LEAF: FOLIUM DEXTRUM (Exegesis of the Grimoire) */}
        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === 'mainboard' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5 shadow-sm space-y-5">
            {/* Exegesis Header */}
            <div className="border-b border-[#2e2a24] pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#c2a264] block">
                    Folium Dextrum
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#e4c281]">
                    Exegese do Grimório
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono font-bold text-[#c2a264]">
                    {deck.score} <small className="text-[10px] text-[#7a7365]">/ 100</small>
                  </span>
                  <span className="text-[10px] text-[#a5d6a7] block font-mono">
                    Ótimo Local
                  </span>
                </div>
              </div>

              {/* Execution telemetry */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#25221d] text-center text-[10px] font-mono text-[#998f81]">
                <div className="bg-[#141311] p-1.5 rounded border border-[#2e2a24]">
                  <span className="text-[#7a7365] block">Motor</span>
                  <span className="text-[#e6e2de] font-semibold">{deck.exegesis.motor}</span>
                </div>
                <div className="bg-[#141311] p-1.5 rounded border border-[#2e2a24]">
                  <span className="text-[#7a7365] block">Convergência</span>
                  <span className="text-[#e6e2de] font-semibold">{deck.exegesis.convergence}</span>
                </div>
                <div className="bg-[#141311] p-1.5 rounded border border-[#2e2a24]">
                  <span className="text-[#7a7365] block">Cálculo</span>
                  <span className="text-[#e6e2de] font-semibold">{deck.exegesis.calcTime}</span>
                </div>
              </div>
            </div>

            {/* Section 1: Color Pair Synergy & Reasoning */}
            <div className="space-y-2">
              <h4 className="font-serif text-sm font-bold text-[#e4c281] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2a264]" />
                1. Pareamento de Cores & Sinergia
              </h4>
              <p className="text-xs text-[#d0c5b5] font-sans leading-relaxed">
                {deck.exegesis.colorPair.reasoning}
              </p>

              {/* Viability Bar Chart */}
              <div className="space-y-1.5 pt-2">
                {deck.exegesis.colorPair.alternatives.map((alt, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-[#998f81]">{alt.label}</span>
                      <span className="text-[#e6e2de] font-bold">{alt.viability}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#141311] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${alt.viability}%`,
                          backgroundColor: alt.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tactical Callout */}
              <div className="p-2.5 rounded bg-[#182836] border border-[#3c5a72]/60 text-xs text-[#90caf9] leading-relaxed mt-2">
                <strong>{deck.exegesis.colorPair.evasionTip}</strong>
              </div>
            </div>

            {/* Section 2: Military Core & Anchor Cards */}
            <div className="space-y-3 pt-3 border-t border-[#2e2a24]">
              <h4 className="font-serif text-sm font-bold text-[#e4c281] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2a264]" />
                2. Núcleo Militar: {deck.exegesis.militaryCore.title}
              </h4>
              <p className="text-xs text-[#998f81] font-sans">
                {deck.exegesis.militaryCore.summary}
              </p>

              <div className="space-y-2">
                {deck.exegesis.militaryCore.anchorCards.map((anchor, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded bg-[#141311] border border-[#2e2a24] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#e6e2de]">{anchor.badge}</span>
                      <span className="text-[10px] font-mono text-[#c2a264]">Prioridade Alta</span>
                    </div>
                    <p className="text-[11px] text-[#d0c5b5] font-sans leading-relaxed">
                      {anchor.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Curve Architecture */}
            <div className="space-y-2 pt-3 border-t border-[#2e2a24]">
              <h4 className="font-serif text-sm font-bold text-[#e4c281] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c2a264]" />
                3. Arquitetura da Curva & Velocidade
              </h4>
              <p className="text-xs text-[#d0c5b5] font-sans leading-relaxed">
                {deck.exegesis.curveArch.summary}
              </p>
            </div>

            {/* Section 4: Secret Combo / Pairing Tip */}
            {deck.exegesis.secretCombo && (
              <div className="p-3 rounded bg-[#2b2416] border border-[#9a7b3e]/60 text-xs text-[#ffd54f] space-y-1">
                <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-[#e4c281]">
                  <Wand2 className="w-4 h-4 text-[#c2a264]" />
                  <span>{deck.exegesis.secretCombo.title}</span>
                </div>
                <p className="text-[11px] text-[#e6e2de] leading-relaxed font-sans">
                  {deck.exegesis.secretCombo.desc}
                </p>
              </div>
            )}

            {/* Section 5: Codex Regula Quote */}
            <div className="pt-3 border-t border-[#2e2a24] text-center">
              <p className="font-serif italic text-xs text-[#c2a264] tracking-wide">
                {deck.exegesis.codexQuote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
