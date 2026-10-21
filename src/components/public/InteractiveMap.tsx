import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Layers, Eye, Sparkles, Building2 } from 'lucide-react';
import { Property } from '../../types';

interface InteractiveMapProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeNeighborhood, setActiveNeighborhood] = useState('todos');
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);

  const neighborhoods = [
    { name: 'todos', label: 'Todos os Bairros' },
    { name: 'Jardins', label: 'Jardins', count: 2 },
    { name: 'Itaim Bibi', label: 'Itaim Bibi', count: 1 },
    { name: 'Pinheiros', label: 'Pinheiros', count: 1 },
    { name: 'Moema', label: 'Moema', count: 2 }
  ];

  const formatShortCurrency = (val: number) => {
    if (val >= 1000000) {
      return `R$ ${(val / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(val / 1000).toFixed(0)}k`;
  };

  const getCoordinatesPosition = (lat: number, lng: number) => {
    const centerLat = -23.57;
    const centerLng = -46.67;
    const scale = 500 * zoomLevel;

    const x = 50 + (lng - centerLng) * scale;
    const y = 50 - (lat - centerLat) * scale;

    return {
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(10, Math.min(88, y))}%`
    };
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      
      {/* Top Map Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        
        {/* Neighborhood Pill filter */}
        <div className="flex gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 pointer-events-auto overflow-x-auto max-w-[80%] shadow-lg">
          {neighborhoods.map(n => {
            const isActive = activeNeighborhood === n.name;
            return (
              <button
                key={n.name}
                onClick={() => setActiveNeighborhood(n.name)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive ? 'text-slate-950 font-extrabold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mapActiveNeighborhood"
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span>{n.label}</span>
              </button>
            );
          })}
        </div>

        {/* Zoom Controls */}
        <div className="flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 pointer-events-auto shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 2))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Aumentar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.7))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title="Diminuir Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Styled Vector Map Grid & Roads Background */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center select-none">
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#475569" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Animated Glowing Arteries / Avenidas */}
          <path d="M 0 350 Q 400 280 1200 400" stroke="#f59e0b" strokeWidth="3.5" fill="none" opacity="0.6" strokeDasharray="8 4" />
          <path d="M 150 0 Q 300 350 450 800" stroke="#38bdf8" strokeWidth="3" fill="none" opacity="0.5" />
          <path d="M 500 0 L 800 600" stroke="#64748b" strokeWidth="2.5" fill="none" opacity="0.4" />
          <circle cx="450" cy="320" r="140" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 6" fill="none" opacity="0.35" />
        </svg>

        {/* Radar Pulsing Rings on Key Hotspots */}
        <div className="absolute top-[38%] left-[45%] pointer-events-none -translate-x-1/2 -translate-y-1/2">
          <span className="absolute w-24 h-24 rounded-full bg-amber-400/10 animate-ping" />
          <span className="absolute w-40 h-40 rounded-full bg-amber-400/5 animate-pulse" />
        </div>

        {/* Metro & Landmark Pins */}
        <div className="absolute top-[28%] left-[38%] text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-cyan-800/60 shadow pointer-events-none flex items-center gap-1">
          <span>🚇 Metrô Fradique</span>
        </div>
        <div className="absolute top-[52%] left-[58%] text-[10px] font-mono text-cyan-300 bg-slate-900/90 px-2 py-0.5 rounded-lg border border-cyan-800/60 shadow pointer-events-none flex items-center gap-1">
          <span>🚇 Faria Lima Financial</span>
        </div>
        <div className="absolute top-[20%] left-[64%] text-[10px] font-mono text-emerald-300 bg-slate-900/90 px-2.5 py-0.5 rounded-lg border border-emerald-800/60 shadow pointer-events-none flex items-center gap-1">
          <span>🌳 Pq. Ibirapuera</span>
        </div>

        {/* Dynamic Property Pins on Map */}
        {properties
          .filter(p => activeNeighborhood === 'todos' || p.neighborhood.toLowerCase().includes(activeNeighborhood.toLowerCase()))
          .map((prop) => {
            const pos = getCoordinatesPosition(prop.coordinates.lat, prop.coordinates.lng);
            const isSelected = selectedProperty?.id === prop.id;

            return (
              <div
                key={prop.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => onSelectProperty(prop)}
                onMouseEnter={() => setHoveredProperty(prop)}
                onMouseLeave={() => setHoveredProperty(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group"
              >
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs shadow-2xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110 z-30'
                      : 'bg-slate-900/95 text-white border border-slate-700/80 hover:border-amber-400 group-hover:bg-slate-800'
                  }`}
                >
                  <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{formatShortCurrency(prop.price)}</span>
                </motion.div>

                {/* Pin Tooltip Card */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-slate-700 hidden group-hover:block z-40 animate-in fade-in zoom-in-95 pointer-events-none">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono bg-black/70 px-2 py-0.5 rounded text-amber-300 font-bold">
                      {prop.code}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs line-clamp-1 text-white">{prop.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{prop.neighborhood} • {prop.usableArea}m²</p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800">
                    <span className="text-xs font-extrabold text-amber-400">
                      {formatShortCurrency(prop.price)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">Clique para abrir</span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Bottom Summary Bar */}
      <div className="absolute bottom-3 left-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="font-medium">
            <strong className="text-white">{properties.length} imóveis</strong> georreferenciados na malha de alta liquidez
          </span>
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Passe o mouse ou toque nos pins para inspecionar fotos
        </span>
      </div>
    </div>
  );
};
