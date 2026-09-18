import React, { useState } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled || justInstalled) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-[#c2a264] px-2.5 py-1 rounded bg-[#1c1a17] border border-[#332e26] ${className}`}>
        <Check className="w-3.5 h-3.5" />
        <span className="font-mono text-[11px]">Grimório Instalado</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={async () => {
          const ok = await install();
          if (ok) setJustInstalled(true);
        }}
        className={`flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-[#c2a264] text-[#141311] hover:bg-[#d4b77d] transition shadow-sm font-sans ${className}`}
        title="Instalar App no dispositivo (Mobile / Desktop)"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar no Dispositivo</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium border border-[#9a7b3e] text-[#e4c281] bg-[#1c1a17] hover:bg-[#26231f] transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#c2a264]" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-lg bg-[#1c1a17] border border-[#9a7b3e] p-6 shadow-2xl text-[#e6e2de]">
              <div className="flex items-center justify-between pb-3 border-b border-[#332e26]">
                <h3 className="font-serif text-lg font-semibold text-[#e4c281]">Instalar no iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-[#998f81] hover:text-[#e6e2de] p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-[#d0c5b5]">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#332e26] text-[#e4c281] text-xs flex items-center justify-center font-bold">1</span>
                  <p>Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima) na barra inferior do Safari.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#332e26] text-[#e4c281] text-xs flex items-center justify-center font-bold">2</span>
                  <p>Role o menu para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#332e26] text-[#e4c281] text-xs flex items-center justify-center font-bold">3</span>
                  <p>Confirme clicando em <strong>Adicionar</strong> no canto superior direito para portabilidade nativa total.</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded bg-[#c2a264] py-2 text-xs font-semibold text-[#141311] hover:bg-[#d4b77d] transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers without beforeinstallprompt: provide portable guidance button
  return (
    <button
      id="btn-pwa-portable"
      onClick={() => setShowIOSGuide(true)}
      className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium border border-[#332e26] text-[#d0c5b5] bg-[#1c1a17] hover:border-[#9a7b3e] hover:text-[#e4c281] transition ${className}`}
      title="Portabilidade Web e Mobile"
    >
      <Smartphone className="w-3.5 h-3.5 text-[#c2a264]" />
      <span>Portabilidade Mobile/Web</span>

      {showIOSGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-md rounded-lg bg-[#1c1a17] border border-[#9a7b3e] p-6 shadow-2xl text-[#e6e2de]">
            <div className="flex items-center justify-between pb-3 border-b border-[#332e26]">
              <h3 className="font-serif text-lg font-semibold text-[#e4c281]">Portabilidade Mobile & Web</h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-[#998f81] hover:text-[#e6e2de] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 space-y-4 text-xs text-[#d0c5b5] leading-relaxed">
              <p>
                Este aplicativo foi projetado como um <strong>Progressive Web App (PWA) de Alto Desempenho</strong>, compatível para uso e empacotamento em:
              </p>
              <ul className="space-y-2 list-disc list-inside text-[#e6e2de]">
                <li><strong className="text-[#e4c281]">Navegadores Web:</strong> Desktop (Chrome, Firefox, Safari, Edge) em tela cheia.</li>
                <li><strong className="text-[#e4c281]">Mobile Nativo (PWA):</strong> Instalável diretamente via menu do navegador no Android e iOS com ícone dedicado e modo offline.</li>
                <li><strong className="text-[#e4c281]">Portabilidade Capacitor / Cordova:</strong> Código fonte React 19 + TypeScript 100% desacoplado, pronto para compilar em APK Android e IPA iOS sem alterações.</li>
              </ul>
              <div className="p-3 bg-[#141311] border border-[#332e26] rounded text-[11px] text-[#998f81]">
                💡 <em>Dica: Use o seletor de visualização no topo para alternar entre a moldura móvel e a visualização em códice para desktop.</em>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded bg-[#c2a264] py-2 text-xs font-semibold text-[#141311] hover:bg-[#d4b77d] transition"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </button>
  );
};
