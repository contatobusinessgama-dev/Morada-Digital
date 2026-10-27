import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  Users, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight, 
  ShieldCheck, 
  DollarSign, 
  Target,
  ChevronRight,
  Flame,
  Star,
  Eye,
  Key
} from 'lucide-react';
import { User } from '../../../types';

interface BrokerPerformanceChartProps {
  team: User[];
}

export const BrokerPerformanceChart: React.FC<BrokerPerformanceChartProps> = ({ team }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('Abril/2026');
  const [metricView, setMetricView] = useState<'vgv' | 'vendas' | 'visitas'>('vgv');
  const [selectedBrokerModal, setSelectedBrokerModal] = useState<any | null>(null);

  // Monthly dataset for broker individual performance across months
  const monthlyBrokerRecords: Record<string, Array<{
    id: string;
    name: string;
    creci: string;
    avatar: string;
    salesGoal: number;
    salesVgv: number;
    openVgv: number;
    closedDeals: number;
    visitsCount: number;
    commissionGenerated: number;
    leadsHandled: number;
    badge?: string;
  }>> = {
    'Janeiro/2026': [
      { id: 'usr-1', name: 'Rodrigo Mendonça', creci: 'CRECI 189.442-F/MG', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', salesGoal: 8000000, salesVgv: 4200000, openVgv: 2100000, closedDeals: 3, visitsCount: 14, commissionGenerated: 189000, leadsHandled: 12, badge: 'Top VGV' },
      { id: 'usr-2', name: 'Camila Vasconcelos', creci: 'CRECI 204.119-F/MG', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', salesGoal: 6000000, salesVgv: 2800000, openVgv: 1900000, closedDeals: 2, visitsCount: 18, commissionGenerated: 126000, leadsHandled: 15, badge: 'Mais Visitas' },
      { id: 'usr-3', name: 'Lucas Arantes', creci: 'CRECI 162.830-F/MG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', salesGoal: 3500000, salesVgv: 1200000, openVgv: 1400000, closedDeals: 1, visitsCount: 10, commissionGenerated: 54000, leadsHandled: 9 },
      { id: 'usr-4', name: 'Patrícia Alvarenga', creci: 'CRECI 229.801-F/MG', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', salesGoal: 4000000, salesVgv: 1500000, openVgv: 1100000, closedDeals: 1, visitsCount: 11, commissionGenerated: 67500, leadsHandled: 8 }
    ],
    'Fevereiro/2026': [
      { id: 'usr-1', name: 'Rodrigo Mendonça', creci: 'CRECI 189.442-F/MG', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', salesGoal: 9000000, salesVgv: 6100000, openVgv: 2800000, closedDeals: 4, visitsCount: 19, commissionGenerated: 274500, leadsHandled: 14, badge: 'Top VGV' },
      { id: 'usr-2', name: 'Camila Vasconcelos', creci: 'CRECI 204.119-F/MG', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', salesGoal: 6500000, salesVgv: 3900000, openVgv: 2300000, closedDeals: 3, visitsCount: 22, commissionGenerated: 175500, leadsHandled: 16, badge: 'Mais Visitas' },
      { id: 'usr-4', name: 'Patrícia Alvarenga', creci: 'CRECI 229.801-F/MG', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', salesGoal: 4500000, salesVgv: 2200000, openVgv: 1600000, closedDeals: 2, visitsCount: 13, commissionGenerated: 99000, leadsHandled: 9 },
      { id: 'usr-3', name: 'Lucas Arantes', creci: 'CRECI 162.830-F/MG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', salesGoal: 4000000, salesVgv: 1600000, openVgv: 1800000, closedDeals: 2, visitsCount: 12, commissionGenerated: 72000, leadsHandled: 10 }
    ],
    'Março/2026': [
      { id: 'usr-1', name: 'Rodrigo Mendonça', creci: 'CRECI 189.442-F/MG', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', salesGoal: 10000000, salesVgv: 7400000, openVgv: 3400000, closedDeals: 5, visitsCount: 24, commissionGenerated: 333000, leadsHandled: 16, badge: 'Top VGV' },
      { id: 'usr-2', name: 'Camila Vasconcelos', creci: 'CRECI 204.119-F/MG', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', salesGoal: 7000000, salesVgv: 4500000, openVgv: 2600000, closedDeals: 3, visitsCount: 26, commissionGenerated: 202500, leadsHandled: 19, badge: 'Mais Visitas' },
      { id: 'usr-4', name: 'Patrícia Alvarenga', creci: 'CRECI 229.801-F/MG', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', salesGoal: 5000000, salesVgv: 2600000, openVgv: 2100000, closedDeals: 2, visitsCount: 15, commissionGenerated: 117000, leadsHandled: 11 },
      { id: 'usr-3', name: 'Lucas Arantes', creci: 'CRECI 162.830-F/MG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', salesGoal: 4000000, salesVgv: 1900000, openVgv: 2200000, closedDeals: 2, visitsCount: 14, commissionGenerated: 85500, leadsHandled: 12 }
    ],
    'Abril/2026': [
      { id: 'usr-1', name: 'Rodrigo Mendonça', creci: 'CRECI 189.442-F/MG', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', salesGoal: 10000000, salesVgv: 8600000, openVgv: 3800000, closedDeals: 6, visitsCount: 28, commissionGenerated: 387000, leadsHandled: 18, badge: 'Destaque do Mês' },
      { id: 'usr-2', name: 'Camila Vasconcelos', creci: 'CRECI 204.119-F/MG', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', salesGoal: 7000000, salesVgv: 4200000, openVgv: 3100000, closedDeals: 4, visitsCount: 31, commissionGenerated: 189000, leadsHandled: 19, badge: 'Recorde Visitas' },
      { id: 'usr-4', name: 'Patrícia Alvarenga', creci: 'CRECI 229.801-F/MG', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', salesGoal: 5000000, salesVgv: 2900000, openVgv: 2400000, closedDeals: 3, visitsCount: 17, commissionGenerated: 130500, leadsHandled: 14 },
      { id: 'usr-3', name: 'Lucas Arantes', creci: 'CRECI 162.830-F/MG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', salesGoal: 4000000, salesVgv: 1890000, openVgv: 2500000, closedDeals: 2, visitsCount: 15, commissionGenerated: 85050, leadsHandled: 13 }
    ],
    'Maio/2026 (Proj)': [
      { id: 'usr-1', name: 'Rodrigo Mendonça', creci: 'CRECI 189.442-F/MG', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', salesGoal: 11000000, salesVgv: 9800000, openVgv: 4500000, closedDeals: 7, visitsCount: 30, commissionGenerated: 441000, leadsHandled: 20, badge: 'Projeção Recorde' },
      { id: 'usr-2', name: 'Camila Vasconcelos', creci: 'CRECI 204.119-F/MG', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80', salesGoal: 7500000, salesVgv: 5100000, openVgv: 3600000, closedDeals: 5, visitsCount: 34, commissionGenerated: 229500, leadsHandled: 21 },
      { id: 'usr-4', name: 'Patrícia Alvarenga', creci: 'CRECI 229.801-F/MG', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80', salesGoal: 5500000, salesVgv: 3400000, openVgv: 2800000, closedDeals: 3, visitsCount: 20, commissionGenerated: 153000, leadsHandled: 16 },
      { id: 'usr-3', name: 'Lucas Arantes', creci: 'CRECI 162.830-F/MG', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', salesGoal: 4500000, salesVgv: 2400000, openVgv: 2900000, closedDeals: 3, visitsCount: 18, commissionGenerated: 108000, leadsHandled: 15 }
    ]
  };

  const registeredBrokers = team.filter(m => m.role === 'corretor');
  const baseRecords = monthlyBrokerRecords[selectedMonth] || monthlyBrokerRecords['Abril/2026'];

  // Dynamically map from active team so single example case (or new registered brokers) are respected
  const currentRecords = registeredBrokers.length > 0
    ? registeredBrokers.map(broker => {
        const hist = baseRecords.find(r => r.id === broker.id || r.name.toLowerCase() === broker.name.toLowerCase());
        return {
          id: broker.id,
          name: broker.name,
          creci: broker.creci || 'CRECI Sob Consulta',
          avatar: broker.avatar,
          salesGoal: broker.salesGoal || hist?.salesGoal || 3000000,
          salesVgv: broker.salesMonthVGV || hist?.salesVgv || 1850000,
          openVgv: hist?.openVgv || 1780000,
          closedDeals: hist?.closedDeals || 1,
          visitsCount: hist?.visitsCount || 8,
          commissionGenerated: broker.paidCommissions || hist?.commissionGenerated || 49950,
          leadsHandled: broker.activeLeadsCount || hist?.leadsHandled || 1,
          badge: hist?.badge || 'Corretor Credenciado'
        };
      })
    : baseRecords.slice(0, 1);

  const maxGoalInMonth = Math.max(...currentRecords.map(r => r.salesGoal), 1);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatShort = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
      
      {/* Header with Month Switcher and Metric Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-50 text-purple-700">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 font-display">
              Performance Individual de Corretores por Mês
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Acompanhamento comparativo de VGV realizado, metas, vendas em aberto e honorários
          </p>
        </div>

        {/* Month Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Mês:</span>
          </span>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            {Object.keys(monthlyBrokerRecords).map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedMonth === m
                    ? 'bg-[#0B2545] text-white shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {m.replace('/2026', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMPARATIVE HORIZONTAL BARS CHART: VGV REALIZADO VS META VS EM ABERTO */}
      <div className="space-y-4 pt-1">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold text-slate-800">
            Comparativo de Desempenho — {selectedMonth}
          </span>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0B2545]" />
              <span>VGV Concretizado</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Em Negociação (Aberto)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Meta Estipulada</span>
            </span>
          </div>
        </div>

        {/* Individual Broker Chart Bars */}
        <div className="space-y-4">
          {currentRecords.map((broker, idx) => {
            const percentRealized = Math.round((broker.salesVgv / broker.salesGoal) * 100);
            const percentOpen = Math.round((broker.openVgv / broker.salesGoal) * 100);

            return (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={broker.avatar}
                        alt={broker.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
                        #{idx + 1}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900">{broker.name}</h4>
                        <span className="font-mono text-[9.5px] bg-blue-50 text-[#0B2545] font-semibold px-1.5 py-0.2 rounded border border-blue-100">
                          {broker.creci}
                        </span>
                        {broker.badge && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" /> {broker.badge}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{broker.closedDeals} vendas fechadas</span>
                        <span>•</span>
                        <span>{broker.visitsCount} visitas realizadas</span>
                        <span>•</span>
                        <span>{broker.leadsHandled} leads</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Figures on Right */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">VGV Realizado</span>
                      <span className="text-sm font-extrabold text-slate-900 font-display">
                        {formatShort(broker.salesVgv)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Em Aberto</span>
                      <span className="text-sm font-extrabold text-amber-600 font-display">
                        {formatShort(broker.openVgv)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Atingimento</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
                        percentRealized >= 85 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : percentRealized >= 50
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {percentRealized}%
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedBrokerModal(broker)}
                      className="p-1.5 hover:bg-white rounded-xl text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                      title="Ver ficha analítica detalhada"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar Stack: Realizado + Aberto vs Meta */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-200/90 rounded-full h-3 overflow-hidden flex relative">
                    {/* Realized VGV (Deep Navy) */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (broker.salesVgv / broker.salesGoal) * 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                      className="h-full bg-[#0B2545] rounded-l-full relative"
                      title={`Concretizado: ${formatCurrency(broker.salesVgv)}`}
                    />

                    {/* Open Negotiations (Warm Gold) */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100 - ((broker.salesVgv / broker.salesGoal) * 100), (broker.openVgv / broker.salesGoal) * 100)}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 + 0.1 }}
                      className="h-full bg-amber-400"
                      title={`Em aberto: ${formatCurrency(broker.openVgv)}`}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>
                      Progresso: {formatShort(broker.salesVgv)} + {formatShort(broker.openVgv)} em curso
                    </span>
                    <span>
                      Meta Estipulada: {formatShort(broker.salesGoal)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* LEADERBOARD FOOTER HIGHLIGHT */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase block">Líder em VGV</span>
            <span className="text-xs font-bold text-slate-900">
              {currentRecords[0]?.name} ({formatShort(currentRecords[0]?.salesVgv || 0)})
            </span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-bold">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-blue-900 uppercase block">Maior Volume de Visitas</span>
            <span className="text-xs font-bold text-slate-900">
              {currentRecords.reduce((prev, curr) => (curr.visitsCount > prev.visitsCount ? curr : prev), currentRecords[0])?.name} ({currentRecords.reduce((prev, curr) => Math.max(prev, curr.visitsCount), 0)} visitas)
            </span>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-800 uppercase block">Comissões no Mês</span>
            <span className="text-xs font-bold text-slate-900">
              {formatCurrency(currentRecords.reduce((acc, curr) => acc + curr.commissionGenerated, 0))} apurados
            </span>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL FOR SELECTED BROKER */}
      {selectedBrokerModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedBrokerModal.avatar}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedBrokerModal.name}</h3>
                  <span className="text-xs font-mono text-slate-500">{selectedBrokerModal.creci}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedBrokerModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">VGV em {selectedMonth}</span>
                  <span className="text-base font-extrabold text-[#0B2545] font-display mt-0.5 block">
                    {formatCurrency(selectedBrokerModal.salesVgv)}
                  </span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Pipeline em Aberto</span>
                  <span className="text-base font-extrabold text-amber-700 font-display mt-0.5 block">
                    {formatCurrency(selectedBrokerModal.openVgv)}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Meta Mensal:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(selectedBrokerModal.salesGoal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vendas Formalizadas:</span>
                  <span className="font-bold text-slate-800">{selectedBrokerModal.closedDeals} contratos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Visitas com Clientes:</span>
                  <span className="font-bold text-slate-800">{selectedBrokerModal.visitsCount} realizadas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Comissão Gerada no Mês:</span>
                  <span className="font-bold text-emerald-700 font-mono">{formatCurrency(selectedBrokerModal.commissionGenerated)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBrokerModal(null)}
                className="bg-[#0B2545] text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
