import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  MapPin, 
  Maximize2, 
  BedDouble, 
  Bath, 
  Car, 
  Calendar, 
  Phone, 
  MessageCircle, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Video,
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ property, onClose }) => {
  const { favorites, toggleFavorite, addLead, showToast } = useRealEstate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'fotos' | 'detalhes' | 'proximidades'>('fotos');

  // Form State
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const isFavorited = favorites.includes(property.id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const pricePerM2 = Math.round(property.price / property.usableArea);

  const pointsOfInterest = [
    { name: 'Estação de Metrô Mais Próxima', distance: '450m (6 min a pé)', icon: '🚇' },
    { name: 'Colégio Dante Alighieri / St. Paul', distance: '1.2 km (4 min carro)', icon: '🎓' },
    { name: 'Supermercado St. Marche / Pão de Açúcar', distance: '300m (3 min a pé)', icon: '🛒' },
    { name: 'Hospital Sírio-Libanês / Einstein', distance: '1.8 km (7 min carro)', icon: '🏥' },
    { name: 'Parque do Ibirapuera / Trianon', distance: '1.4 km (5 min bike)', icon: '🌳' }
  ];

  const handleScheduleVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) return;

    // Push new lead into CRM
    addLead({
      name: leadName,
      phone: leadPhone,
      email: leadEmail,
      propertyOfInterestId: property.id,
      propertyOfInterestTitle: property.title,
      propertyOfInterestCode: property.code,
      budgetMax: property.price,
      interestType: property.goal,
      stage: 'visita_agendada',
      visitDate: visitDate || new Date().toISOString(),
      origin: 'site_direto',
      notes: `Solicitação de visita agendada via Portal Público para a data: ${visitDate || 'A combinar'}.`
    });

    setSubmitted(true);
    showToast(`Visita solicitada para o imóvel ${property.code}.`, 'Visita Registrada', 'success');
  };

  const whatsappMessage = encodeURIComponent(
    `Olá ${property.brokerName}, vi o imóvel ${property.code} (${property.title}) no valor de ${formatCurrency(property.price)} no portal Morada Digital e gostaria de agendar uma visita!`
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto flex items-center justify-center p-2 sm:p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
      >
        
        {/* Floating Top Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold bg-slate-950 text-amber-300 px-3 py-1 rounded-xl shadow-xs">
              {property.code}
            </span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
              {property.neighborhood}, {property.city} - {property.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isFavorited 
                  ? 'bg-rose-50 border-rose-200 text-rose-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-rose-600'
              }`}
              title="Favoritar"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-8">
          
          {/* 1. Main Gallery with Carousel */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-950 shadow-inner">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.8 }}
                  transition={{ duration: 0.2 }}
                  src={property.images[activeImageIndex]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-all cursor-pointer z-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full font-mono border border-white/10">
                {activeImageIndex + 1} de {property.images.length} Fotos HDR
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-24 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-500 scale-98 shadow-md' : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Title & Key Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
                  <span>{property.type}</span>
                  <span>•</span>
                  <span>{property.goal === 'venda' ? 'Venda Exclusiva' : property.goal}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-2 font-display">
                  {property.title}
                </h1>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  {property.address} - {property.neighborhood}, {property.city}/{property.state}
                </p>
              </div>

              {/* Spec Cards Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Área Útil</span>
                    <span className="font-extrabold text-sm text-slate-900">{property.usableArea} m²</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <BedDouble className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Quartos</span>
                    <span className="font-extrabold text-sm text-slate-900">{property.bedrooms} Dorms</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Bath className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Suítes</span>
                    <span className="font-extrabold text-sm text-slate-900">{property.suites} Suítes</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Vagas</span>
                    <span className="font-extrabold text-sm text-slate-900">{property.parkingSpots} Vagas</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-2">Descrição do Imóvel</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features & Amenities */}
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-3">Comodidades & Lazer Exclusivo</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Neighborhood Points of Interest */}
              <div>
                <h3 className="font-bold text-base text-slate-900 mb-3">Mobilidade & Pontos de Interesse</h3>
                <div className="space-y-2">
                  {pointsOfInterest.map((poi, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-base">{poi.icon}</span>
                        <span className="font-semibold text-slate-800">{poi.name}</span>
                      </div>
                      <span className="text-slate-500 font-bold">{poi.distance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Price Box & Schedule Form */}
            <div className="space-y-6">
              
              {/* Financial Box */}
              <div className="bg-slate-950 text-white p-6 rounded-3xl shadow-xl border border-slate-800">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  {property.goal === 'locacao' ? 'Valor da Locação' : 'Valor de Venda'}
                </span>
                <div className="text-3xl font-extrabold font-display text-white mt-1 mb-4">
                  {formatCurrency(property.goal === 'locacao' && property.rentalPrice ? property.rentalPrice : property.price)}
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Condomínio Mensal:</span>
                    <span className="font-semibold text-white">{property.condoFee ? formatCurrency(property.condoFee) : 'Sob Consulta'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IPTU Anual:</span>
                    <span className="font-semibold text-white">{property.iptuAnnual ? formatCurrency(property.iptuAnnual) : 'Sob Consulta'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor estimado por m²:</span>
                    <span className="font-bold text-amber-400">{formatCurrency(pricePerM2)} / m²</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/5511987124490?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>Conversar no WhatsApp Direto</span>
                </a>
              </div>

              {/* Responsible Broker Card */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                <img
                  src={property.brokerAvatar}
                  alt={property.brokerName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900">{property.brokerName}</span>
                    <ShieldCheck className="w-4 h-4 text-blue-600" title="Corretor Verificado CRECI" />
                  </div>
                  <span className="text-xs text-slate-500 block font-mono">{property.brokerCreci}</span>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-1">
                    <Clock className="w-3 h-3" />
                    <span>Tempo de resposta: ~5 min</span>
                  </div>
                </div>
              </div>

              {/* Lead / Visit Scheduling Form */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" /> Agendar Visita Presencial
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Nossos corretores acompanham você com exclusividade.
                </p>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <p className="font-bold text-xs">Visita Solicitada com Sucesso!</p>
                    <p className="text-[11px] text-emerald-700">
                      O lead já foi integrado ao nosso CRM e o corretor <strong>{property.brokerName}</strong> entrará em contato em breve.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleScheduleVisit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Seu Nome Completo *</label>
                      <input
                        type="text"
                        required
                        value={leadName}
                        onChange={e => setLeadName(e.target.value)}
                        placeholder="Ex: Dra. Ana Paula"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp com DDD *</label>
                      <input
                        type="text"
                        required
                        value={leadPhone}
                        onChange={e => setLeadPhone(e.target.value)}
                        placeholder="(11) 99999-8888"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Data Preferencial para Visita</label>
                      <input
                        type="datetime-local"
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full bg-slate-950 hover:bg-slate-800 text-white font-extrabold py-3 px-4 rounded-2xl text-xs transition-all cursor-pointer shadow-md"
                    >
                      Solicitar Agendamento
                    </motion.button>
                  </form>
                )}
              </div>

            </div>

          </div>

        </div>

      </motion.div>
    </div>
  );
};
