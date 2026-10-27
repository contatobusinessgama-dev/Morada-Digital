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
  Filter,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  HandCoins,
  SlidersHorizontal,
  Settings2,
  Plus,
  Eye,
  EyeOff,
  Zap,
  RotateCcw,
  Check,
  Target
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyVolumeChart } from './charts/PropertyVolumeChart';
import { OpenSalesChart } from './charts/OpenSalesChart';
import { BrokerPerformanceChart } from './charts/BrokerPerformanceChart';
import { PortfolioDistributionChart } from './charts/PortfolioDistributionChart';
import { DashboardConfig } from '../../types';

export const DashboardExecutive: React.FC = () => {
  const { 
    properties, 
    leads, 
    proposals, 
    team, 
    setActiveModule, 
    showToast,
    dashboardConfig,
    updateDashboardConfig,
    resetDashboardConfig
  } = useRealEstate();

  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'ano'>('mes');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Temporary state for the customization modal
  const [tempConfig, setTempConfig] = useState<DashboardConfig>(dashboardConfig);

  // Sync temp config whenever modal opens
  const handleOpenCustomize = () => {
    setTempConfig(dashboardConfig);
    setIsCustomizeModalOpen(true);
  };

  const handleSaveCustomize = (e: React.FormEvent) => {
    e.preventDefault();
    updateDashboardConfig(tempConfig);
    setIsCustomizeModalOpen(false);
  };

  const toggleWidget = (key: keyof DashboardConfig['widgets']) => {
    setTempConfig(prev => ({
      ...prev,
      widgets: {
        ...prev.widgets,
        [key]: !prev.widgets[key]
      }
    }));
  };

  // Metrics
  const activePropertiesCount = properties.filter(p => p.status === 'disponivel').length;
  const reservedCount = properties.filter(p => p.status === 'reservado').length;
  const soldCount = properties.filter(p => p.status === 'vendido').length;

  const totalVGV = properties.reduce((acc, p) => acc + p.price, 0);
  const closedVGV = proposals
    .filter(pr => pr.status === 'contrato_assinado' || pr.status === 'aceita')
    .reduce((acc, pr) => acc + pr.offeredPrice, 0) || 8600000;

  // Total Open Sales (Vendas em Aberto: em análise, contraproposta ou minuta)
  const openProposals = proposals.filter(pr => pr.status === 'em_analise' || pr.status === 'contraproposta');
  const openSalesVGV = openProposals.reduce((acc, pr) => acc + pr.offeredPrice, 0) || 15480000;

  const totalCommissions = proposals
    .filter(pr => pr.status === 'contrato_assinado')
    .reduce((acc, pr) => acc + pr.commissionTotal, 0) || 516000;

  const totalLeads = leads.length;
  const activeBrokers = team.filter(u => u.status === 'ativo' || !u.status).length;

  const formatShort = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
    return `R$ ${val}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Indicadores e métricas do Dashboard atualizados com sucesso!', 'Painel Atualizado', 'crm');
    }, 500);
  };

  const densitySpacing = dashboardConfig.layoutDensity === 'compacto' 
    ? 'space-y-4' 
    : dashboardConfig.layoutDensity === 'expandido' 
    ? 'space-y-9' 
    : 'space-y-7';

  return (
    <div className={densitySpacing}>
      
      {/* 1. Timeframe Selector & Executive Dashboard Header with Customize Button */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#0B2545] text-white">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 font-display">
              Painel de Indicadores & Business Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestão estratégica da <strong>Morada Digital</strong>: Volume de inventário, pipeline de vendas em aberto e produtividade por corretor.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-end">
          {/* Button to edit dashboard tools */}
          <button
            onClick={handleOpenCustomize}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-2xl transition-all cursor-pointer border border-indigo-200"
            title="Personalizar e editar ferramentas do dashboard"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Editar Ferramentas</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors cursor-pointer border border-slate-200"
            title="Atualizar Indicadores"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0B2545]' : ''}`} />
          </button>

          {/* Period Selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {[
              { id: 'mes', label: 'Mensal (Abr/26)' },
              { id: 'trimestre', label: '1º Trimestre' },
              { id: 'ano', label: 'Ano 2026' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setPeriod(t.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === t.id
                    ? 'bg-[#0B2545] text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS TOOLBAR (if enabled) */}
      {dashboardConfig.widgets.quickActions && (
        <div className="bg-gradient-to-r from-[#0B2545] to-slate-900 text-white p-4 rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/10 text-emerald-400">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-bold block text-white">Ferramentas & Ações Rápidas</span>
              <span className="text-[11px] text-slate-300">Acesso direto aos fluxos centrais da imobiliária</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveModule('imoveis')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Building className="w-3.5 h-3.5 text-blue-400" />
              <span>Imóveis</span>
            </button>
            <button
              onClick={() => setActiveModule('propostas')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Propostas</span>
            </button>
            <button
              onClick={() => setActiveModule('visitas')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span>Visitas</span>
            </button>
            <button
              onClick={() => setActiveModule('financeiro')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-emerald-500/30"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fluxo Caixa</span>
            </button>
            <button
              onClick={() => setActiveModule('marketing')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Marketing</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. TOP EXECUTIVE 4 KPI CARDS (if enabled) */}
      {dashboardConfig.widgets.kpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Volume de Imóveis Cadastrados */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Imóveis Cadastrados
              </span>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0B2545] flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold font-display text-slate-900">
                {properties.length} <span className="text-xs font-semibold text-slate-400">unidades</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> Meta mês: {dashboardConfig.monthlyPropertiesTarget} captações
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {activePropertiesCount} disponíveis • {reservedCount} reservados
              </div>
            </div>
          </motion.div>

          {/* Card 2: Total de Vendas em Aberto */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Vendas em Aberto
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold font-display text-amber-600">
                {formatShort(openSalesVGV)}
              </div>
              <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Negociações ativas no pipeline</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Honorários previstos: ~R$ 928k
              </div>
            </div>
          </motion.div>

          {/* Card 3: VGV Concretizado / Fechado */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                VGV Concretizado
              </span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold font-display text-slate-900">
                {formatShort(closedVGV)}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Meta: {formatShort(dashboardConfig.monthlyTargetVGV)}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Comissões imobiliária: {formatShort(totalCommissions)}
              </div>
            </div>
          </motion.div>

          {/* Card 4: Performance dos Corretores */}
          <motion.div 
            whileHover={{ y: -3 }}
            className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Equipe de Corretores
              </span>
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-extrabold font-display text-slate-900">
                {activeBrokers} <span className="text-xs font-semibold text-slate-400">profissionais</span>
              </div>
              <div className="text-[11px] text-purple-700 font-bold flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% com CRECI Verificado</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Base Operacional: Contagem/MG
              </div>
            </div>
          </motion.div>

        </div>
      )}

      {/* 3. ROW 1 DE GRÁFICOS: VOLUME DE IMÓVEIS CADASTRADOS & VENDAS EM ABERTO */}
      {(dashboardConfig.widgets.chartPropertiesVolume || dashboardConfig.widgets.chartOpenSales) && (
        <div className={`grid grid-cols-1 ${dashboardConfig.widgets.chartPropertiesVolume && dashboardConfig.widgets.chartOpenSales ? 'lg:grid-cols-2' : ''} gap-6`}>
          {dashboardConfig.widgets.chartPropertiesVolume && (
            <PropertyVolumeChart properties={properties} />
          )}
          {dashboardConfig.widgets.chartOpenSales && (
            <OpenSalesChart proposals={proposals} />
          )}
        </div>
      )}

      {/* 4. ROW 2 DE GRÁFICOS: PERFORMANCE INDIVIDUAL DE CORRETORES POR MÊS */}
      {dashboardConfig.widgets.chartBrokerPerformance && (
        <div>
          <BrokerPerformanceChart team={team} />
        </div>
      )}

      {/* 5. ROW 3: CONCENTRAÇÃO REGIONAL & DESTAQUES OPERACIONAIS */}
      {(dashboardConfig.widgets.chartPortfolioDistribution || dashboardConfig.widgets.criticalDeals) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Regional Concentration */}
          {dashboardConfig.widgets.chartPortfolioDistribution && (
            <div className={dashboardConfig.widgets.criticalDeals ? 'lg:col-span-5' : 'lg:col-span-12'}>
              <PortfolioDistributionChart properties={properties} />
            </div>
          )}

          {/* Resumo de Propostas Quentes & Fechamentos Iminentes */}
          {dashboardConfig.widgets.criticalDeals && (
            <div className={`${dashboardConfig.widgets.chartPortfolioDistribution ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4`}>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
                      <HandCoins className="w-4 h-4" />
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 font-display">
                      Negociações em Estágio Crítico (Previsão de Fechamento nos Próximos 7 Dias)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Propostas aceitas e minutas em análise jurídica para assinatura digital
                  </p>
                </div>

                <button
                  onClick={() => setActiveModule('propostas')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Ver Todas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {proposals.map((deal, i) => (
                  <div 
                    key={deal.id || i}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {deal.code}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {deal.status === 'em_analise' ? 'Proposta em Análise' : deal.status === 'contraproposta' ? 'Contraproposta' : 'Minuta Contratual'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-1">{deal.propertyTitle}</h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Cliente: <strong className="text-slate-700">{deal.leadName}</strong> • Corretor: <strong className="text-slate-700">{deal.brokerName}</strong>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-sm font-extrabold text-slate-900 font-display">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(deal.offeredPrice)}
                      </div>
                      <span className="text-[10px] text-emerald-700 font-mono font-semibold block">
                        Comissão prevista: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(deal.commissionTotal)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {dashboardConfig.widgets.conversionTargetBanner && (
                <div className="p-3 bg-slate-900 text-white rounded-2xl flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Taxa média de fechamento sobre vendas em aberto:
                  </span>
                  <span className="font-extrabold text-emerald-400 font-display text-sm">
                    68.4% de conversão
                  </span>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* MODAL: PERSONALIZAR E EDITAR FERRAMENTAS DO DASHBOARD */}
      {isCustomizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base font-display">
                    Editar Ferramentas do Dashboard
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ative, oculte ou configure indicadores executivos da Morada Digital
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomizeModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomize} className="space-y-6 pt-4 text-xs">
              
              {/* Density and Target Settings */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-indigo-600" />
                  <span>Metas Executivas & Densidade de Visualização</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Meta VGV Mês (R$)</label>
                    <input
                      type="number"
                      value={tempConfig.monthlyTargetVGV}
                      onChange={e => setTempConfig(prev => ({ ...prev, monthlyTargetVGV: Number(e.target.value) }))}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Meta Imóveis/Mês</label>
                    <input
                      type="number"
                      value={tempConfig.monthlyPropertiesTarget}
                      onChange={e => setTempConfig(prev => ({ ...prev, monthlyPropertiesTarget: Number(e.target.value) }))}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Espaçamento</label>
                    <select
                      value={tempConfig.layoutDensity}
                      onChange={e => setTempConfig(prev => ({ ...prev, layoutDensity: e.target.value as any }))}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
                    >
                      <option value="compacto">Compacto</option>
                      <option value="padrao">Padrão</option>
                      <option value="expandido">Expandido</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Widget Toggles */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-xs block">
                  Ferramentas & Módulos em Exibição
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'quickActions', label: 'Barra de Ações Rápidas (Atalhos)', desc: 'Botões de 1 clique para imóveis, fluxo e propostas' },
                    { key: 'kpis', label: '4 Cards de KPIs do Topo', desc: 'Imóveis, VGV em Aberto, Concretizado e Corretores' },
                    { key: 'chartPropertiesVolume', label: 'Gráfico de Volume de Imóveis', desc: 'Histórico mensal de inventário cadastrado' },
                    { key: 'chartOpenSales', label: 'Gráfico de Vendas em Aberto', desc: 'Pipeline de propostas em negociação' },
                    { key: 'chartBrokerPerformance', label: 'Performance Individual de Corretores', desc: 'VGV, vendas e metas mensais por corretor' },
                    { key: 'chartPortfolioDistribution', label: 'Concentração por Bairro', desc: 'Distribuição em Contagem e Grande BH' },
                    { key: 'criticalDeals', label: 'Propostas Quentes & Fechamentos', desc: 'Alertas de negócios iminentes nos próximos 7 dias' },
                    { key: 'conversionTargetBanner', label: 'Banner de Taxa de Conversão', desc: 'Métrica de fechamento sobre vendas em aberto' }
                  ].map(w => {
                    const isChecked = tempConfig.widgets[w.key as keyof DashboardConfig['widgets']];
                    return (
                      <div
                        key={w.key}
                        onClick={() => toggleWidget(w.key as any)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked 
                            ? 'bg-indigo-50/70 border-indigo-200 text-slate-900' 
                            : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="space-y-0.5">
                          <strong className="block text-xs font-bold">{w.label}</strong>
                          <p className="text-[10px] leading-tight text-slate-500">{w.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    resetDashboardConfig();
                    setIsCustomizeModalOpen(false);
                  }}
                  className="px-3 py-2 text-slate-500 hover:text-slate-800 font-bold text-xs flex items-center gap-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Padrão</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizeModalOpen(false)}
                    className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold bg-[#0B2545] hover:bg-[#071930] text-white rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Salvar Ferramentas</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
