import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  MapPin, 
  BedDouble, 
  Bath, 
  Car, 
  Maximize2, 
  Sparkles, 
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Video
} from 'lucide-react';
import { Property } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';

interface PropertyCardProps {
  property: Property;
  onSelect?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  const { favorites, toggleFavorite, setSelectedProperty } = useRealEstate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isFavorited = favorites.includes(property.id);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleOpenDetails = () => {
    setSelectedProperty(property);
    if (onSelect) onSelect();
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
  };

  const getGoalBadge = () => {
    if (property.goal === 'lancamento') {
      return (
        <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Lançamento
        </span>
      );
    }
    if (property.goal === 'locacao') {
      return (
        <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-sm">
          Locação
        </span>
      );
    }
    return (
      <span className="bg-slate-950/90 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-sm border border-white/10">
        Venda
      </span>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-slate-300 transition-all duration-300 group flex flex-col h-full relative"
    >
      {/* Image Gallery Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer" onClick={handleOpenDetails}>
        <motion.img
          key={currentImageIndex}
          initial={{ opacity: 0.85, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {getGoalBadge()}
          {property.exclusive && (
            <span className="bg-blue-600/90 backdrop-blur-md text-white font-bold text-[10px] uppercase px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Exclusividade
            </span>
          )}
          {property.status === 'reservado' && (
            <span className="bg-amber-600 text-white font-bold text-[10px] uppercase px-2 py-1 rounded-lg shadow-sm">
              Reservado
            </span>
          )}
        </div>

        {/* Favorite & Code Button */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-md ${
              isFavorited
                ? 'bg-rose-500 text-white ring-4 ring-rose-500/20'
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorited ? 'Remover dos favoritos' : 'Favoritar imóvel'}
          >
            <Heart className={`w-4 h-4 transition-transform ${isFavorited ? 'fill-white scale-110' : ''}`} />
          </motion.button>
        </div>

        {/* Arrows on Image (visible on hover) */}
        {property.images.length > 1 && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:bg-black/90 transition-all cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Property Code & Dot pagination */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white z-10 pointer-events-none">
          <span className="text-[10px] font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg font-bold border border-white/10">
            {property.code}
          </span>

          {property.images.length > 1 && (
            <div className="flex gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full pointer-events-auto">
              {property.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentImageIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={handleOpenDetails}
            className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 cursor-pointer mb-3"
          >
            {property.title}
          </h3>

          {/* Key Specs Bar (Area, Dorms, Suites, Parking) */}
          <div className="grid grid-cols-4 gap-1 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 mb-3 text-xs">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-slate-400" /> {property.usableArea}m²
              </span>
              <span className="text-[10px] text-slate-400">Área útil</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-l border-slate-200/60">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <BedDouble className="w-3 h-3 text-slate-400" /> {property.bedrooms}
              </span>
              <span className="text-[10px] text-slate-400">Quartos</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-l border-slate-200/60">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Bath className="w-3 h-3 text-slate-400" /> {property.suites}
              </span>
              <span className="text-[10px] text-slate-400">Suítes</span>
            </div>

            <div className="flex flex-col items-center justify-center text-center border-l border-slate-200/60">
              <span className="font-extrabold text-slate-900 flex items-center gap-1">
                <Car className="w-3 h-3 text-slate-400" /> {property.parkingSpots}
              </span>
              <span className="text-[10px] text-slate-400">Vagas</span>
            </div>
          </div>

          {/* Amenities Mini-pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.features.slice(0, 3).map((feat, i) => (
              <span key={i} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                {feat}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="text-[10px] text-slate-400 font-medium px-1">
                +{property.features.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              {property.goal === 'locacao' ? 'Valor Aluguel / mês' : 'Valor de Venda'}
            </span>
            <div className="text-lg font-extrabold text-slate-900">
              {formatCurrency(property.goal === 'locacao' && property.rentalPrice ? property.rentalPrice : property.price)}
            </div>
            {property.condoFee && (
              <span className="text-[10px] text-slate-500 font-medium">
                Cond: {formatCurrency(property.condoFee)}
              </span>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenDetails}
            className="bg-slate-950 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm group-hover:bg-amber-500 group-hover:text-slate-950"
          >
            <span>Ver Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
