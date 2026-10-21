import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Building, 
  FileText, 
  Users, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { DashboardExecutive } from './DashboardExecutive';
import { LeadsKanban } from './LeadsKanban';
import { PropertiesManager } from './PropertiesManager';
import { ProposalsManager } from './ProposalsManager';
import { TeamManager } from './TeamManager';
import { LeadDetailModal } from './LeadDetailModal';
import { SHALOM_BRAND } from '../../data/mockDatabase';

export const AdminLayout: React.FC = () => {
  const { 
    adminTab, 
    setAdminTab, 
    setCurrentView, 
    currentUser, 
    setCurrentUser, 
    team,
    selectedLead,
    setSelectedLead,
    resetToInitialDemo
  } = useRealEstate();

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard Executivo', icon: BarChart3 },
    { id: 'kanban' as const, label: 'Funil de Vendas (Kanban)', icon: Layers },
    { id: 'properties' as const, label: 'Catálogo de Imóveis', icon: Building },
    { id: 'proposals' as const, label: 'Propostas & Contratos', icon: FileText },
    { id: 'team' as const, label: 'Equipe & Corretores', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 pb-16">
      
      {/* Admin Subheader / Role Context Bar */}
      <div className="bg-slate-950 text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-md border border-slate-700">
            MD
          </div>
          <div>
            <h1 className="font-bold font-serif text-base text-white flex items-center gap-2">
              Morada Digital CRM & Controle Total
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-sans">
                v2.0 Master
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Intermediação imobiliária inteligente • Gestão de estoque, propostas e leads com SLA
            </p>
          </div>
        </div>

        {/* User Role Switcher & Public Portal Shortcut */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-slate-400">Simular Papel:</span>
            <select
              value={currentUser.id}
              onChange={e => {
                const user = team.find(u => u.id === e.target.value);
                if (user) setCurrentUser(user);
              }}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer text-xs"
            >
              {team.map(u => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCurrentView('public')}
            className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Portal Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={resetToInitialDemo}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Restaurar dados iniciais da demonstração"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = adminTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setAdminTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content View Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {adminTab === 'dashboard' && <DashboardExecutive />}
        {adminTab === 'kanban' && <LeadsKanban />}
        {adminTab === 'properties' && <PropertiesManager />}
        {adminTab === 'proposals' && <ProposalsManager />}
        {adminTab === 'team' && <TeamManager />}
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </div>
  );
};
