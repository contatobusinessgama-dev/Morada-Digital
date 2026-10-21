import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Home, 
  SlidersHorizontal, 
  DollarSign, 
  BedDouble, 
  Car, 
  Maximize2, 
  Check, 
  X,
  Sparkles,
  Bath,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { PropertyGoal } from '../../types';

interface HeroSearchBarProps {
  onSearchSubmit?: () => void;
  compact?: boolean;
}

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({ onSearchSubmit, compact = false }) => {
  const { searchFilters, setSearchFilters, showToast } = useRealEstate();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const goalOptions: { value: PropertyGoal; label: string; badge?: string }[] = [
    { value: 'venda', label: 'Comprar' },
    { value: 'locacao', label: 'Alugar' },
    { value: 'lancamento', label: 'Lançamentos', badge: 'Novo' }
  ];

  const propertyTypes = [
    { value: 'todos', label: 'Todos os Tipos' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa de Bairro' },
    { value: 'casa_condominio', label: 'Casa em Condomínio' },
    { value: 'cobertura', label: 'Cobertura Duplex/Triplex' },
    { value: 'studio', label: 'Studio / Compacto' },
    { value: 'comercial', label: 'Comercial' }
  ];

  const bedroomOptions = [
    { value: 'qualquer', label: 'Todos' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' }
  ];

  const featureAmenities = [
    'Piscina',
    'Varanda Gourmet',
    'Churrasqueira',
    'Portaria 24h',
    'Academia',
    'Pet Friendly',
    'Mobiliado',
    'Ar Condicionado',
    'Automação',
    'Sauna'
  ];

  const quickHotspots = [
    { name: 'Jardins', label: 'Jardins' },
    { name: 'Itaim Bibi', label: 'Itaim Bibi' },
    { name: 'Pinheiros', label: 'Pinheiros' },
    { name: 'Moema', label: 'Moema' },
    { name: 'Alphaville', label: 'Alphaville' }
  ];

  const handleGoalChange = (newGoal: PropertyGoal) => {
    setSearchFilters(prev => ({
      ...prev,
      goal: newGoal,
      maxPrice: newGoal === 'locacao' ? 30000 : 15000000
    }));
  };

  const toggleFeature = (feat: string) => {
    setSearchFilters(prev => {
      const exists = prev.features.includes(feat);
      return {
        ...prev,
        features: exists 
          ? prev.features.filter(f => f !== feat)
          : [...prev.features, feat]
      };
    });
  };

  const handleExecuteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Filtros aplicados. Navegando para o catálogo...', 'Busca Atualizada', 'info');
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const activeFiltersCount = 
    (searchFilters.type !== 'todos' ? 1 : 0) +
    (searchFilters.bedrooms !== 'qualquer' ? 1 : 0) +
    (searchFilters.suites !== 'qualquer' ? 1 : 0) +
    (searchFilters.parking !== 'qualquer' ? 1 : 0) +
    (searchFilters.minArea > 0 ? 1 : 0) +
    searchFilters.features.length;

  return (
    <div className={`w-full ${compact ? '' : 'max-w-5xl mx-auto shadow-xl rounded-3xl bg-white border border-slate-200/90 p-4 md:p-6 text-slate-800'}`}>
      
      {/* 1. Goal Selector Tabs with Animated Active Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
          {goalOptions.map(opt => {
            const isActive = searchFilters.goal === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleGoalChange(opt.value)}
                className={`relative px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 z-10 ${
                  isActive ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="searchActiveTab"
                    className="absolute inset-0 bg-teal-600 rounded-xl shadow-xs -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {opt.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                    isActive ? 'bg-teal-800 text-teal-100' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {opt.badge}
                  </span>
                )}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Hotspot Chips */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mr-1">
            <Flame className="w-3.5 h-3.5 text-teal-600" /> Bairros em alta:
          </span>
          {quickHotspots.map(h => (
            <button
              key={h.name}
              type="button"
              onClick={() => setSearchFilters(prev => ({ ...prev, location: h.name }))}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                searchFilters.location.toLowerCase() === h.name.toLowerCase()
                  ? 'bg-teal-50 text-teal-700 border border-teal-300 font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Search Controls Grid */}
      <form onSubmit={handleExecuteSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Localização / Bairro */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-600" /> Onde você deseja morar?
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchFilters.location}
              onChange={e => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Contagem, Savassi, Jardins, Pinheiros..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-xs"
            />
            {searchFilters.location && (
              <button
                type="button"
                onClick={() => setSearchFilters(prev => ({ ...prev, location: '' }))}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Tipo de Imóvel */}
        <div className="md:col-span-3">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-teal-600" /> Tipo de Propriedade
          </label>
          <select
            value={searchFilters.type}
            onChange={e => setSearchFilters(prev => ({ ...prev, type: e.target.value }))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all cursor-pointer shadow-xs"
          >
            {propertyTypes.map(t => (
              <option key={t.value} value={t.value} className="bg-white text-slate-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dormitórios */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-teal-600" /> Dormitórios
          </label>
          <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-0.5">
            {bedroomOptions.map(b => (
              <button
                key={b.value}
                type="button"
                onClick={() => setSearchFilters(prev => ({ ...prev, bedrooms: b.value }))}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  searchFilters.bedrooms === b.value 
                    ? 'bg-teal-600 text-white font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Filtros Extras Toggle */}
        <div className="md:col-span-1 flex items-end">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`w-full h-[42px] mt-5 md:mt-0 flex items-center justify-center rounded-xl border transition-all text-xs font-semibold gap-1.5 cursor-pointer ${
              showAdvanced || activeFiltersCount > 0
                ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
            }`}
            title="Mais Filtros Refinados"
          >
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            <span className="hidden xl:inline">Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Botão Buscar */}
        <div className="md:col-span-2 flex items-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full h-[42px] mt-5 md:mt-0 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Buscar Imóveis</span>
          </motion.button>
        </div>
      </form>

      {/* 3. Advanced Filters Animated Drawer */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-5 pt-5 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Faixa de Preço */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                    <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-teal-600" /> Preço Máximo</span>
                    <span className="text-teal-700 font-bold">{formatCurrency(searchFilters.maxPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={searchFilters.goal === 'locacao' ? 1500 : 300000}
                    max={searchFilters.goal === 'locacao' ? 40000 : 15000000}
                    step={searchFilters.goal === 'locacao' ? 500 : 100000}
                    value={searchFilters.maxPrice}
                    onChange={e => setSearchFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    className="w-full accent-teal-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>{searchFilters.goal === 'locacao' ? 'R$ 1.500/mês' : 'R$ 300 mil'}</span>
                    <span>{searchFilters.goal === 'locacao' ? 'R$ 40 mil/mês' : 'R$ 15M+'}</span>
                  </div>
                </div>

                {/* Suítes & Vagas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5 text-teal-600" /> Suítes Mín.
                    </label>
                    <select
                      value={searchFilters.suites}
                      onChange={e => setSearchFilters(prev => ({ ...prev, suites: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="qualquer">Qualquer</option>
                      <option value="1">1+ Suíte</option>
                      <option value="2">2+ Suítes</option>
                      <option value="3">3+ Suítes</option>
                      <option value="4">4+ Suítes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-teal-600" /> Vagas Mín.
                    </label>
                    <select
                      value={searchFilters.parking}
                      onChange={e => setSearchFilters(prev => ({ ...prev, parking: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="qualquer">Qualquer</option>
                      <option value="1">1+ Vaga</option>
                      <option value="2">2+ Vagas</option>
                      <option value="3">3+ Vagas</option>
                      <option value="4">4+ Vagas</option>
                    </select>
                  </div>
                </div>

                {/* Metragem Mínima */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-teal-600" /> Área Útil Mínima
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Ex: 80"
                      value={searchFilters.minArea || ''}
                      onChange={e => setSearchFilters(prev => ({ ...prev, minArea: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap">m² privativos</span>
                  </div>
                </div>
              </div>

              {/* Comodidades e Diferenciais */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <span className="block text-xs font-semibold text-slate-700 mb-2">Comodidades & Lazer Desejados</span>
                <div className="flex flex-wrap gap-2">
                  {featureAmenities.map(feat => {
                    const isSelected = searchFilters.features.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => toggleFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected 
                            ? 'bg-teal-600 text-white font-bold shadow-xs' 
                            : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-200/60'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                        {feat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reset Filters */}
              <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
                <span>{activeFiltersCount} filtros adicionais ativos</span>
                <button
                  type="button"
                  onClick={() => setSearchFilters(prev => ({
                    ...prev,
                    type: 'todos',
                    location: '',
                    bedrooms: 'qualquer',
                    suites: 'qualquer',
                    parking: 'qualquer',
                    minArea: 0,
                    features: []
                  }))}
                  className="text-teal-700 hover:text-teal-800 font-bold hover:underline cursor-pointer"
                >
                  Limpar todos os filtros adicionais
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
