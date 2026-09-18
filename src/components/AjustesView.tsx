import React, { useState } from 'react';
import { Smartphone, Monitor, CheckCircle, ShieldCheck, Cpu, Database, Sliders, RefreshCcw } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AjustesViewProps {
  onResetDefaults: () => void;
}

export const AjustesView: React.FC<AjustesViewProps> = ({ onResetDefaults }) => {
  const { isInstalled } = usePWAInstall();
  const [synergyWeight, setSynergyWeight] = useState(65);
  const [curveWeight, setCurveWeight] = useState(80);
  const [evasionWeight, setEvasionWeight] = useState(90);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Portability Focus Header */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2e2a24] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-[#c2a264]" />
              <h2 className="font-serif text-2xl font-bold text-[#e4c281]">
                Portabilidade Mobile & Web
              </h2>
            </div>
            <p className="text-xs text-[#998f81] mt-1 font-sans">
              Status do ecossistema multiplataforma (PWA, Web Desktop, Android APK e iOS Safari).
            </p>
          </div>

          <PWAInstallButton />
        </div>

        {/* Platform Compliance Checklist */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-3.5 rounded bg-[#141311] border border-[#2e2a24] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e4c281]">
              <Monitor className="w-4 h-4 text-[#c2a264]" />
              <span>Ambiente Web Desktop</span>
            </div>
            <p className="text-[11px] text-[#998f81] font-sans leading-relaxed">
              Layout de códice com páginas duplas (« Folium Sinistrum » e « Folium Dextrum »), atalhos de teclado, exportação para MTG Arena e tela cheia.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#a5d6a7] font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>100% Responsivo e Otimizado</span>
            </div>
          </div>

          <div className="p-3.5 rounded bg-[#141311] border border-[#2e2a24] space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#e4c281]">
              <Smartphone className="w-4 h-4 text-[#c2a264]" />
              <span>Ambiente Mobile Nativo (PWA / App)</span>
            </div>
            <p className="text-[11px] text-[#998f81] font-sans leading-relaxed">
              Barra inferior de toque de 44px, suporte a entalhe (Safe Area Insets), Service Worker com cache offline e manifesto standalone.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#a5d6a7] font-mono">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isInstalled ? 'Instalado como App Standalone' : 'Pronto para Instalação no Dispositivo'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heuristic Engine Configuration */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-[#2e2a24] pb-3">
          <Sliders className="w-4 h-4 text-[#c2a264]" />
          <h3 className="font-serif text-lg font-bold text-[#e6e2de]">
            Calibragem do Motor Genético de Selado
          </h3>
        </div>

        <div className="space-y-4 text-xs font-sans">
          <div>
            <div className="flex justify-between text-[#d0c5b5] mb-1">
              <span>Peso da Sinergia Tribal & Mecânica:</span>
              <span className="font-mono text-[#c2a264]">{synergyWeight}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={synergyWeight}
              onChange={(e) => setSynergyWeight(Number(e.target.value))}
              className="w-full accent-[#c2a264]"
            />
            <span className="text-[10px] text-[#7a7365]">Prioriza combinações de cartas (ex: Morcegos + Ganho de Vida) sobre bombas isoladas fora da curva.</span>
          </div>

          <div>
            <div className="flex justify-between text-[#d0c5b5] mb-1">
              <span>Rigidez da Curva de Mana (Early Game CMC 2):</span>
              <span className="font-mono text-[#c2a264]">{curveWeight}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="100"
              value={curveWeight}
              onChange={(e) => setCurveWeight(Number(e.target.value))}
              className="w-full accent-[#c2a264]"
            />
            <span className="text-[10px] text-[#7a7365]">Penaliza mãos pesadas com muitas mágicas de custo 5+ em formatos agressivos como Bloomburrow.</span>
          </div>

          <div>
            <div className="flex justify-between text-[#d0c5b5] mb-1">
              <span>Valorização de Evasão (Voar / Ameaçar / Não-bloqueável):</span>
              <span className="font-mono text-[#c2a264]">{evasionWeight}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={evasionWeight}
              onChange={(e) => setEvasionWeight(Number(e.target.value))}
              className="w-full accent-[#c2a264]"
            />
            <span className="text-[10px] text-[#7a7365]">Busca quebrar mesas travadas no Selado priorizando dano pelo ar.</span>
          </div>
        </div>
      </div>

      {/* Local Storage & Reset */}
      <div className="bg-[#1c1a17] border border-[#332e26] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c2a264]" />
            <h3 className="font-serif text-base font-bold text-[#e6e2de]">
              Armazenamento Local e Persistência
            </h3>
          </div>
          <p className="text-xs text-[#998f81] mt-0.5">
            Os dados de suas pools e decks são salvos localmente no armazenamento do dispositivo com sincronização instantânea.
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded bg-[#2b1f1f] text-[#ffb4ab] hover:bg-[#3b2727] border border-[#7b2d26] transition"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Restaurar Pools Padrão</span>
        </button>
      </div>
    </div>
  );
};
