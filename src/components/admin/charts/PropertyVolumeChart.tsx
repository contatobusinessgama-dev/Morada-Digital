import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, TrendingUp, Filter, Home, Layers } from 'lucide-react';
import { Property } from '../../../types';

interface PropertyVolumeChartProps {
  properties: Property[];
}

export const PropertyVolumeChart: React.FC<PropertyVolumeChartProps> = ({ properties }) => {
  const [viewMode, setViewMode] = useState<'mensal' | 'tipo'>('mensal');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Monthly property registration history (last 6 months leading up to April 2026)
  const monthlyData = [
    { month: 'Nov/25', total: 16, venda: 10, locacao: 6, vgvCadastrado: 24.5 },
    { month: 'Dez/25', total: 21, venda: 13, locacao: 8, vgvCadastrado: 32.8 },
    { month: 'Jan/26', total: 27, venda: 18, locacao: 9, vgvCadastrado: 44.2 },
    { month: 'Fev/26', total: 32, venda: 21, locacao: 11, vgvCadastrado: 51.0 },
    { month: 'Mar/26', total: 38, venda: 25, locacao: 13, vgvCadastrado: 63.4 },
    { month: 'Abr/26', total: 46, venda: 31, locacao: 15, vgvCadastrado: 78.9 }
  ];

  // Property types distribution count from real properties context
  const typeCounts = {
    apartamento: properties.filter(p => p.type === 'apartamento').length,
    casa_condominio: properties.filter(p => p.type === 'casa_condominio' || p.type === 'casa').length,
    cobertura: properties.filter(p => p.type === 'cobertura').length,
    studio: properties.filter(p => p.type === 'studio').length,
    lancamento: properties.filter(p => p.goal === 'lancamento').length
  };

  const totalTypes = Object.values(typeCounts).reduce((a, b) => a + b, 0) || 1;

  const typeData = [
    { label: 'Apartamentos', count: typeCounts.apartamento, color: '#0B2545', bg: 'bg-[#0B2545]' },
    { label: 'Casas / Condomínio', count: typeCounts.casa_condominio, color: '#16655E', bg: 'bg-[#16655E]' },
    { label: 'Coberturas Nobres', count: typeCounts.cobertura, color: '#C59B27', bg: 'bg-[#C59B27]' },
    { label: 'Studios & Compactos', count: typeCounts.studio, color: '#6366F1', bg: 'bg-indigo-500' },
    { label: 'Lançamentos na Planta', count: typeCounts.lancamento, color: '#EC4899', bg: 'bg-pink-500' }
  ];

  const maxMonthly = Math.max(...monthlyData.map(m => m.total));

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-[#0B2545]">
              <Building2 className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Volume de Imóveis Cadastrados
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evolução mensal de captação e inventário ativo na imobiliária
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold self-start sm:self-auto">
          <button
            onClick={() => setViewMode('mensal')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'mensal'
                ? 'bg-[#0B2545] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Evolução Mensal
          </button>
          <button
            onClick={() => setViewMode('tipo')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === 'tipo'
                ? 'bg-[#0B2545] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Tipologia
          </button>
        </div>
      </div>

      {/* KPI Micro Highlights */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ativo</span>
          <div className="text-lg font-extrabold text-slate-900 font-display">
            {properties.length} <span className="text-xs font-normal text-slate-500">imóveis</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <TrendingUp className="w-3 h-3" /> +21% este mês
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Venda vs Locação</span>
          <div className="text-lg font-extrabold text-[#0B2545] font-display">
            {properties.filter(p => p.goal === 'venda').length} <span className="text-xs font-normal text-slate-400">/</span> {properties.filter(p => p.goal === 'locacao').length}
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            {Math.round((properties.filter(p => p.goal === 'venda').length / Math.max(1, properties.length)) * 100)}% carteira de venda
          </span>
        </div>

        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">VGV em Carteira</span>
          <div className="text-lg font-extrabold text-[#16655E] font-display">
            R$ {(properties.reduce((a, b) => a + b.price, 0) / 1000000).toFixed(1)}M
          </div>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
            Ticket médio: R$ {(properties.reduce((a, b) => a + b.price, 0) / Math.max(1, properties.length) / 1000).toFixed(0)}k
          </span>
        </div>
      </div>

      {/* CHART VIEW 1: EVOLUÇÃO MENSAL (INTERACTIVE BARS + GRADIENT PILLARS) */}
      {viewMode === 'mensal' ? (
        <div className="space-y-4 pt-2">
          {/* Chart Graphic Canvas */}
          <div className="relative h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-8 pb-2 border-b border-slate-100">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-dashed border-slate-200 w-full" />
              <div className="border-b border-slate-200 w-full" />
            </div>

            {monthlyData.map((item, idx) => {
              const heightPercent = (item.total / (maxMonthly * 1.15)) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div 
                  key={idx} 
                  className="relative flex-1 flex flex-col items-center h-full justify-end group z-10"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Floating Interactive Tooltip */}
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-16 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-center pointer-events-none z-30 min-w-[120px]"
                    >
                      <div className="text-[10px] text-slate-300 font-semibold">{item.month}</div>
                      <div className="text-xs font-bold text-white mt-0.5">
                        {item.total} novos imóveis
                      </div>
                      <div className="text-[9px] text-amber-300 font-medium">
                        {item.venda} vendas • {item.locacao} locações
                      </div>
                      <div className="text-[9px] text-emerald-400 font-mono mt-0.5">
                        VGV: R$ {item.vgvCadastrado}M
                      </div>
                    </motion.div>
                  )}

                  {/* Value on top of bar */}
                  <span className={`text-[10px] font-bold mb-1.5 transition-all ${
                    isHovered ? 'text-[#0B2545] scale-110' : 'text-slate-500'
                  }`}>
                    {item.total}
                  </span>

                  {/* Stacked Pillar Bar */}
                  <div className="w-full max-w-[42px] flex flex-col justify-end rounded-t-xl overflow-hidden bg-slate-100 shadow-xs group-hover:shadow-md transition-all">
                    {/* Venda Segment (Deep Navy) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.venda / (maxMonthly * 1.15)) * 100}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 }}
                      className={`w-full transition-colors ${
                        isHovered ? 'bg-[#0f386b]' : 'bg-[#0B2545]'
                      }`}
                      title={`${item.venda} para Venda`}
                    />
                    {/* Locação Segment (Teal) */}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(item.locacao / (maxMonthly * 1.15)) * 100}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.08 + 0.1 }}
                      className={`w-full transition-colors ${
                        isHovered ? 'bg-[#1b7a70]' : 'bg-[#16655E]'
                      }`}
                      title={`${item.locacao} para Locação`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className={`text-[11px] font-semibold mt-2 transition-colors ${
                    isHovered ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#0B2545]" />
                <span className="text-[11px] font-medium">Imóveis p/ Venda</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#16655E]" />
                <span className="text-[11px] font-medium">Imóveis p/ Locação</span>
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Taxa de captação: ~7 novos imóveis/semana
            </span>
          </div>
        </div>
      ) : (
        /* CHART VIEW 2: DISTRIBUIÇÃO POR TIPOLOGIA */
        <div className="space-y-4 pt-2">
          <div className="space-y-3">
            {typeData.map((t, i) => {
              const percent = Math.round((t.count / totalTypes) * 100);
              return (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span>{t.label}</span>
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-slate-900">{t.count} unidades</span>
                      <span className="text-[11px] text-slate-400 font-medium">({percent}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between text-xs text-blue-900">
            <span className="font-medium">Concentração predominante:</span>
            <span className="font-bold">Apartamentos Médio/Alto Padrão e Casas Coloniais</span>
          </div>
        </div>
      )}

    </div>
  );
};
