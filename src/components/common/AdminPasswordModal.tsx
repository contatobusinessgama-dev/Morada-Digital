import React, { useState } from 'react';
import { Lock, KeyRound, Eye, EyeOff, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';

export const AdminPasswordModal: React.FC = () => {
  const { isPasswordModalOpen, setIsPasswordModalOpen, authenticateSystem } = useRealEstate();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isPasswordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = authenticateSystem(password);
    if (!success) {
      setErrorMsg('Senha incorreta. Verifique suas credenciais.');
    } else {
      setPassword('');
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 font-sans relative">
        
        {/* Close button */}
        <button
          onClick={() => {
            setIsPasswordModalOpen(false);
            setErrorMsg('');
          }}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1 mb-6">
          <h3 className="text-xl font-bold font-serif text-slate-900">
            Acesso Restrito ao Sistema
          </h3>
          <p className="text-xs text-slate-500">
            Digite a senha de administrador da <strong>Morada Digital</strong> para acessar o painel de CRM, gestão de imóveis e contratos.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Senha de Acesso:
            </label>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Digite a senha..."
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-10 py-3 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-bold mt-1.5 flex items-center gap-1">
                <span>✕</span> {errorMsg}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <span>Desbloquear Sistema</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Autenticação Segura • Morada Digital 2026</span>
        </div>

      </div>
    </div>
  );
};
