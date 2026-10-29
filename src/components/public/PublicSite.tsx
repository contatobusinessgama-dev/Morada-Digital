import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Car, 
  Maximize2, 
  Heart, 
  Phone, 
  PhoneCall,
  Smartphone,
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Calculator, 
  CheckCircle2, 
  Building2, 
  Lock, 
  SlidersHorizontal,
  Home,
  Star,
  ChevronRight,
  Filter,
  Menu,
  X,
  TrendingUp,
  Scale,
  Coins,
  FileText,
  ExternalLink,
  ChevronDown,
  Clock,
  Check,
  Copy
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Property, PropertyGoal } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { MoradaLogo } from '../common/MoradaLogo';
import { PropertyListingWizard } from './PropertyListingWizard';
import { ProptechToolsHub, ProptechTab } from '../common/ProptechToolsHub';
import { GeminiChatbot } from '../common/GeminiChatbot';

export const PublicSite: React.FC = () => {
  const { 
    properties, 
    requestSystemAccess, 
    isSystemAuthenticated, 
    setCurrentView,
    addLead,
    showToast 
  } = useRealEstate();

  // Mobile Menu & Modals State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPhonesModalOpen, setIsPhonesModalOpen] = useState(false);

  // Modal para Proprietário Vender/Anunciar Imóvel
  const [isListingWizardOpen, setIsListingWizardOpen] = useState(false);

  // Modal para Ferramentas Proptech (Garantia Morada, Calculadoras e Links Úteis)
  const [isProptechModalOpen, setIsProptechModalOpen] = useState(false);
  const [proptechInitialTab, setProptechInitialTab] = useState<ProptechTab>('garantia');

  const openProptech = (tab: ProptechTab = 'garantia') => {
    setProptechInitialTab(tab);
    setIsProptechModalOpen(true);
  };

  // Interactive Header State
  const [isCalculatorsOpen, setIsCalculatorsOpen] = useState(false);
  const [isGarantiaPopoverOpen, setIsGarantiaPopoverOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('morada_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);

  // Lock body scroll on modal/drawer open
  useEffect(() => {
    if (isMobileMenuOpen || isPhonesModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isPhonesModalOpen]);

  // Handle escape key to dismiss open menus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsPhonesModalOpen(false);
        setIsCalculatorsOpen(false);
        setIsGarantiaPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (propertyId: string, propertyTitle: string) => {
    setFavorites(prev => {
      const exists = prev.includes(propertyId);
      const next = exists ? prev.filter(id => id !== propertyId) : [...prev, propertyId];
      try {
        localStorage.setItem('morada_favorites', JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      if (exists) {
        showToast('Imóvel removido dos seus favoritos', 'Favoritos', 'info');
      } else {
        showToast(`"${propertyTitle}" salvo nos seus favoritos!`, 'Imóvel Favoritado', 'favorite');
      }
      return next;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(label);
    showToast(`${label} copiado para a área de transferência!`, 'Copiado', 'success');
    setTimeout(() => setCopiedContact(null), 2500);
  };

  // Search & Filters inspired by ZAP Imóveis
  const [goal, setGoal] = useState<PropertyGoal>('venda');
  const [propertyType, setPropertyType] = useState<string>('todos');
  const [locationQuery, setLocationQuery] = useState('');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [minParking, setMinParking] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000000);
  const [selectedPropertyModal, setSelectedPropertyModal] = useState<Property | null>(null);

  // Quick Lead Capture in Property Modal
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadMessage, setLeadMessage] = useState('');

  // Financing Simulator
  const [simValue, setSimValue] = useState<number>(1800000);
  const [simDownPayment, setSimDownPayment] = useState<number>(360000);
  const [simYears, setSimYears] = useState<number>(30);
  const [simRate, setSimRate] = useState<number>(9.8); // 9.8% a.a.

  // Filtered Properties
  const filteredProperties = properties.filter(p => {
    const matchesGoal = onlyFavorites ? true : (p.goal === goal || (goal === 'venda' && p.goal === 'lancamento'));
    const matchesType = propertyType === 'todos' || p.type === propertyType;
    const matchesLocation = !locationQuery || 
      p.neighborhood.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesBedrooms = minBedrooms === 0 || p.bedrooms >= minBedrooms;
    const matchesParking = minParking === 0 || p.parkingSpots >= minParking;
    const matchesPrice = p.price <= maxPrice;
    const matchesFavorites = !onlyFavorites || favorites.includes(p.id);

    return matchesGoal && matchesType && matchesLocation && matchesBedrooms && matchesParking && matchesPrice && matchesFavorites;
  });

  // Calculate monthly installment (SAC initial)
  const financedAmount = Math.max(0, simValue - simDownPayment);
  const monthlyRate = (simRate / 100) / 12;
  const totalMonths = simYears * 12;
  const amortization = financedAmount / (totalMonths || 1);
  const initialInterest = financedAmount * monthlyRate;
  const firstInstallment = Math.round(amortization + initialInterest);

  const handleLeadSubmit = (e: React.FormEvent, prop: Property) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    addLead({
      name: leadName,
      phone: leadPhone,
      interestType: prop.goal,
      budgetMax: prop.price,
      propertyOfInterestId: prop.id,
      propertyOfInterestTitle: prop.title,
      propertyOfInterestCode: prop.code,
      notes: `Lead solicitou contato pelo portal público: "${leadMessage || 'Gostaria de agendar visita e receber a tabela de valores.'}"`,
      origin: 'whatsapp_direto'
    });

    showToast(`Obrigado, ${leadName}! Um especialista da Morada Digital entrará em contato via WhatsApp.`, 'Contato Enviado', 'success');
    setSelectedPropertyModal(null);
    setLeadName('');
    setLeadPhone('');
    setLeadMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16 lg:pb-0">
      
      {/* 1. TOP INSTITUTIONAL BAR & MAIN NAVBAR */}
      <header className="sticky top-0 z-40 shadow-sm">
        
        {/* Upper Institutional Info Strip - Optimized for Mobile & Desktop */}
        <div className="bg-[#07172C] text-white border-b border-slate-800/80 px-3 sm:px-6 lg:px-8 py-1.5 text-[11px] font-sans">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            {/* Left: Mobile condensed badge / Desktop full CRECI & Sede */}
            <div className="flex items-center gap-2 text-slate-300 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold text-[10px] sm:text-[11px] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="sm:hidden">Plantão Contagem & BH</span>
                <span className="hidden sm:inline">Plantão Digital Ativo</span>
              </span>

              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1.5 text-slate-300 font-medium truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <strong className="text-white">Sede:</strong> {MORADA_BRAND.address}
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline text-slate-300 font-medium">
                {MORADA_BRAND.creci}
              </span>
              <span className="hidden lg:inline text-slate-600">•</span>
              <span className="hidden lg:inline text-amber-300/95 font-semibold">
                Daniel Gama (CRECI 68.165-F)
              </span>
            </div>

            {/* Right: Telefones & Celulares com Cópia Interativa e Modal de Configuração */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
              {copiedContact && (
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 animate-in fade-in">
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">{copiedContact} copiado!</span>
                  <span className="sm:hidden">Copiado!</span>
                </span>
              )}

              {/* Botão Central de Telefones & Celulares */}
              <button
                type="button"
                onClick={() => setIsPhonesModalOpen(true)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 hover:text-white border border-indigo-400/30 text-[10px] sm:text-[10.5px] font-bold transition-all cursor-pointer"
                title="Ver todos os celulares e telefones configurados da Morada Digital"
              >
                <Smartphone className="w-3 h-3 text-indigo-300" />
                <span className="hidden sm:inline">Central Telefônica</span>
                <span className="sm:hidden">Celulares</span>
                <span className="bg-indigo-400/30 text-indigo-100 text-[9px] px-1 rounded-sm">
                  {MORADA_BRAND.contactPhones.length}
                </span>
              </button>

              {/* Fixo com Cópia (Desktop/Tablet) */}
              <div className="hidden md:flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10 transition-colors">
                <a
                  href="tel:3133573030"
                  className="flex items-center gap-1.5 text-slate-200 hover:text-white font-bold transition-colors"
                  title="Ligue para nossa sede em Contagem"
                >
                  <Phone className="w-3 h-3 text-indigo-400" />
                  <span>Fixo: (31) 3357-3030</span>
                </a>
                <button
                  onClick={() => copyToClipboard('(31) 3357-3030', 'Telefone Fixo')}
                  className="text-slate-400 hover:text-white p-0.5 rounded hover:bg-white/10 cursor-pointer"
                  title="Copiar telefone fixo"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              {/* WhatsApp / Celular Principal */}
              <div className="flex items-center gap-1 bg-emerald-950/40 hover:bg-emerald-950/70 px-1.5 sm:px-2 py-0.5 rounded-md border border-emerald-500/20 transition-colors">
                <a
                  href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20atendimento%20Morada%20Digital`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 sm:gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">WhatsApp: (31) 98427-9865</span>
                  <span className="sm:hidden">(31) 98427-9865</span>
                </a>
                <button
                  onClick={() => copyToClipboard('(31) 98427-9865', 'WhatsApp')}
                  className="text-emerald-400/80 hover:text-emerald-300 p-0.5 rounded hover:bg-white/10 cursor-pointer hidden sm:inline-block"
                  title="Copiar número do WhatsApp"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>

              <span className="text-slate-700 hidden sm:inline">|</span>

              <button
                onClick={requestSystemAccess}
                className="flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition-colors cursor-pointer text-[10px] sm:text-[10.5px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded-md border border-white/10"
                title="Acesso Administrativo para Corretores e Diretoria"
              >
                <Lock className="w-3 h-3 text-slate-300" />
                <span className="hidden sm:inline">{isSystemAuthenticated ? 'Abrir CRM' : 'Área Restrita'}</span>
                <span className="sm:hidden">CRM</span>
              </button>
            </div>

          </div>
        </div>

        {/* Main Navbar */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 lg:gap-4">
            
            {/* Brand Logo with Subtitle */}
            <div className="flex items-center gap-3 shrink-0">
              <MoradaLogo variant="dark" size="md" />
              <div className="hidden 2xl:flex flex-col border-l border-slate-200 pl-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#07172C]">
                  Plataforma Digital
                </span>
                <span className="text-[9px] font-semibold text-slate-500">
                  Bairro Arvoredo • Contagem & BH
                </span>
              </div>
            </div>

            {/* Interactive Header Quick Search (Real-time filter on properties) */}
            <div className="hidden md:flex items-center relative max-w-xs xl:max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Buscar bairro, rua ou código..."
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-hidden font-medium text-slate-800 placeholder:text-slate-400"
              />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => setLocationQuery('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Intuitive Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-semibold text-slate-700">
              
              <a 
                href="#imoveis" 
                onClick={() => setOnlyFavorites(false)}
                className="px-2.5 xl:px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5 font-bold"
              >
                <span>Todos Imóveis</span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-full border border-slate-200">
                  {properties.length}
                </span>
              </a>

              {/* Segmented Comprar / Alugar Quick Filter */}
              <button 
                onClick={() => { setGoal('venda'); setOnlyFavorites(false); const el = document.getElementById('imoveis'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  goal === 'venda' && !onlyFavorites
                    ? 'text-indigo-700 bg-indigo-50/80 shadow-2xs' 
                    : 'hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                Comprar
              </button>

              <button 
                onClick={() => { setGoal('locacao'); setOnlyFavorites(false); const el = document.getElementById('imoveis'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`px-2.5 xl:px-3 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                  goal === 'locacao' && !onlyFavorites
                    ? 'text-indigo-700 bg-indigo-50/80 shadow-2xs' 
                    : 'hover:bg-slate-100 hover:text-indigo-600'
                }`}
              >
                Alugar
              </button>

              {/* Interactive Aluguel Sem Fiador with Hover/Click Popover */}
              <div 
                className="relative"
                onMouseEnter={() => setIsGarantiaPopoverOpen(true)}
                onMouseLeave={() => setIsGarantiaPopoverOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => openProptech('garantia')}
                  className="py-1.5 px-2.5 xl:px-3 rounded-xl text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200 flex items-center gap-1.5 font-bold transition-all cursor-pointer shadow-2xs"
                  title="Locação ágil sem fiador e com repasse garantido ao proprietário todo dia 12"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sem Fiador</span>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.2 rounded-full hidden sm:inline-block">
                    Zero Caução
                  </span>
                  <ChevronDown className={`w-3 h-3 text-emerald-600 transition-transform ${isGarantiaPopoverOpen ? 'rotate-180' : ''}`} />
                </button>

                {isGarantiaPopoverOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center gap-2 pb-2 mb-3 border-b border-emerald-50">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-xs">Garantia Morada Total</div>
                        <div className="text-[10px] text-slate-500">Agilidade para inquilino e segurança ao dono</div>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] text-slate-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Zero Fiador e Sem Depósito Caução</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Repasse Garantido Todo Dia 12</strong> ao proprietário</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Proteção até R$ 50.000</strong> contra danos e reparos</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setIsGarantiaPopoverOpen(false); openProptech('garantia'); }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-all cursor-pointer shadow-xs"
                    >
                      Saber Mais & Simular
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Calculadoras Mega Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCalculatorsOpen(true)}
                onMouseLeave={() => setIsCalculatorsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsCalculatorsOpen(prev => !prev)}
                  className="px-2.5 xl:px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer font-bold text-slate-700"
                  title="Simuladores e Ferramentas Financeiras"
                >
                  <Calculator className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Calculadoras</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isCalculatorsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCalculatorsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      Simuladores Financeiros
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => { setIsCalculatorsOpen(false); openProptech('comprar_ou_alugar'); }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs group-hover:text-indigo-600">Comprar ou Alugar?</div>
                        <div className="text-[10px] text-slate-500">Compare parcelas vs custo de locação e CDI</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsCalculatorsOpen(false); openProptech('financiamento'); }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs group-hover:text-teal-600">Financiamento: SAC vs PRICE</div>
                        <div className="text-[10px] text-slate-500">Simule parcelas decrescentes ou fixas</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsCalculatorsOpen(false); openProptech('reajuste'); }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs group-hover:text-amber-600">Reajuste de Aluguel</div>
                        <div className="text-[10px] text-slate-500">Cálculo acumulado IPCA e IGP-M oficial</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsCalculatorsOpen(false); openProptech('links_uteis'); }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-xs group-hover:text-emerald-600">Cartilha & Links Úteis</div>
                        <div className="text-[10px] text-slate-500">CEMIG, COPASA, IPTU Contagem e Cartórios</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <a 
                href="#sobre" 
                className="px-2.5 xl:px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-indigo-600 transition-colors"
              >
                Nossa Sede
              </a>
            </nav>

            {/* Actions: Favoritos + Anunciar Imóvel + WhatsApp CTA + Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Interactive Favoritos Heart Counter Button */}
              <button
                type="button"
                onClick={() => {
                  setOnlyFavorites(prev => !prev);
                  const el = document.getElementById('imoveis');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                title={onlyFavorites ? "Mostrar todos os imóveis" : "Ver apenas imóveis favoritados"}
                className={`relative px-2.5 py-2 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer font-bold text-xs ${
                  onlyFavorites 
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 transition-transform ${favorites.length > 0 ? 'text-rose-500 fill-rose-500 scale-105' : 'text-slate-400'}`} />
                <span className="hidden xl:inline text-[11px]">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsListingWizardOpen(true)}
                className="hidden sm:flex text-indigo-700 hover:text-indigo-800 bg-indigo-50/90 hover:bg-indigo-100 active:bg-indigo-200 px-3 py-2 rounded-xl border border-indigo-200 font-bold text-xs transition-all items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Anunciar</span>
              </button>

              {/* WhatsApp CTA Button */}
              <a
                href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20personalizado%20na%20Morada%20Digital`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse hidden md:inline-block" />
              </a>

              {/* Mobile Animated Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer focus:outline-hidden"
                aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMobileMenuOpen}
              >
                <span className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-200 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                <span className={`block w-5 h-0.5 bg-slate-800 rounded-full transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </button>

            </div>

          </div>
        </div>

        {/* 2. FLUID RESPONSIVE MOBILE OFF-CANVAS DRAWER & BACKDROP */}
        {/* Backdrop Overlay */}
        <div 
          className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity duration-300 lg:hidden ${
            isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Sliding Off-Canvas Sheet */}
        <aside
          className={`fixed top-0 right-0 w-[90%] max-w-md h-full bg-white z-50 shadow-2xl flex flex-col justify-between transform transition-transform duration-300 ease-out lg:hidden overflow-hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-label="Menu Principal de Navegação Móvel"
        >
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <MoradaLogo variant="dark" size="sm" />
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#07172C]">
                  Morada Digital
                </span>
                <span className="text-[9px] font-medium text-slate-500">
                  Sede Bairro Arvoredo • Contagem
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-xs">
            
            {/* Mobile Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Buscar bairro, rua ou código..."
                className="w-full bg-slate-100/90 text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium"
              />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => setLocationQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Configuração de Números de Celulares & Telefones em Destaque no Celular */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#07172C] text-white p-3.5 rounded-2xl shadow-sm border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                  Celulares & Plantão
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                  Online Agora
                </span>
              </div>

              {/* Cards de telefones configurados */}
              <div className="space-y-2">
                {MORADA_BRAND.contactPhones.map(cp => (
                  <div 
                    key={cp.id}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[11px] text-white flex items-center gap-1.5">
                        {cp.isWhatsapp ? (
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                        <span>{cp.label}</span>
                      </span>
                      <span className="text-[9px] font-semibold text-slate-400">
                        {cp.badge}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-300 flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-100">{cp.number}</span>
                      <span className="text-[9px] text-slate-400">{cp.status}</span>
                    </div>

                    {/* Quick Call, WhatsApp and Copy Buttons for Mobile */}
                    <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-white/5">
                      {cp.isWhatsapp ? (
                        <a
                          href={`https://wa.me/${cp.clean}?text=${encodeURIComponent(`Olá, gostaria de atendimento na Morada Digital (${cp.department})`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-1 px-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      ) : (
                        <a
                          href={`tel:${cp.clean}`}
                          className="py-1 px-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>Ligar</span>
                        </a>
                      )}

                      <a
                        href={`tel:${cp.clean}`}
                        className="py-1 px-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                        title="Ligar para este número"
                      >
                        <Phone className="w-3 h-3 text-slate-300" />
                        <span>Ligar</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => copyToClipboard(cp.number, cp.label)}
                        className="py-1 px-1.5 bg-white/10 hover:bg-white/20 text-slate-200 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                        title="Copiar número"
                      >
                        <Copy className="w-3 h-3 text-slate-300" />
                        <span>Copiar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categorias & Navegação Primária */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Imóveis & Navegação
              </span>

              {/* Meus Favoritos Toggle */}
              <button
                type="button"
                onClick={() => { setOnlyFavorites(prev => !prev); setIsMobileMenuOpen(false); const el = document.getElementById('imoveis'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-rose-700 bg-rose-50/70 hover:bg-rose-100/70 flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>Meus Imóveis Favoritos</span>
                </span>
                <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              </button>

              <a
                href="#imoveis"
                onClick={() => { setOnlyFavorites(false); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors block"
              >
                <span>Ver Todos os Imóveis</span>
                <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-2 py-0.5 rounded-full">
                  {properties.length}
                </span>
              </a>

              <button
                type="button"
                onClick={() => { setGoal('venda'); setOnlyFavorites(false); setIsMobileMenuOpen(false); const el = document.getElementById('imoveis'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  goal === 'venda' && !onlyFavorites ? 'bg-indigo-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Imóveis para Venda & Lançamentos
              </button>

              <button
                type="button"
                onClick={() => { setGoal('locacao'); setOnlyFavorites(false); setIsMobileMenuOpen(false); const el = document.getElementById('imoveis'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  goal === 'locacao' && !onlyFavorites ? 'bg-indigo-50 text-indigo-700' : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                Imóveis para Locação
              </button>

              {/* Aluguel Sem Fiador Destaque */}
              <button
                type="button"
                onClick={() => { openProptech('garantia'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Aluguel Sem Fiador (Garantia)</span>
                </span>
                <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase">
                  Zero Caução
                </span>
              </button>
            </div>

            {/* Calculadoras & Simuladores */}
            <div className="space-y-1 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                Simuladores & Links Úteis
              </span>

              <button
                type="button"
                onClick={() => { openProptech('comprar_ou_alugar'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-indigo-600" />
                <span>Calculadora: Comprar ou Alugar?</span>
              </button>

              <button
                type="button"
                onClick={() => { openProptech('financiamento'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-teal-600" />
                <span>Simulador Financiamento (SAC vs PRICE)</span>
              </button>

              <button
                type="button"
                onClick={() => { openProptech('reajuste'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Calculadora de Reajuste (IPCA / IGP-M)</span>
              </button>

              <button
                type="button"
                onClick={() => { openProptech('links_uteis'); setIsMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-teal-600" />
                <span>Cartilha de Condomínio & Links Úteis</span>
              </button>

              <a
                href="#sobre"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-bold text-slate-800 hover:bg-slate-100"
              >
                Nossa Sede no Bairro Arvoredo
              </a>
            </div>

            {/* Informações Institucionais & Responsabilidade Técnica */}
            <div className="p-3 bg-slate-50 rounded-xl text-[10px] text-slate-500 space-y-1">
              <div className="font-bold text-slate-700">Morada Digital Intermediação Imobiliária</div>
              <div>{MORADA_BRAND.address}</div>
              <div className="text-indigo-600 font-semibold">{MORADA_BRAND.creci}</div>
              <div className="text-amber-700 font-semibold">Diretor Técnico: Daniel Gama (CRECI 68.165-F)</div>
            </div>

          </div>

          {/* Drawer Sticky Footer with Anunciar Imóvel & CRM Access */}
          <div className="p-4 border-t border-slate-100 bg-white space-y-2">
            <button
              type="button"
              onClick={() => { setIsListingWizardOpen(true); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20 transition-colors"
            >
              <Building2 className="w-4 h-4 text-white" />
              <span>Anunciar / Vender Imóvel</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setIsPhonesModalOpen(true); setIsMobileMenuOpen(false); }}
                className="py-2 px-3 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                <span>Telefones</span>
              </button>

              <button
                type="button"
                onClick={() => { requestSystemAccess(); setIsMobileMenuOpen(false); }}
                className="py-2 px-3 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-300" />
                <span>Área Restrita</span>
              </button>
            </div>
          </div>
        </aside>

        {/* 3. MODAL: CENTRAL DE TELEFONES & CELULARES CONFIGURADOS */}
        {isPhonesModalOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setIsPhonesModalOpen(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Central Telefônica & Celulares</h3>
                    <p className="text-xs text-slate-500">Contatos diretos e canais oficiais da Morada Digital</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPhonesModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Informações da Sede */}
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-200/70">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>Sede Operacional: {MORADA_BRAND.address}</span>
                </div>
                <div className="text-slate-600 text-[11px] pl-5">
                  Responsabilidade Técnica: <strong className="text-slate-800">Daniel Gama (CRECI 68.165-F)</strong> • {MORADA_BRAND.creci}
                </div>
              </div>

              {/* Lista dos Números Configuradas */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Linhas Diretas Disponíveis ({MORADA_BRAND.contactPhones.length})
                </span>

                {MORADA_BRAND.contactPhones.map(phone => (
                  <div
                    key={phone.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{phone.label}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {phone.badge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block">{phone.department}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                        {phone.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">{phone.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {phone.number}
                      </span>

                      <div className="flex items-center gap-2">
                        {phone.isWhatsapp ? (
                          <a
                            href={`https://wa.me/${phone.clean}?text=${encodeURIComponent(`Olá! Gostaria de falar com o departamento de ${phone.department} da Morada Digital.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : null}

                        <a
                          href={`tel:${phone.clean}`}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Ligar</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => copyToClipboard(phone.number, phone.label)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copiar número"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Copiar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão Fechar Modal */}
              <button
                type="button"
                onClick={() => setIsPhonesModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        )}

        {/* 4. FLOATING MOBILE BOTTOM NAVIGATION BAR (Layout Mobile Especializado) */}
        <nav 
          aria-label="Navegação Rápida Móvel"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-around"
        >
          {/* Todos Imóveis */}
          <button
            type="button"
            onClick={() => {
              setOnlyFavorites(false);
              const el = document.getElementById('imoveis');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-600 hover:text-indigo-600 cursor-pointer min-w-[54px]"
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-bold">Imóveis</span>
          </button>

          {/* Comprar */}
          <button
            type="button"
            onClick={() => {
              setGoal('venda');
              setOnlyFavorites(false);
              const el = document.getElementById('imoveis');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer min-w-[54px] ${
              goal === 'venda' && !onlyFavorites ? 'text-indigo-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            <Building2 className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Comprar</span>
          </button>

          {/* Alugar */}
          <button
            type="button"
            onClick={() => {
              setGoal('locacao');
              setOnlyFavorites(false);
              const el = document.getElementById('imoveis');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer min-w-[54px] ${
              goal === 'locacao' && !onlyFavorites ? 'text-indigo-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            <ShieldCheck className="w-4 h-4 mb-0.5" />
            <span className="text-[10px]">Alugar</span>
          </button>

          {/* Favoritos */}
          <button
            type="button"
            onClick={() => {
              setOnlyFavorites(prev => !prev);
              const el = document.getElementById('imoveis');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl cursor-pointer relative min-w-[54px] ${
              onlyFavorites ? 'text-rose-600 font-extrabold' : 'text-slate-600'
            }`}
          >
            <Heart className={`w-4 h-4 mb-0.5 ${favorites.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span className="text-[10px]">Salvos</span>
            {favorites.length > 0 && (
              <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* WhatsApp Direct Floating Button */}
          <a
            href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20atendimento%20Morada%20Digital`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px]">Plantão</span>
          </a>
        </nav>

      </header>

      {/* 2. HERO SECTION - WITH USER'S OFFICIAL MORADA DIGITAL BANNER */}
      <section className="relative bg-gradient-to-b from-slate-100 via-white to-slate-50 pt-4 sm:pt-6 pb-12 sm:pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Visual Banner (Official Morada Digital Artwork) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-950 mb-8 group">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_23.26.06_d24aabb1.jpeg"
              alt="Morada Digital - Bem-vindo à Sua Casa"
              className="w-full h-auto object-cover object-center max-h-[640px] transition-transform duration-700 hover:scale-[1.01]"
            />
            
            {/* Luminous bottom overlay with operational physical base, Landline & WhatsApp */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 font-medium text-slate-200 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span><strong>Sede Operacional:</strong> {MORADA_BRAND.address} • CEP: {MORADA_BRAND.cep}</span>
                </span>

                <a
                  href="tel:3133573030"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 font-bold text-slate-200 hover:text-white hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Fixo: (31) 3357-3030</span>
                </a>
                
                <a
                  href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20na%20Morada%20Digital`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 backdrop-blur-md font-bold text-white transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: {MORADA_BRAND.phone}</span>
                </a>
              </div>

              <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-xs text-teal-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>Imobiliária 100% Digital • Lançamento 2026</span>
              </div>
            </div>
          </div>

          {/* 3. ADVANCED ZAP IMÓVEIS STYLE SEARCH BOX */}
          <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-200/90 max-w-5xl mx-auto -mt-4 relative z-10">
            
            {/* Goal Tabs: Comprar vs Alugar vs Lançamentos (ZAP Imóveis style) */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-5">
              <button
                onClick={() => setGoal('venda')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'venda'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Comprar
              </button>

              <button
                onClick={() => setGoal('locacao')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'locacao'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Alugar
              </button>

              <button
                onClick={() => setGoal('lancamento')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  goal === 'lancamento'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Lançamentos 2026
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              
              {/* Location Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Localização</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Bairro ou cidade..."
                    value={locationQuery}
                    onChange={e => setLocationQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Tipo de Imóvel</label>
                <select
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="todos">Todos os Tipos</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="casa_condominio">Casa em Condomínio</option>
                  <option value="cobertura">Cobertura</option>
                  <option value="studio">Studio</option>
                  <option value="comercial">Comercial</option>
                </select>
              </div>

              {/* Bedrooms (ZAP style chip) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Dormitórios</label>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMinBedrooms(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        minBedrooms === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num === 0 ? 'Todos' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parking Spots */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Vagas de Garagem</label>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMinParking(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        minParking === num
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num === 0 ? 'Todas' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Row: Max Price slider & Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-600">Preço Máximo:</span>
                <span className="text-sm font-bold text-indigo-700">
                  {maxPrice >= 10000000 ? 'Sem limite' : `Até R$ ${(maxPrice / 1000).toLocaleString('pt-BR')}k`}
                </span>
                <input
                  type="range"
                  min={200000}
                  max={10000000}
                  step={200000}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-36 accent-indigo-600 cursor-pointer"
                />
              </div>

              <a
                href="#imoveis"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Buscar {filteredProperties.length} Imóveis</span>
              </a>
            </div>

          </div>

          {/* Bright Visual Categories with High-Definition Daylight Photos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-8 max-w-5xl">
            {[
              {
                title: 'Casas Contemporâneas',
                desc: 'Jardins e luz natural',
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
                type: 'casa'
              },
              {
                title: 'Coberturas com Terraço',
                desc: 'Vistas panorâmicas 360°',
                img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
                type: 'cobertura'
              },
              {
                title: 'Apartamentos Nobres',
                desc: 'Varanda e acabamentos finos',
                img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
                type: 'apartamento'
              },
              {
                title: 'Studios & Compactos',
                desc: 'Design e praticidade urbana',
                img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
                type: 'studio'
              }
            ].map(cat => (
              <button
                key={cat.title}
                type="button"
                onClick={() => {
                  setPropertyType(cat.type);
                  const el = document.getElementById('imoveis');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative h-28 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all text-left cursor-pointer"
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-3 flex flex-col justify-end text-white">
                  <span className="font-bold text-xs leading-snug group-hover:text-teal-300 transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {cat.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. CATALOG SECTION (ZAP IMÓVEIS INSPIRED CARDS) */}
      <section id="imoveis" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Properties Grid Header with Optional Favorites Banner */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curadoria Exclusiva Morada Digital
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Imóveis Selecionados com Verificação Jurídica
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Exibindo <strong>{filteredProperties.length}</strong> opções disponíveis
          </span>
        </div>

        {/* Active Favorites Filter Banner */}
        {onlyFavorites && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-rose-900 block">Exibindo seus {filteredProperties.length} imóveis salvos nos Favoritos</span>
                <span className="text-[11px] text-rose-700">Clique no coração para adicionar ou remover imóveis da sua lista salva.</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOnlyFavorites(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-100/80 text-rose-700 font-bold text-xs border border-rose-200 transition-colors cursor-pointer shadow-2xs"
            >
              Ver Todos os Imóveis
            </button>
          </div>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(prop => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges & Interactive Favorite Heart */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* ZAP Style Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      {prop.goal === 'venda' ? 'Venda' : prop.goal === 'locacao' ? 'Locação' : 'Lançamento'}
                    </span>
                    {prop.exclusive && (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-xs">
                        Exclusivo
                      </span>
                    )}
                  </div>

                  {/* Interactive Card Favorite Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id, prop.title);
                    }}
                    title={favorites.includes(prop.id) ? "Remover dos favoritos" : "Salvar nos favoritos"}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer z-10 ${
                      favorites.includes(prop.id)
                        ? 'bg-rose-500 text-white hover:bg-rose-600 scale-110 shadow-rose-500/30'
                        : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(prop.id) ? 'fill-current' : ''}`} />
                  </button>

                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-lg z-10">
                    Cód: {prop.code}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {prop.neighborhood}, {prop.city}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">
                      {prop.title}
                    </h3>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.usableArea}m²</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.bedrooms} quartos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prop.parkingSpots} vagas</span>
                    </div>
                  </div>

                  {/* Price & Condo */}
                  <div>
                    <span className="text-xs text-slate-400 block">Valor:</span>
                    <div className="text-xl font-bold font-serif text-slate-900">
                      R$ {prop.price.toLocaleString('pt-BR')},00
                    </div>
                    {prop.condoFee && (
                      <span className="text-[11px] text-slate-500 block">
                        Condomínio: R$ {prop.condoFee} • IPTU: R$ {prop.iptuAnnual ? Math.round(prop.iptuAnnual/12) : 0}/mês
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedPropertyModal(prop)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ver Detalhes</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20tenho%20interesse%20no%20im%C3%B3vel%20${prop.code}%20(${encodeURIComponent(prop.title)})`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>
          ))}
        </div>

      </section>

      {/* 5. TECNOLOGIA & GARANTIAS MORADA DIGITAL */}
      <section className="py-16 bg-gradient-to-b from-slate-50 via-slate-100 to-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Inovação Imobiliária • Garantia Total em Contagem & BH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 leading-tight">
              A Revolução do Aluguel sem Fiador e Ferramentas Inteligentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Unimos a agilidade das maiores proptechs do Brasil com o atendimento próximo, presencial e seguro da Morada Digital no Bairro Arvoredo.
            </p>
          </div>

          {/* 6 High-Converting Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Aluguel sem Fiador & Repasse Garantido */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    Garantia Total
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Aluguel Sem Fiador & Caução Zero
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Inquilino aluga em minutos sem fiador. Proprietário recebe todo dia 12 garantido, mesmo se houver atraso, mais proteção de até R$ 50.000 para reparos.
                  </p>
                </div>
                <div className="bg-emerald-50/70 rounded-xl p-3 text-[11px] text-emerald-800 font-medium space-y-1 border border-emerald-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pagamento garantido todo dia 12</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Vistoria fotográfica de entrada e saída</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('garantia')}
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Conhecer Garantias Morada</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Calculadora Comprar ou Alugar? */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-inner">
                    <Coins className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                    Simulador Financeiro
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-700 transition-colors">
                    Calculadora: Comprar ou Alugar?
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Compare os números reais: o custo de financiar um imóvel versus o retorno de alugar e investir a entrada no CDI/Selic ao longo de 5, 10 ou 20 anos.
                  </p>
                </div>
                <div className="bg-indigo-50/70 rounded-xl p-3 text-[11px] text-indigo-800 font-medium space-y-1 border border-indigo-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Projeção de patrimônio em 10 anos</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Rendimento líquido do CDI vs Valorização</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('comprar_ou_alugar')}
                className="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Simular Comprar vs Alugar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Simulador Avançado SAC vs PRICE */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-inner">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                    Crédito Habitacional
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-700 transition-colors">
                    Financiamento: SAC vs PRICE
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Simule até 35 anos (420 meses), use seu FGTS para amortizar a entrada e confira o comparativo de taxas da Caixa, Itaú, Bradesco e Santander.
                  </p>
                </div>
                <div className="bg-teal-50/70 rounded-xl p-3 text-[11px] text-teal-800 font-medium space-y-1 border border-teal-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Cálculo de Renda Mínima Recomendada</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Comparativo de 4 principais bancos</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('financiamento')}
                className="mt-5 w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Simulador SAC vs PRICE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Calculadora de Reajuste Anual */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                    IPCA & IGP-M
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                    Reajuste Anual de Aluguel
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Calcule o novo valor exato da locação de acordo com os índices oficiais acumulados e gere um comunicado formal para WhatsApp pronto para envio.
                  </p>
                </div>
                <div className="bg-amber-50/70 rounded-xl p-3 text-[11px] text-amber-800 font-medium space-y-1 border border-amber-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Índice oficial IBGE e FGV</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Gera mensagem formatada para WhatsApp</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('reajuste')}
                className="mt-5 w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Calcular Reajuste Anual</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 5: Preço Inteligente por m² */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-inner">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                    Inteligência Contagem
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                    Preço Inteligente por m²
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Descubra o valor médio de venda e aluguel por m² nos bairros Arvoredo, Cabral, Eldorado e Riacho, com tempo médio de liquidez e rentabilidade (Yield).
                  </p>
                </div>
                <div className="bg-blue-50/70 rounded-xl p-3 text-[11px] text-blue-800 font-medium space-y-1 border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Liquidez estimada (dias para fechar)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Yield anual para investidores</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('preco_inteligente')}
                className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Consultar Preços por Bairro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 6: Cartilha de Condomínio & Links Oficiais */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group hover:-translate-y-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full border border-purple-200">
                    Guia Prático
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-700 transition-colors">
                    Cartilha Condomínio & Links Úteis
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Tabela clara de quem paga o que: despesas ordinárias do inquilino versus extraordinárias do proprietário, mais links oficiais de certidões e cartórios.
                  </p>
                </div>
                <div className="bg-purple-50/70 rounded-xl p-3 text-[11px] text-purple-800 font-medium space-y-1 border border-purple-100">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Divisão de taxas de condomínio</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>Links: Registradores, IPTU Contagem e FGTS</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => openProptech('links_uteis')}
                className="mt-5 w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Acessar Cartilha e Links</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FINANCING SIMULATOR (ZAP IMÓVEIS INSPIRATION) */}
      <section id="simulador" className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">
              Simulação de Financiamento Habitacional
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 mt-1">
              Calcule seu Poder de Compra em Minutos
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Estimativa com base nas taxas de mercado (Caixa Econômica, Itaú, Bradesco e Santander).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200">
            
            {/* Sliders Form */}
            <div className="md:col-span-7 space-y-5 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Valor do Imóvel:</span>
                  <span className="text-indigo-700 font-extrabold text-sm">
                    R$ {simValue.toLocaleString('pt-BR')},00
                  </span>
                </div>
                <input
                  type="range"
                  min={200000}
                  max={5000000}
                  step={50000}
                  value={simValue}
                  onChange={e => setSimValue(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-700 mb-1">
                  <span>Entrada (Mínimo 20%):</span>
                  <span className="text-slate-900 font-bold">
                    R$ {simDownPayment.toLocaleString('pt-BR')},00 ({Math.round((simDownPayment/simValue)*100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={simValue * 0.2}
                  max={simValue * 0.8}
                  step={20000}
                  value={simDownPayment}
                  onChange={e => setSimDownPayment(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prazo de Pagamento</label>
                  <select
                    value={simYears}
                    onChange={e => setSimYears(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold"
                  >
                    <option value={15}>15 anos (180 meses)</option>
                    <option value={20}>20 anos (240 meses)</option>
                    <option value={25}>25 anos (300 meses)</option>
                    <option value={30}>30 anos (360 meses)</option>
                    <option value={35}>35 anos (420 meses)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taxa de Juros Estimada</label>
                  <div className="bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900">
                    {simRate}% a.a. (SAC)
                  </div>
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="md:col-span-5 bg-indigo-900 text-white p-6 rounded-2xl shadow-xl space-y-4">
              <span className="text-xs uppercase font-bold text-teal-300 tracking-wider block">
                Primeira Parcela Estimada
              </span>
              <div className="text-3xl sm:text-4xl font-bold font-serif text-white">
                R$ {firstInstallment.toLocaleString('pt-BR')}<span className="text-base font-normal">/mês</span>
              </div>
              <p className="text-xs text-indigo-200 leading-relaxed">
                Valor financiado de R$ {financedAmount.toLocaleString('pt-BR')},00 em {totalMonths} meses pelo sistema SAC (parcelas decrescentes).
              </p>

              <a
                href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20fiz%20uma%20simula%C3%A7%C3%A3o%20de%20financiamento%20no%20valor%20de%20R%24%20${simValue.toLocaleString('pt-BR')}%20e%20gostaria%20de%20aprovar%20meu%20cr%C3%A9dito%20pela%20Morada%20Digital.`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Aprovar Crédito sem Custo</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 6. VENDER / ANUNCIAR MEU IMÓVEL - OPÇÃO PARA PROPRIETÁRIOS */}
      <section id="anunciar" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 overflow-hidden border border-slate-800 shadow-2xl">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                <span>Para Proprietários • Venda e Locação Descomplicada</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white leading-tight">
                Quer Vender ou Alugar Seu Imóvel? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-indigo-200 to-white">
                  Anuncie na Morada Digital e Assine o Contrato Online.
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
                Cadastre seu imóvel facilmente, anexe as fotos direto do celular ou computador e formalize o contrato de intermediação com assinatura eletrônica e total segurança jurídica (Artigos 722 a 729 do Código Civil e Lei nº 14.063/2020).
              </p>

              {/* Legal & Operational Advantages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-xs block text-white">Segurança Jurídica Total</span>
                  <p className="text-[11px] text-slate-400">Contrato de corretagem formalizado, certidões negativas e conformidade legal.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <Building2 className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-xs block text-white">Anexe Fotos com Facilidade</span>
                  <p className="text-[11px] text-slate-400">Upload de fotos reais sem complicação direto da galeria do celular.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-xs block text-white">Portais ZAP & VivaReal</span>
                  <p className="text-[11px] text-slate-400">Divulgação massiva para compradores e investidores em Contagem e BH.</p>
                </div>
              </div>
            </div>

            {/* Action Card Button */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center space-y-4">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Sem Fila de Cartório
              </span>

              <button
                onClick={() => setIsListingWizardOpen(true)}
                className="w-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black py-4 px-6 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <span>Anunciar Meu Imóvel Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-[10px] text-slate-400">
                Avaliação gratuita de mercado • {MORADA_BRAND.creci}
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 7. ABOUT & LOCAL SEO CONTAGEM-MG (BASE OPERACIONAL & GOOGLE MAPS) */}
      <section id="sobre" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          
          <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  Sede Própria em Contagem - MG
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                  Google Maps & Presença Local
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900 leading-tight">
                Morada Digital: Inovação Imobiliária com Base Humana em Contagem
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Com base operacional sediada no <strong>Bairro Arvoredo</strong> em Contagem-MG, eliminamos as burocracias das imobiliárias convencionais com processos 100% digitais, vistoria rigorosa e total blindagem jurídica chefiada pelo Diretor Técnico <strong>Daniel Gama (CRECI 68.165-F)</strong>.
              </p>

              {/* Informações Oficiais de Contato & Localização */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Endereço Oficial:</strong>
                    <span>{MORADA_BRAND.address}</span>
                    <span className="block text-[11px] text-slate-500">CEP: {MORADA_BRAND.cep} • Bairro Arvoredo</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Atendimento Telefônico:</strong>
                    <span>Fixo Central: <a href="tel:3133573030" className="hover:underline font-bold text-slate-900">(31) 3357-3030</a></span>
                    <span className="block text-[11px] text-slate-500">Seg. a Sex. 08:30 às 18:00 | Sáb. 09h às 13h</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Plantão WhatsApp Regional:</strong>
                    <a href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20atendimento%20Morada%20Digital`} target="_blank" rel="noreferrer" className="hover:underline font-bold text-emerald-700">
                      (31) 98427-9865
                    </a>
                    <span className="block text-[11px] text-slate-500">Plantão 24h para Locação e Vendas</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900">Habilitação CRECI-MG:</strong>
                    <span>{MORADA_BRAND.creci}</span>
                    <span className="block text-[11px] text-slate-500">Diretor: Daniel Gama (CRECI 68.165-F)</span>
                  </div>
                </div>
              </div>

              {/* Bairros de Atuação Prioritária em Contagem para SEO Local */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Regiões de Atuação Prioritária em Contagem & Grande BH:
                </span>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {[
                    'Bairro Arvoredo (Sede)',
                    'Eldorado',
                    'Cabral',
                    'Riacho das Pedras',
                    'Novo Eldorado',
                    'Fonte Grande',
                    'Industrial',
                    'Inconfidentes',
                    'Centro de Contagem',
                    'Belo Horizonte (Grande BH)'
                  ].map(bairro => (
                    <span
                      key={bairro}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200"
                    >
                      {bairro}
                    </span>
                  ))}
                </div>
              </div>

              {/* Ações Locais: Traçar Rota no Google Maps */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Pinheiro+264+Arvoredo+Contagem+MG"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Traçar Rota no Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20visita%20na%20sede%20da%20Morada%20Digital%20no%20Bairro%20Arvoredo`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Agendar Atendimento Presencial</span>
                </a>
              </div>

            </div>

            {/* Google Maps Embed Interativo + Foto da Sede */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md border border-slate-200 bg-slate-100">
                <iframe
                  title="Localização Morada Digital Contagem MG no Google Maps"
                  src="https://maps.google.com/maps?q=Rua+Pinheiro+264+Arvoredo+Contagem+MG&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Coordenadas: -19.8665, -44.0252 (Arvoredo, Contagem)</span>
                </span>
                <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                  Verificado
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. FOOTER EXPANDIDO COM LINKS ÚTEIS E GARANTIAS */}
      <footer className="bg-slate-950 text-slate-400 py-14 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Morada Digital & Sede */}
            <div className="space-y-3">
              <MoradaLogo variant="light" size="sm" />
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Plataforma imobiliária digital pioneira em Contagem e Grande BH, combinando agilidade proptech e atendimento presencial consultivo com total blindagem jurídica.
              </p>
              <div className="space-y-1 text-[11px] pt-1">
                <div className="text-slate-300 font-bold">{MORADA_BRAND.legalName}</div>
                <div className="text-slate-400">CRECI Jurídico: {MORADA_BRAND.creci}</div>
                <div className="text-amber-300/90 font-medium">Diretor: Daniel Gama (CRECI 68.165-F)</div>
                <div className="text-slate-400 pt-1">
                  <span className="block">{MORADA_BRAND.address}</span>
                  <span className="block text-slate-500">CEP: {MORADA_BRAND.cep}</span>
                </div>
              </div>
            </div>

            {/* Col 2: Garantias Morada Digital */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block">
                Garantias & Vantagens
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    onClick={() => openProptech('garantia')}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Aluguel Sem Fiador (Caução Zero)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('garantia')}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Pagamento Garantido todo dia 12</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('garantia')}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Proteção de até R$ 50.000 em Reparos</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('preco_inteligente')}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Preço Inteligente por m² (Contagem)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsListingWizardOpen(true)}
                    className="hover:text-emerald-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Anunciar Imóvel com Contrato Digital</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Calculadoras & Ferramentas Interativas */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
                Calculadoras & Simuladores
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    onClick={() => openProptech('comprar_ou_alugar')}
                    className="hover:text-indigo-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Coins className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Calculadora "Comprar ou Alugar?"</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('financiamento')}
                    className="hover:text-indigo-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Calculator className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Simulador Financiamento (SAC vs PRICE)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('reajuste')}
                    className="hover:text-indigo-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Calculadora de Reajuste (IPCA / IGP-M)</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openProptech('links_uteis')}
                    className="hover:text-indigo-300 text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>Cartilha: Quem Paga o Quê no Condomínio</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Links Oficiais & Portais */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 block">
                Links Úteis & Cartórios
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a
                    href="https://registradores.onr.org.br"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-teal-300 text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>Certidão de Matrícula Online (ONR)</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.contagem.mg.gov.br"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-teal-300 text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>IPTU e Tributos Contagem</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="http://www.caixa.gov.br/voce/habitacao"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-teal-300 text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>Simulador Oficial da Caixa</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://crecimg.gov.br"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-teal-300 text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>CRECI-MG Conselho Regional</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.fipe.org.br/pt-br/indices/fipezap"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-teal-300 text-slate-300 transition-colors flex items-center justify-between"
                  >
                    <span>Índice FipeZAP de Locação & Venda</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

          </div>

          {/* Sub-footer Bar */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <div className="text-slate-500 text-center sm:text-left">
              <span>© {new Date().getFullYear()} {MORADA_BRAND.legalName}. Todos os direitos reservados. Conforme Lei nº 8.245/91 e Código Civil.</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="tel:3133573030"
                className="text-slate-300 hover:text-white font-bold transition-colors"
              >
                Fixo: (31) 3357-3030
              </a>
              <span className="text-slate-700">•</span>
              <a
                href={`https://wa.me/${MORADA_BRAND.whatsappClean}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
              >
                WhatsApp: (31) 98427-9865
              </a>
              <span className="text-slate-700">•</span>
              <button
                onClick={requestSystemAccess}
                className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 border border-slate-700 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs"
                title="Acessar painel interno do corretor e CRM"
              >
                <Lock className="w-3 h-3 text-indigo-400" />
                <span>{isSystemAuthenticated ? 'Painel CRM' : 'Área Restrita'}</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* MODAL: FERRAMENTAS PROPTECH & GARANTIAS */}
      {isProptechModalOpen && (
        <ProptechToolsHub
          initialTab={proptechInitialTab}
          onClose={() => setIsProptechModalOpen(false)}
        />
      )}

      {/* MODAL: PROPERTY DETAILS & CONTACT */}
      {selectedPropertyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-indigo-600 font-bold">
                  {selectedPropertyModal.code} • {selectedPropertyModal.neighborhood}, {selectedPropertyModal.city}
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900">
                  {selectedPropertyModal.title}
                </h3>
              </div>
              <button onClick={() => setSelectedPropertyModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4">
              <img src={selectedPropertyModal.images[0]} alt={selectedPropertyModal.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <div className="text-xl font-bold font-serif text-slate-900">
                  R$ {selectedPropertyModal.price.toLocaleString('pt-BR')},00
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedPropertyModal.description}
                </p>
                <div className="pt-2 border-t border-slate-100 space-y-1 text-slate-500">
                  <div><strong>Metragem:</strong> {selectedPropertyModal.usableArea}m² úteis</div>
                  <div><strong>Quartos:</strong> {selectedPropertyModal.bedrooms} ({selectedPropertyModal.suites} suítes)</div>
                  <div><strong>Vagas:</strong> {selectedPropertyModal.parkingSpots} vagas demarcadas</div>
                </div>
              </div>

              {/* Lead Capture Form */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm mb-1">Agendar Visita ou Mais Informações</h4>
                <p className="text-[11px] text-slate-500 mb-3">Atendimento imediato via WhatsApp oficial da Morada Digital</p>

                <form onSubmit={e => handleLeadSubmit(e, selectedPropertyModal)} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seu Nome</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Silva"
                      value={leadName}
                      onChange={e => setLeadName(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Seu WhatsApp</label>
                    <input
                      type="text"
                      required
                      placeholder="(31) 98427-9865"
                      value={leadPhone}
                      onChange={e => setLeadPhone(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mensagem</label>
                    <textarea
                      rows={2}
                      placeholder="Gostaria de agendar visita neste imóvel."
                      value={leadMessage}
                      onChange={e => setLeadMessage(e.target.value)}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enviar e Falar no WhatsApp</span>
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WIZARD MODAL: ANUNCIAR / VENDER IMÓVEL (COM UPLOAD DE FOTOS & CONTRATO ELETRÔNICO) */}
      <PropertyListingWizard 
        isOpen={isListingWizardOpen} 
        onClose={() => setIsListingWizardOpen(false)} 
      />

      {/* GEMINI CHATBOT INTEGRATED WITH GOOGLE MAPS GROUNDING */}
      <GeminiChatbot />

    </div>
  );
};
