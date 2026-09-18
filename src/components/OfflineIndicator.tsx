import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded px-3 py-1.5 text-xs font-medium bg-[#7b2d26] text-[#ffdad6] border border-[#ffb4ab]/30 shadow-lg animate-pulse">
      <WifiOff className="w-3.5 h-3.5" />
      <span>Modo Offline Ativo — Grimório utilizando dados em cache local.</span>
    </div>
  );
};
