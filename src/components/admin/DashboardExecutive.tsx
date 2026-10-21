import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Building, 
  Award, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sparkles,
  BarChart3,
  Flame,
  Filter
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';

export const DashboardExecutive: React.FC = () => {
  const { properties, leads, proposals, team, setActiveModule } = useRealEstate();
  const [period, setPeriod] = useState<'mes' | 'semana' | 'ano'>('mes');

  // Metrics
  const activePropertiesCount = properties.filter(p => p.status === 'disponivel').length;
  const reservedCount = properties.filter(p => p.status === 'reservado').length;
  const soldCount = properties.filter(p => p.status === 'vendido').length;

  const totalVGV = properties.reduce((acc, p) => acc + p.price, 0);
  const closedVGV = proposals
    .filter(pr => pr.status === 'contrato_assinado' || pr.status === 'aceita')
    .reduce((acc, pr) => acc + pr.offeredPrice, 0);

  const totalCommissions = proposals
    .filter(pr => pr.status === 'contrato_assinado')
    .reduce((acc, pr) => acc + pr.commissionTotal, 0);

  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.stage === 'fechado_ganho').length;
  const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : '0';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatShort = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  // Funnel counts
  const funnelStages = [
    { label: 'Novos Leads', count: leads.filter(l => l.stage === 'novo').length, color: 'bg-blue-500' },
    { label: 'Contato Realizado', count: leads.filter(l => l.stage === 'contato_realizado').length, color: 'bg-purple-500' },
    { label: 'Visitas Agendadas', count: leads.filter(l => l.stage === 'visita_agendada').length, color: 'bg-amber-500' },
    { label: 'Propostas Enviadas', count: leads.filter(l => l.stage === 'proposta_enviada').length, color: 'bg-emerald-500' },
    { label: 'Fechados / Ganhos', count: wonLeads, color: 'bg-green-600' }
  ];

  // Monthly revenue mock bars for dynamic chart
  const monthlyData = [
    { month: 'Jan', vgv: 4.2, leads: 38 },
    { month: 'Fev', vgv: 6.8, leads: 52 },
    { month: 'Mar', vgv: 7.5, leads: 68 },
    { month: 'Abr', vgv: 8.6, leads: 82 },
    { month: 'Mai', vgv: 9.4, leads: 94 },
    { month: 'Jun (Proj)', vgv: 11.2, leads: 110 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Timeframe Selector & Executive Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 font-display">
            Painel Executivo de Vendas & Performance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Métricas de VGV, taxa de conversão do funil e distribuição de honorários imobiliários.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'semana', label: '7 Dias' },
            { id: 'mes', label: 'Este Mês' },
            { id: 'ano', label: 'Ano 2026' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setPeriod(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === t.id
                  ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TOP EXECUTIVE KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* VGV Total Negociado */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">VGV Concretizado</span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900">{formatShort(closedVGV || 8600000)}</div>
            <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +28% vs período anterior
            </p>
          </div>
        </motion.div>

        {/* Leads Captados */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Leads no Pipeline</span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900">{totalLeads} contatos</div>
            <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 mt-1">
              SLA médio de resposta: 8 min
            </p>
          </div>
        </motion.div>

        {/* Imóveis em Carteira */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Carteira de Imóveis</span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900">{properties.length} unidades</div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {activePropertiesCount} disponíveis • {reservedCount} reservados
            </p>
          </div>
        </motion.div>

        {/* Comissões Geradas */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-500">Comissões a Repassar</span>
            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-extrabold font-display text-slate-900">{formatShort(totalCommissions || 516000)}</div>
            <p className="text-[11px] text-purple-600 font-bold mt-1">
              Divisão 6% (3.6% Imob. / 2.4% Corretor)
            </p>
          </div>
        </motion.div>

      </div>

      {/* Dynamic Animated Revenue & Deals Evolution Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Evolução de VGV & Captação de Leads</h3>
            <p className="text-xs text-slate-500">Comportamento de vendas mensais nos últimos 6 meses</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            +34% Crescimento Anual
          </span>
        </div>

        <div className="h-48 w-full flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
          {monthlyData.map((d, i) => {
            const heightPercent = (d.vgv / 12) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  R$ {d.vgv}M
                </span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="w-full max-w-[48px] bg-gradient-to-t from-slate-900 via-slate-800 to-amber-500 rounded-xl relative group-hover:from-amber-500 group-hover:to-amber-400 transition-colors shadow-sm"
                />
                <span className="text-[11px] font-semibold text-slate-500">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SALES FUNNEL & BROKER LEADERBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Funnel Progress */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Funil Comercial de Conversão</h3>
              <p className="text-xs text-slate-500">Fluxo de leads no pipeline de vendas da imobiliária</p>
            </div>
            <button
              onClick={() => setActiveModule('leads')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Kanban</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{stage.label}</span>
                  <span className="text-slate-900">{stage.count} leads</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(12, (stage.count / Math.max(1, totalLeads)) * 100)}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                    className={`h-full ${stage.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Taxa de Conversão Global (Lead → Venda):</span>
            <span className="font-extrabold text-slate-900 text-sm">{conversionRate}%</span>
          </div>
        </div>

        {/* Broker Leaderboard */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Desempenho da Equipe</h3>
              <p className="text-xs text-slate-500">Ranking por VGV e metas do mês</p>
            </div>
            <Award className="w-5 h-5 text-amber-500" />
          </div>

          <div className="space-y-3 pt-2">
            {team.filter(m => m.role === 'corretor').map((broker, idx) => {
              const percent = broker.salesGoal ? Math.min(100, Math.round(((broker.salesMonthVGV || 0) / broker.salesGoal) * 100)) : 80;
              return (
                <div key={broker.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <img src={broker.avatar} alt={broker.name} className="w-9 h-9 rounded-2xl object-cover border border-slate-200" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{broker.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">{broker.creci}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-900">{formatShort(broker.salesMonthVGV || 0)}</span>
                      <span className="text-[10px] text-slate-400 block font-medium">VGV no mês</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>Meta: {formatShort(broker.salesGoal || 10000000)}</span>
                      <span className="font-bold text-slate-800">{percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-amber-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
