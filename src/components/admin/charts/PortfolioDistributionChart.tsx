import React from 'react';
import { motion } from 'motion/react';
import { MapPin, PieChart, Building, ArrowUpRight } from 'lucide-react';
import { Property } from '../../../types';

interface PortfolioDistributionChartProps {
  properties: Property[];
}

export const PortfolioDistributionChart: React.FC<PortfolioDistributionChartProps> = ({ properties }) => {
  // Region & Neighborhood distribution dynamically calculated from real inventory
  const neighborhoodMap: Record<string, number> = {};
  properties.forEach(p => {
    const neigh = p.neighborhood ? `${p.neighborhood} (${p.city || 'Contagem'})` : 'Bairro Arvoredo (Contagem)';
    neighborhoodMap[neigh] = (neighborhoodMap[neigh] || 0) + 1;
  });

  const totalProps = Math.max(1, properties.length);
  const colorPalette = ['#0B2545', '#16655E', '#C59B27', '#6366F1', '#EC4899', '#94A3B8'];

  const neighborhoods = Object.entries(neighborhoodMap).map(([name, count], idx) => ({
    name,
    count,
    percent: Math.round((count / totalProps) * 100),
    avgM2: 7850,
    color: colorPalette[idx % colorPalette.length]
  }));

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-50 text-teal-800">
              <MapPin className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Concentração Regional do Inventário
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição por bairros foco em Contagem e região metropolitana
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 font-mono">
          R$ 7.950/m² médio
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {neighborhoods.map((n, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: n.color }} />
                <span>{n.name}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-500 text-[11px]">R$ {n.avgM2.toLocaleString('pt-BR')}/m²</span>
                <span className="font-bold text-slate-900 font-mono">{n.percent}%</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${n.percent}%` }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="h-full rounded-full"
                style={{ backgroundColor: n.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Foco Estratégico: Rua Pinheiro 264, Arvoredo</span>
        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" /> Alta Demanda Residencial
        </span>
      </div>
    </div>
  );
};
