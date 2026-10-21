import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Heart, Info, Sparkles, X, Layers } from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRealEstate();

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map(toast => {
          let icon = <Info className="w-4 h-4 text-sky-400" />;
          let borderColor = 'border-slate-800';
          let bgGradient = 'from-slate-900 to-slate-950';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            borderColor = 'border-emerald-500/30';
          } else if (toast.type === 'favorite') {
            icon = <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
            borderColor = 'border-rose-500/30';
          } else if (toast.type === 'crm') {
            icon = <Layers className="w-4 h-4 text-amber-400" />;
            borderColor = 'border-amber-500/30';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto p-3.5 rounded-2xl bg-gradient-to-r ${bgGradient} border ${borderColor} shadow-2xl backdrop-blur-xl text-white flex items-start gap-3 relative`}
            >
              <div className="mt-0.5 flex-shrink-0">{icon}</div>
              <div className="flex-1 pr-4">
                {toast.title && (
                  <h4 className="text-xs font-bold text-slate-100 mb-0.5">{toast.title}</h4>
                )}
                <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
