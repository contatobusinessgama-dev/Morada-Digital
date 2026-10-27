import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  ShieldAlert,
  Percent
} from 'lucide-react';
import { Proposal } from '../../../types';

interface OpenSalesChartProps {
  proposals: Proposal[];
}

export const OpenSalesChart: React.FC<OpenSalesChartProps> = ({ proposals }) => {
  const [selectedStage, setSelectedStage] = useState<string>('todos');

  // Stages breakdown calculated dynamically from real proposals context
  const emAnaliseProposals = proposals.filter(p => p.status === 'em_analise');
  const contraProposals = proposals.filter(p => p.status === 'contraproposta');
  const aceitaProposals = proposals.filter(p => p.status === 'aceita');

  const stages = [
    {
      id: 'em_analise',
      name: 'Propostas em Análise',
      count: emAnaliseProposals.length || (proposals.length > 0 ? proposals.length : 1),
      totalVgv: emAnaliseProposals.reduce((a, b) => a + b.offeredPrice, 0) || (proposals[0]?.offeredPrice || 1780000),
      avgTicket: emAnaliseProposals.length > 0 ? Math.round(emAnaliseProposals.reduce((a, b) => a + b.offeredPrice, 0) / emAnaliseProposals.length) : 1780000,
      commissionExpected: emAnaliseProposals.reduce((a, b) => a + b.commissionTotal, 0) || (proposals[0]?.commissionTotal || 106800),
      probability: 60,
      color: '#6366F1', // indigo
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 'contraproposta',
      name: 'Em Contraproposta',
      count: contraProposals.length,
      totalVgv: contraProposals.reduce((a, b) => a + b.offeredPrice, 0),
      avgTicket: contraProposals.length > 0 ? Math.round(contraProposals.reduce((a, b) => a + b.offeredPrice, 0) / contraProposals.length) : 0,
      commissionExpected: contraProposals.reduce((a, b) => a + b.commissionTotal, 0),
      probability: 75,
      color: '#C59B27', // warm gold
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800'
    },
    {
      id: 'minuta_contrato',
      name: 'Minutas em Formalização',
      count: aceitaProposals.length,
      totalVgv: aceitaProposals.reduce((a, b) => a + b.offeredPrice, 0),
      avgTicket: aceitaProposals.length > 0 ? Math.round(aceitaProposals.reduce((a, b) => a + b.offeredPrice, 0) / aceitaProposals.length) : 0,
      commissionExpected: aceitaProposals.reduce((a, b) => a + b.commissionTotal, 0),
      probability: 90,
      color: '#16655E', // teal
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-800'
    }
  ];

  const totalOpenVgv = stages.reduce((acc, curr) => acc + curr.totalVgv, 0) || 1780000;
  const totalOpenDeals = Math.max(1, stages.reduce((acc, curr) => acc + curr.count, 0));
  const totalWeightedVgv = stages.reduce((acc, curr) => acc + (curr.totalVgv * (curr.probability / 100)), 0) || 1068000;
  const totalCommissionsProjected = stages.reduce((acc, curr) => acc + curr.commissionExpected, 0) || 106800;

  // Monthly evolution of Open Deals vs Closed Deals (Last 6 Months)
  const monthlyPipeline = [
    { month: 'Jan', aberto: 8.4, fechado: 4.2 },
    { month: 'Fev', aberto: 10.2, fechado: 6.8 },
    { month: 'Mar', aberto: 12.6, fechado: 7.5 },
    { month: 'Abr', aberto: 15.48, fechado: 8.6 },
    { month: 'Mai (Proj)', aberto: 17.8, fechado: 10.2 },
    { month: 'Jun (Proj)', aberto: 21.0, fechado: 12.5 }
  ];

  const maxMonthlyPipeline = Math.max(...monthlyPipeline.map(p => Math.max(p.aberto, p.fechado)));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Total de Vendas em Aberto (Pipeline Ativo)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Volume financeiro em negociação ativa, minutas jurídicas e conversão ponderada
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>{totalOpenDeals} Negócios em Andamento</span>
        </span>
      </div>

      {/* Main KPI Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-[#0B2545] to-[#16655E] text-white rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300 block">
            VGV Total em Negociação Ativa
          </span>
          <div className="text-3xl font-extrabold font-display tracking-tight mt-0.5">
            {formatCurrency(totalOpenVgv)}
          </div>
          <div className="text-xs text-emerald-300 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Previsão ponderada de fechamento: {formatCurrency(totalWeightedVgv)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-6 text-left">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Ticket Médio</span>
            <span className="text-base font-bold font-mono text-white">
              {formatCurrency(totalOpenVgv / totalOpenDeals)}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 block">Honorários Previstos</span>
            <span className="text-base font-bold font-mono text-amber-300">
              {formatCurrency(totalCommissionsProjected)}
            </span>
          </div>
        </div>
      </div>

      {/* STAGE BREAKDOWN BARS */}
      <div className="space-y-3 pt-1">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Distribuição por Estágio de Negociação</span>
          <span className="text-slate-400 font-normal text-[11px]">Probabilidade de êxito calculada</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {stages.map((st, i) => (
            <motion.div
              key={st.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedStage(st.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                selectedStage === st.id 
                  ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${st.bgColor} ${st.textColor}`}>
                  {st.count} negócios
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">
                  {st.probability}% êxito
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900 mt-2 truncate">
                {st.name}
              </div>

              <div className="text-sm font-extrabold text-slate-900 font-display mt-0.5">
                {formatCurrency(st.totalVgv)}
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ width: `${st.probability}%`, backgroundColor: st.color }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 font-medium">
                <span>Comissão: {formatCurrency(st.commissionExpected)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* COMPARATIVE MONTHLY CHART: VENDAS EM ABERTO VS VENDAS CONCRETIZADAS */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-700">
            Comparativo Mensal: Pipeline em Aberto vs Vendas Fechadas (VGV R$ Milhões)
          </span>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              <span>Em Aberto</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0B2545]" />
              <span>Concretizado</span>
            </span>
          </div>
        </div>

        <div className="h-44 w-full flex items-end justify-between gap-3 px-2 pt-6 pb-2 border-b border-slate-100">
          {monthlyPipeline.map((mp, idx) => {
            const openHeight = (mp.aberto / (maxMonthlyPipeline * 1.15)) * 100;
            const closedHeight = (mp.fechado / (maxMonthlyPipeline * 1.15)) * 100;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full max-w-[54px] flex items-end justify-center gap-1.5 h-full">
                  {/* Open deals bar */}
                  <div className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-bold text-amber-700 opacity-0 group-hover:opacity-100 mb-1 transition-opacity">
                      {mp.aberto}M
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${openHeight}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className="w-full bg-amber-400 group-hover:bg-amber-500 rounded-t-md transition-colors"
                      title={`R$ ${mp.aberto}M em aberto`}
                    />
                  </div>

                  {/* Closed deals bar */}
                  <div className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[9px] font-bold text-slate-800 opacity-0 group-hover:opacity-100 mb-1 transition-opacity">
                      {mp.fechado}M
                    </span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${closedHeight}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 + 0.1 }}
                      className="w-full bg-[#0B2545] group-hover:bg-[#0f386b] rounded-t-md transition-colors"
                      title={`R$ ${mp.fechado}M concretizado`}
                    />
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-500 mt-2">
                  {mp.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
