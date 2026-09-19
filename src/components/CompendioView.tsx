import React, { useState } from 'react';
import { SealedPool, ManaColor } from '../types';
import { MTG_SET_OPTIONS } from '../data/mtgSets';
import { Plus, BookOpen, Layers, CheckCircle2, Clock, Trash2, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { ManaBadge } from './ManaBadge';

interface CompendioViewProps {
  pools: SealedPool[];
  activePoolId: string;
  onSelectPool: (poolId: string) => void;
  onOpenDeck: (deckId?: string) => void;
  onStartNewPool: (setCode?: string) => void;
  onDeletePool: (poolId: string) => void;
}

export const CompendioView: React.FC<CompendioViewProps> = ({
  pools,
  activePoolId,
  onSelectPool,
  onOpenDeck,
  onStartNewPool,
  onDeletePool,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [newPoolSet, setNewPoolSet] = useState('HOB');

  const filteredPools = pools.filter((pool) => {
    const matchSearch =
      pool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pool.setName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSet = selectedSet === 'all' || pool.setCode === selectedSet;
    return matchSearch && matchSet;
  });

  const totalCardsCataloged = pools.reduce((acc, p) => acc + p.totalCount, 0);
  const avgScore = (
    pools.reduce((acc, p) => acc + (p.score || 75), 0) / (pools.length || 1)
  ).toFixed(1);

  const recentDecks = [...pools].slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner & Personal Stats */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2e2a24] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#c2a264]" />
              <h2 className="font-serif text-2xl font-bold text-[#e4c281]">
                Histórico de Decks
              </h2>
            </div>
            <p className="text-xs text-[#998f81] mt-1 font-sans">
              Veja os decks salvos e escolha o prerelease que você está jogando.
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="bg-[#141311] border border-[#2e2a24] p-2.5 rounded">
            <span className="text-[10px] text-[#7a7365] uppercase font-mono tracking-wider block">Pools Registradas</span>
            <span className="text-lg font-mono font-bold text-[#e6e2de]">{pools.length}</span>
          </div>
          <div className="bg-[#141311] border border-[#2e2a24] p-2.5 rounded">
            <span className="text-[10px] text-[#7a7365] uppercase font-mono tracking-wider block">Score Médio</span>
            <span className="text-lg font-mono font-bold text-[#c2a264]">{avgScore} <small className="text-[10px] text-[#7a7365]">/100</small></span>
          </div>
          <div className="bg-[#141311] border border-[#2e2a24] p-2.5 rounded">
            <span className="text-[10px] text-[#7a7365] uppercase font-mono tracking-wider block">Cartas Catalogadas</span>
            <span className="text-lg font-mono font-bold text-[#90caf9]">{totalCardsCataloged}</span>
          </div>
        </div>
      </div>

      <div className="bg-[#1c1a17] border border-[#2e2a24] rounded-lg p-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-serif text-xl text-[#e4c281]">Prerelase</h3>
            <p className="text-[11px] text-[#998f81]">Escolha o produto que você está jogando para carregar apenas as cartas do pacote.</p>
          </div>

          <select
            value={newPoolSet}
            onChange={(event) => setNewPoolSet(event.target.value)}
            className="bg-[#141311] border border-[#332e26] text-[#e6e2de] text-xs rounded px-2 py-2 focus:outline-none focus:border-[#c2a264]"
            aria-label="Selecionar prerelease"
          >
            {MTG_SET_OPTIONS.map((set) => (
              <option key={set.code} value={set.code}>
                {set.name} [{set.code}]
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MTG_SET_OPTIONS.map((set) => (
            <button
              key={set.code}
              onClick={() => {
                setNewPoolSet(set.code);
                onStartNewPool(set.code);
              }}
              className={`rounded border p-4 text-left transition ${
                newPoolSet === set.code
                  ? 'border-[#c2a264] bg-[#2b2a27] text-[#e4c281]'
                  : 'border-[#332e26] bg-[#141311] text-[#e6e2de] hover:border-[#7a7365]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-serif text-lg font-bold">{set.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#998f81] mt-1">{set.code}</div>
                </div>
                <ArrowRight className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-[#998f81] mt-2">Cartas do prerelease {set.code} e pool do evento.</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1c1a17] border border-[#2e2a24] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif text-xl text-[#e4c281]">Decks salvos</h3>
          <button
            onClick={() => onStartNewPool(newPoolSet)}
            className="flex items-center justify-center gap-2 rounded bg-[#c2a264] px-3 py-2 text-xs font-semibold text-[#141311] hover:bg-[#d4b77d] transition shadow font-sans"
          >
            <Plus className="w-4 h-4" />
            <span>Novo deck</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentDecks.map((pool) => (
            <button
              key={pool.id}
              onClick={() => onSelectPool(pool.id)}
              className="rounded border border-[#332e26] bg-[#141311] p-3 text-left hover:border-[#c2a264] transition"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c2a264]">{pool.setCode}</span>
                <span className="text-[10px] text-[#998f81]">{pool.totalCount} cartas</span>
              </div>
              <div className="font-serif text-lg mt-2 text-[#e6e2de]">{pool.title}</div>
              <div className="text-[11px] text-[#998f81] mt-1">{pool.setName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Buscar por código (#0094), nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1c1a17] border border-[#332e26] rounded px-3 py-1.5 text-xs text-[#e6e2de] placeholder-[#7a7365] focus:outline-none focus:border-[#c2a264]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          <span className="text-[11px] text-[#7a7365] flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3 h-3" /> Edição:
          </span>
          {[{ id: 'all', label: 'Todas' }, ...MTG_SET_OPTIONS.map((set) => ({ id: set.code, label: `${set.name} [${set.code}]` }))].map((set) => (
            <button
              key={set.id}
              onClick={() => setSelectedSet(set.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition flex-shrink-0 border ${
                selectedSet === set.id
                  ? 'bg-[#2b2a27] text-[#e4c281] border-[#c2a264]'
                  : 'bg-[#1c1a17] text-[#998f81] border-[#332e26] hover:border-[#7a7365]'
              }`}
            >
              {set.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPools.map((pool) => {
          const isComplete = pool.totalCount >= 84;
          const isSelected = pool.id === activePoolId;

          return (
            <div
              key={pool.id}
              className={`group bg-[#1c1a17] border rounded-lg p-4 transition-all duration-200 flex flex-col justify-between hover:border-[#9a7b3e] shadow ${
                isSelected ? 'border-[#c2a264] ring-1 ring-[#c2a264]/30' : 'border-[#2e2a24]'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 border-b border-[#2e2a24] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#c2a264]">
                      {pool.code}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#2b2a27] text-[#d0c5b5] border border-[#332e26]">
                      {pool.setCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {pool.status === 'confirmado' ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e2e1e] text-[#a5d6a7] border border-[#335c3c]">
                        <CheckCircle2 className="w-3 h-3" /> Confirmado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#332717] text-[#ffd54f] border border-[#7a5e2a]">
                        <Clock className="w-3 h-3" /> Em Rascunho
                      </span>
                    )}
                  </div>
                </div>

                {/* Pool Title & Set */}
                <div className="mt-3">
                  <h3 className="font-serif text-lg font-bold text-[#e6e2de] group-hover:text-[#ffd54f] transition">
                    {pool.title}
                  </h3>
                  <p className="text-xs text-[#998f81] font-sans mt-0.5">{pool.setName}</p>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] font-mono mb-1">
                    <span className="text-[#998f81]">Cartas Catalogadas</span>
                    <span className={isComplete ? 'text-[#a5d6a7]' : 'text-[#ffd54f]'}>
                      {pool.totalCount} / 84 ({Math.min(100, Math.round((pool.totalCount / 84) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#141311] overflow-hidden border border-[#2e2a24]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isComplete ? 'bg-[#c2a264]' : 'bg-[#ffd54f]'
                      }`}
                      style={{ width: `${Math.min(100, (pool.totalCount / 84) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Algorithmic recommendation details */}
                {pool.recommendedColors && (
                  <div className="mt-3.5 p-2.5 rounded bg-[#141311] border border-[#2e2a24] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {pool.colorCodes?.map((col) => (
                          <ManaBadge key={col} color={col} size="sm" />
                        ))}
                        <span className="font-medium text-[#e6e2de] text-[11px]">
                          {pool.recommendedColors}
                        </span>
                      </div>
                      {pool.score && (
                        <span className="font-mono text-xs font-bold text-[#c2a264]">
                          {pool.score} <span className="text-[10px] text-[#7a7365]">pts</span>
                        </span>
                      )}
                    </div>
                    {pool.synergyArchetype && (
                      <p className="text-[11px] text-[#7a7365] italic">{pool.synergyArchetype}</p>
                    )}
                  </div>
                )}

                {/* Key Rares */}
                {pool.keyRares && pool.keyRares.length > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-[#7a7365] font-mono uppercase">Raras:</span>
                    {pool.keyRares.map((rare, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#26231f] text-[#c2a264] border border-[#332e26]"
                      >
                        {rare}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-[#2e2a24] flex items-center justify-between gap-2">
                <button
                  onClick={() => onDeletePool(pool.id)}
                  className="p-1.5 text-[#7a7365] hover:text-[#ffab91] transition rounded hover:bg-[#2e1d1d]"
                  title="Excluir Pool"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPool(pool.id)}
                    className="px-2.5 py-1 text-xs rounded border border-[#332e26] text-[#d0c5b5] hover:bg-[#26231f] transition font-sans"
                  >
                    Catalogar
                  </button>
                  <button
                    onClick={() => {
                      onSelectPool(pool.id);
                      onOpenDeck(pool.deckId);
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium rounded bg-[#2b2a27] text-[#e4c281] hover:bg-[#363432] border border-[#c2a264]/60 transition"
                  >
                    <span>Abrir Códice</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
