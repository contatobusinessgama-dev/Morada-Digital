import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';

export const TeamManager: React.FC = () => {
  const { team, leads } = useRealEstate();
  const [roundRobinActive, setRoundRobinActive] = useState(true);
  const [slaTimeoutMinutes, setSlaTimeoutMinutes] = useState(15);

  const formatShort = (val: number) => {
    if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
    return `R$ ${(val / 1000).toFixed(0)}k`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Automation Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Equipe de Corretores & Distribuição de Leads</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gerenciamento de credenciais CRECI, metas mensais e regras de repasse automático do funil.
          </p>
        </div>

        {/* Round Robin Control */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="roundRobin"
              checked={roundRobinActive}
              onChange={e => setRoundRobinActive(e.target.checked)}
              className="accent-slate-900 w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="roundRobin" className="font-bold text-slate-800 cursor-pointer">
              Distribuição Round-Robin
            </label>
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600">SLA Reatribuição:</span>
            <select
              value={slaTimeoutMinutes}
              onChange={e => setSlaTimeoutMinutes(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800 text-xs"
            >
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member) => {
          const brokerLeads = leads.filter(l => l.assignedBrokerId === member.id);
          const percentGoal = member.salesGoal 
            ? Math.min(100, Math.round(((member.salesMonthVGV || 0) / member.salesGoal) * 100))
            : 100;

          return (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                    <span className="text-[11px] font-mono text-slate-500 block">{member.creci || 'Diretoria'}</span>
                  </div>
                </div>

                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  member.role === 'admin'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {member.role}
                </span>
              </div>

              {/* Contact info */}
              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Leads Ativos na Carteira:</span>
                  <span className="font-bold text-slate-900">{brokerLeads.length} leads</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">VGV Concretizado (Mês):</span>
                  <span className="font-bold text-emerald-600">{formatShort(member.salesMonthVGV || 0)}</span>
                </div>

                {member.salesGoal && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Meta: {formatShort(member.salesGoal)}</span>
                      <span className="font-bold text-slate-800">{percentGoal}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percentGoal}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Status pill */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Disponível no Plantão
                </span>
                <span className="text-[11px] text-slate-400">Atendimento Ativo</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
