/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewTab, ViewportMode, SealedPool, Deck, Card } from './types';
import { INITIAL_POOLS, INITIAL_DECK } from './data/defaultPools';
import { buildOptimizedDeck } from './utils/deckEngine';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CompendioView } from './components/CompendioView';
import { RegistrarView } from './components/RegistrarView';
import { DeckAtivoView } from './components/DeckAtivoView';
import { AjustesView } from './components/AjustesView';
import { CardInspectModal } from './components/CardInspectModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Sparkles, Dna, Cpu } from 'lucide-react';

const STORAGE_KEY_POOLS = 'grimoire_mtg_pools_v1';
const STORAGE_KEY_DECK = 'grimoire_mtg_deck_v1';

export default function App() {
  const [pools, setPools] = useState<SealedPool[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_POOLS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved pools:', e);
      }
    }
    return INITIAL_POOLS;
  });

  const [activePoolId, setActivePoolId] = useState<string>(() => {
    return pools[0]?.id || 'pool-blb-01';
  });

  const [deck, setDeck] = useState<Deck>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DECK);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved deck:', e);
      }
    }
    return INITIAL_DECK;
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('deck_ativo');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('responsive');
  const [inspectedCard, setInspectedCard] = useState<Card | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');

  // Persist state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_POOLS, JSON.stringify(pools));
  }, [pools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(deck));
  }, [deck]);

  const activePool = pools.find(p => p.id === activePoolId) || pools[0];

  const handleSelectPool = (poolId: string) => {
    setActivePoolId(poolId);
  };

  const handleStartNewPool = () => {
    const newId = `pool-${Date.now()}`;
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newPool: SealedPool = {
      id: newId,
      code: `#${codeNum}-ARC`,
      title: 'Nova Pool Selada',
      setCode: 'BLB',
      setName: 'Bloomburrow [BLB]',
      status: 'rascunho',
      totalCount: 0,
      cards: {},
      createdAt: new Date().toISOString(),
    };

    setPools([newPool, ...pools]);
    setActivePoolId(newId);
    setActiveTab('registrar');
  };

  const handleDeletePool = (poolId: string) => {
    if (pools.length <= 1) return;
    const remaining = pools.filter(p => p.id !== poolId);
    setPools(remaining);
    if (activePoolId === poolId) {
      setActivePoolId(remaining[0].id);
    }
  };

  const handleUpdatePoolCards = (updatedCards: Record<string, number>, newTotal: number) => {
    setPools(prev =>
      prev.map(p => {
        if (p.id === activePoolId) {
          return {
            ...p,
            cards: updatedCards,
            totalCount: newTotal,
            status: newTotal >= 84 ? 'confirmado' : 'rascunho',
          };
        }
        return p;
      })
    );
  };

  const handleForgeDeck = () => {
    setIsGenerating(true);
    setGenerationStep('Iniciando Motor Genético e Mapeamento de Sinergias...');

    setTimeout(() => {
      setGenerationStep('Avaliando densidade de Evasão e Remoções (CMC 1-3)...');
    }, 500);

    setTimeout(() => {
      setGenerationStep('Otimizando Hipergeométrica da Base de Terrenos (17 Lands)...');
    }, 1000);

    setTimeout(() => {
      const generated = buildOptimizedDeck(activePool, { generationsCount: 240 });
      setDeck(generated);

      // Update pool score
      setPools(prev =>
        prev.map(p =>
          p.id === activePoolId
            ? {
                ...p,
                score: generated.score,
                recommendedColors: generated.exegesis.colorPair.name,
                deckId: generated.id,
              }
            : p
        )
      );

      setIsGenerating(false);
      setActiveTab('deck_ativo');
    }, 1600);
  };

  const handleRegenerateSeed = () => {
    const regenerated = buildOptimizedDeck(activePool, {
      generationsCount: Math.floor(220 + Math.random() * 60),
    });
    setDeck(regenerated);
  };

  const handleResetDefaults = () => {
    setPools(INITIAL_POOLS);
    setActivePoolId(INITIAL_POOLS[0].id);
    setDeck(INITIAL_DECK);
    setActiveTab('deck_ativo');
    localStorage.removeItem(STORAGE_KEY_POOLS);
    localStorage.removeItem(STORAGE_KEY_DECK);
  };

  return (
    <div className="min-h-screen bg-[#141311] text-[#e6e2de] flex flex-col antialiased">
      <OfflineIndicator />

      {/* Top Brand Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewportMode={viewportMode}
        onViewportModeChange={setViewportMode}
        activePoolCode={activePool?.code}
      />

      {/* Main Viewport Workspace */}
      <main className="flex-1 pb-20 md:pb-12">
        {viewportMode === 'mobile_frame' ? (
          /* Mobile Simulated Frame (iPhone / Android container) */
          <div className="max-w-md mx-auto my-6 px-4">
            <div className="relative rounded-[40px] border-[10px] border-[#2b2a27] bg-[#141311] shadow-2xl overflow-hidden min-h-[780px] flex flex-col">
              {/* Top Notch Speaker Bar */}
              <div className="h-6 bg-[#211f1d] flex items-center justify-center relative">
                <div className="w-20 h-3.5 bg-[#141311] rounded-full" />
              </div>

              {/* Inner Mobile Screen Content */}
              <div className="flex-1 overflow-y-auto p-4 pb-20">
                {activeTab === 'compendio' && (
                  <CompendioView
                    pools={pools}
                    activePoolId={activePoolId}
                    onSelectPool={(id) => {
                      handleSelectPool(id);
                      setActiveTab('registrar');
                    }}
                    onOpenDeck={(deckId) => {
                      setActiveTab('deck_ativo');
                    }}
                    onStartNewPool={handleStartNewPool}
                    onDeletePool={handleDeletePool}
                  />
                )}

                {activeTab === 'registrar' && (
                  <RegistrarView
                    activePool={activePool}
                    onUpdatePoolCards={handleUpdatePoolCards}
                    onForgeDeck={handleForgeDeck}
                    onInspectCard={setInspectedCard}
                  />
                )}

                {activeTab === 'deck_ativo' && (
                  <DeckAtivoView
                    deck={deck}
                    pool={activePool}
                    onInspectCard={setInspectedCard}
                    onRegenerate={handleRegenerateSeed}
                  />
                )}

                {activeTab === 'ajustes' && (
                  <AjustesView onResetDefaults={handleResetDefaults} />
                )}
              </div>

              {/* Mobile Frame Bottom Navigation */}
              <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <p className="text-center text-xs text-[#7a7365] font-mono mt-3">
              Moldura de Simulação Mobile (PWA & App Nativo) • Toque nos ícones inferiores para navegar
            </p>
          </div>
        ) : (
          /* Fluid Responsive Layout (Default Desktop & Native Mobile) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {activeTab === 'compendio' && (
              <CompendioView
                pools={pools}
                activePoolId={activePoolId}
                onSelectPool={(id) => {
                  handleSelectPool(id);
                  setActiveTab('registrar');
                }}
                onOpenDeck={(deckId) => {
                  setActiveTab('deck_ativo');
                }}
                onStartNewPool={handleStartNewPool}
                onDeletePool={handleDeletePool}
              />
            )}

            {activeTab === 'registrar' && (
              <RegistrarView
                activePool={activePool}
                onUpdatePoolCards={handleUpdatePoolCards}
                onForgeDeck={handleForgeDeck}
                onInspectCard={setInspectedCard}
              />
            )}

            {activeTab === 'deck_ativo' && (
              <DeckAtivoView
                deck={deck}
                pool={activePool}
                onInspectCard={setInspectedCard}
                onRegenerate={handleRegenerateSeed}
              />
            )}

            {activeTab === 'ajustes' && (
              <AjustesView onResetDefaults={handleResetDefaults} />
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Nav for Small Screen Devices (Fluid Mode) */}
      {viewportMode === 'responsive' && (
        <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Card Inspection Modal */}
      <CardInspectModal
        card={inspectedCard}
        onClose={() => setInspectedCard(null)}
      />

      {/* Algorithmic Generation Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-lg bg-[#1c1a17] border border-[#c2a264] p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#26231f] border border-[#c2a264] flex items-center justify-center mx-auto text-[#e4c281] animate-pulse">
              <Sparkles className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#e4c281]">
                Forjando Deck Otimizado
              </h3>
              <p className="text-xs text-[#998f81] font-sans mt-1">
                Executando 240 gerações heurísticas...
              </p>
            </div>
            <div className="p-3 rounded bg-[#141311] border border-[#2e2a24] text-[11px] font-mono text-[#c2a264]">
              {generationStep}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
