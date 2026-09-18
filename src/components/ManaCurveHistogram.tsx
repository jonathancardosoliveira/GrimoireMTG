import React from 'react';

interface ManaCurveHistogramProps {
  distribution: { [cmc: number]: number };
  avgCmc?: number;
  targetFit?: number; // e.g. 98%
  compact?: boolean;
}

export const ManaCurveHistogram: React.FC<ManaCurveHistogramProps> = ({
  distribution,
  avgCmc = 2.74,
  targetFit = 98,
  compact = false,
}) => {
  const buckets = [1, 2, 3, 4, 5, 6]; // 6 represents 6+
  const maxCount = Math.max(8, ...buckets.map(b => distribution[b] || 0));

  return (
    <div className="bg-[#1c1a17] border border-[#332e26] rounded-md p-3.5 select-none">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#c2a264] font-serif font-semibold text-sm">Curva de Mana Ativa</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-[#998f81]">Méd. CMC: <strong className="text-[#e6e2de] font-semibold">{avgCmc.toFixed(2)}</strong></span>
          <span className="px-1.5 py-0.5 rounded bg-[#2b2a27] text-[#c2a264] border border-[#4d463a]/60">{targetFit}% Alvo</span>
        </div>
      </div>

      {/* Ledger Segmented Bars */}
      <div className="grid grid-cols-6 gap-2 items-end pt-3 pb-2 border-b border-[#2e2a24] min-h-[95px]">
        {buckets.map((cmc) => {
          const count = distribution[cmc] || 0;
          return (
            <div key={cmc} className="flex flex-col items-center gap-1.5 h-full justify-end">
              <span className={`text-[11px] font-mono font-medium ${count > 0 ? 'text-[#c2a264]' : 'text-[#7a7365]'}`}>
                {count}
              </span>
              
              {/* Stack of horizontal ledger plates */}
              <div className="w-full flex flex-col-reverse gap-1 justify-end max-w-[34px] min-h-[6px]">
                {count === 0 ? (
                  <div className="w-full h-1 bg-[#26231f] rounded-xs" />
                ) : (
                  Array.from({ length: count }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-2 rounded-[1px] bg-[#c2a264] shadow-xs border-b border-[#9a7b3e]/80 transition-all hover:bg-[#d4b77d]"
                      title={`CMC ${cmc >= 6 ? '6+' : cmc}: 1 Carta`}
                    />
                  ))
                )}
              </div>

              <span className="text-[11px] font-mono text-[#998f81] mt-1">
                {cmc >= 6 ? '6+' : cmc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
