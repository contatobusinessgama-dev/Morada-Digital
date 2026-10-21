import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Car, 
  Maximize2, 
  Heart, 
  Phone, 
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
  Filter
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Property, PropertyGoal } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const PublicSite: React.FC = () => {
  const { 
    properties, 
    requestSystemAccess, 
    isSystemAuthenticated, 
    setCurrentView,
    addLead,
    showToast 
  } = useRealEstate();

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
    const matchesGoal = p.goal === goal || (goal === 'venda' && p.goal === 'lancamento');
    const matchesType = propertyType === 'todos' || p.type === propertyType;
    const matchesLocation = !locationQuery || 
      p.neighborhood.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(locationQuery.toLowerCase()) ||
      p.title.toLowerCase().includes(locationQuery.toLowerCase());
    const matchesBedrooms = minBedrooms === 0 || p.bedrooms >= minBedrooms;
    const matchesParking = minParking === 0 || p.parkingSpots >= minParking;
    const matchesPrice = p.price <= maxPrice;

    return matchesGoal && matchesType && matchesLocation && matchesBedrooms && matchesParking && matchesPrice;
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/20">
              MD
            </div>
            <div>
              <span className="text-xl font-bold font-serif text-slate-900 block leading-tight">
                Morada <span className="text-teal-600 font-sans text-xs uppercase tracking-widest font-extrabold ml-1">Digital</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide block">
                Sua Imobiliária Inteligente • 100% Digital • Lançamento 2026
              </span>
            </div>
          </div>

          {/* Quick Info & Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#imoveis" className="hover:text-indigo-600 transition-colors">Ver Imóveis</a>
            <a href="#simulador" className="hover:text-indigo-600 transition-colors">Simulador de Financiamento</a>
            <a href="#sobre" className="hover:text-indigo-600 transition-colors">Nossa Sede & Sobre</a>
          </nav>

          {/* Actions: WhatsApp & Enter System */}
          <div className="flex items-center gap-3">
            
            <a
              href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20na%20Morada%20Digital`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>(31) 98427-9865</span>
            </a>

            {/* Direct Access to System */}
            <button
              onClick={requestSystemAccess}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Acessar painel interno do corretor e CRM"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isSystemAuthenticated ? 'Acessar Sistema CRM' : 'Entrar no Sistema'}</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. HERO SECTION - LUMINOUS, CLEAR & PROFESSIONAL (BRIGHT ARCHITECTURAL IMAGE) */}
      <section className="relative bg-white overflow-hidden py-14 sm:py-20 lg:py-24 border-b border-slate-200">
        
        {/* Bright Luxury Architectural Daytime House Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2400&q=90"
            alt="Fachada Residencial Contemporânea Iluminada - Morada Digital"
            className="w-full h-full object-cover object-center brightness-105 contrast-95"
          />
          {/* Luminous Light Gradient Overlay ensuring high contrast and pristine clarity */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/35 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Plataforma 100% Digital • Lançamento Oficial 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif tracking-tight text-slate-900 leading-tight">
              Sua Imobiliária Inteligente. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-indigo-600 to-indigo-900">
                Encontre, Visite e More com Clareza e Agilidade.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-2xl">
              A <strong>Morada Digital</strong> une a conveniência do atendimento 100% online com a solidez de nossa base operacional física em Contagem - MG. Experiência sem burocracia, fotos em alta definição e segurança jurídica integral.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 text-slate-800 font-semibold shadow-xs">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
                <span><strong>Sede:</strong> {MORADA_BRAND.address}</span>
              </span>
              <a
                href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis%20na%20Morada%20Digital`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 transition-colors shadow-xs"
              >
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>WhatsApp: {MORADA_BRAND.phone}</span>
              </a>
            </div>
          </div>

          {/* 3. ADVANCED ZAP IMÓVEIS STYLE SEARCH BOX */}
          <div className="bg-white text-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200/90 max-w-5xl">
            
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
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map(prop => (
            <div
              key={prop.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* ZAP Style Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                      {prop.goal === 'venda' ? 'Venda' : prop.goal === 'locacao' ? 'Locação' : 'Lançamento'}
                    </span>
                    {prop.exclusive && (
                      <span className="bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-xs">
                        Exclusivo
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-lg">
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

      {/* 5. FINANCING SIMULATOR (ZAP IMÓVEIS INSPIRATION) */}
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

      {/* 6. ABOUT & OPERATIONAL BASE ADDRESS */}
      <section id="sobre" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl border border-slate-200">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Lançamento Oficial 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              Morada Digital: Inovação Imobiliária com Base Humana
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Eliminamos filas de cartório e processos burocráticos. Com a Morada Digital, você pesquisa, agenda visitas com controle digital de chaves na portaria e assina contratos eletrônicos válidos em juízo com total tranquilidade.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span><strong>Sede Operacional:</strong> {MORADA_BRAND.address} • CEP: {MORADA_BRAND.cep}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span><strong>WhatsApp Oficial:</strong> {MORADA_BRAND.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span><strong>Registro:</strong> {MORADA_BRAND.creci}</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
              alt="Sede e interiores Morada Digital"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white text-sm block">Morada Digital</span>
            <span>{MORADA_BRAND.legalName} • {MORADA_BRAND.creci}</span>
            <span className="block text-[11px] text-slate-500 mt-1">{MORADA_BRAND.address}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={requestSystemAccess}
              className="text-indigo-400 hover:text-white underline font-semibold cursor-pointer"
            >
              Área do Corretor / CRM
            </button>
          </div>
        </div>
      </footer>

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

    </div>
  );
};
