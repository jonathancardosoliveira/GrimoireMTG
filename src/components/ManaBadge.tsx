import React from 'react';
import { ManaColor } from '../types';

interface ManaBadgeProps {
  color: ManaColor;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const MANA_MAP: Record<ManaColor, { symbol: string; label: string; text: string; bg: string; border: string }> = {
  W: { symbol: '☼', label: 'Branco', text: '#f6f4ee', bg: '#423d33', border: '#7a7365' },
  U: { symbol: '💧', label: 'Azul', text: '#90caf9', bg: '#1c3144', border: '#2b4c6f' },
  B: { symbol: '💀', label: 'Preto', text: '#d0c5b5', bg: '#25211d', border: '#4d463a' },
  R: { symbol: '🔥', label: 'Vermelho', text: '#ffab91', bg: '#421d18', border: '#7b2d26' },
  G: { symbol: '🌳', label: 'Verde', text: '#a5d6a7', bg: '#1b3823', border: '#335c3c' },
  C: { symbol: '◇', label: 'Incolor', text: '#cfd8dc', bg: '#2b2a27', border: '#4d463a' },
};

export const ManaBadge: React.FC<ManaBadgeProps> = ({ color, size = 'md', showLabel = false }) => {
  const config = MANA_MAP[color] || MANA_MAP.C;
  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  return (
    <span className="inline-flex items-center gap-1.5 align-middle">
      <span
        className={`inline-flex items-center justify-center rounded-full font-bold shadow-inner ${sizeClasses[size]}`}
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.border}`,
        }}
        title={`Mana ${config.label} ({${color}})`}
      >
        <span className="leading-none scale-90">{config.symbol}</span>
      </span>
      {showLabel && <span className="text-xs text-[#d0c5b5] font-sans">{config.label}</span>}
    </span>
  );
};

export const ManaCostDisplay: React.FC<{ cost: string }> = ({ cost }) => {
  if (!cost) return null;

  const tokens = cost.match(/\{[^}]+\}|\/\/|[WUBRGC0-9X]+/g) || [cost];

  return (
    <span className="inline-flex items-center gap-0.5">
      {tokens.map((rawToken, index) => {
        const token = rawToken.replace(/^\{|\}$/g, '');

        if (token === '//') {
          return <span key={`${token}-${index}`} className="text-[#998f81] text-xs font-mono">/</span>;
        }

        if (token.length === 1 && ['W', 'U', 'B', 'R', 'G', 'C'].includes(token)) {
          return <ManaBadge key={`${token}-${index}`} color={token as ManaColor} size="sm" />;
        }

        return (
          <span
            key={`${token}-${index}`}
            className="min-w-4 h-4 px-0.5 inline-flex items-center justify-center rounded-full bg-[#2b2a27] text-[#e6e2de] text-[10px] font-mono font-bold border border-[#4d463a]"
          >
            {token}
          </span>
        );
      })}
    </span>
  );
};
