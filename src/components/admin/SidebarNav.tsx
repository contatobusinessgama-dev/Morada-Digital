import React from 'react';
import { 
  LayoutGrid, 
  Building2, 
  Users, 
  Target, 
  Calendar, 
  Key, 
  FileText, 
  FilePenLine, 
  Building, 
  Wallet, 
  DollarSign, 
  Megaphone,
  Settings,
  MapPin,
  Phone,
  Sparkles,
  UserCheck,
  GraduationCap,
  Globe,
  Calculator
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { SidebarModule } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { MoradaLogo } from '../common/MoradaLogo';

interface NavItem {
  id: SidebarModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const SidebarNav: React.FC = () => {
  const { activeModule, setActiveModule, visitas, leads, propostas, locacoes, contratos, setCurrentView, team } = useRealEstate();

  // Active counts for badges
  const pendingVisitsCount = visitas.filter(v => v.status === 'agendada' || v.status === 'confirmada').length;
  const newLeadsCount = leads.filter(l => l.stage === 'novo').length;
  const activeRentalsCount = locacoes.length;
  const activeBrokersCount = team.filter(u => u.status === 'ativo' || !u.status).length;

  const sections: NavSection[] = [
    {
      title: 'OPERACIONAL',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
        { id: 'imoveis', label: 'Imóveis', icon: Building2 },
        { id: 'clientes', label: 'Clientes', icon: Users },
        { id: 'corretores', label: 'Corretores', icon: UserCheck, badge: activeBrokersCount },
      ]
    },
    {
      title: 'COMERCIAL',
      items: [
        { id: 'leads', label: 'Leads', icon: Target, badge: newLeadsCount > 0 ? newLeadsCount : undefined },
        { id: 'agenda', label: 'Agenda', icon: Calendar },
        { id: 'visitas', label: 'Visitas', icon: Key, badge: pendingVisitsCount > 0 ? pendingVisitsCount : undefined },
        { id: 'propostas', label: 'Propostas', icon: FileText },
        { id: 'contratos', label: 'Contratos', icon: FilePenLine },
        { id: 'locacoes', label: 'Locações', icon: Building, badge: activeRentalsCount > 0 ? activeRentalsCount : undefined },
      ]
    },
    {
      title: 'FINANCEIRO',
      items: [
        { id: 'comissoes', label: 'Comissões', icon: Wallet },
        { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
      ]
    },
    {
      title: 'SISTEMA',
      items: [
        { id: 'marketing', label: 'Marketing', icon: Megaphone },
        { id: 'proptech_tools', label: 'Calculadoras & Garantias', icon: Calculator, badge: 'Inovação' },
        { id: 'treinamento', label: 'Treinamento & IA', icon: GraduationCap },
        { id: 'configuracoes', label: 'Configurações', icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0a101f] text-slate-300 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-screen select-none font-sans">
      
      {/* Brand Header */}
      <div>
        <div className="px-5 py-4 border-b border-slate-800/80">
          <MoradaLogo variant="light" size="sm" showTagline={false} />
          <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center gap-1.5 pl-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% Digital • Lançamento 2026</span>
          </div>
        </div>

        {/* Menu Navigation Sections (matches user's screenshot exactly) */}
        <nav className="p-3 space-y-5">
          {sections.map(section => (
            <div key={section.title}>
              {/* Section Header: e.g. OPERACIONAL, COMERCIAL, FINANCEIRO, SISTEMA */}
              <div className="px-3 pb-1.5 text-[11px] font-bold text-slate-400 tracking-wider">
                {section.title}
              </div>

              {/* Section Items */}
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveModule(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#5145cd] text-white shadow-md font-semibold'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Voltar ao Site Público Button */}
      <div className="px-3 pt-2">
        <button
          onClick={() => setCurrentView('public')}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
          title="Retornar para a Página Inicial / Site Público"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>Voltar ao Site Público</span>
        </button>
      </div>

      {/* Sede Operacional & Contato Oficial Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
          <span className="leading-tight text-slate-300">
            {MORADA_BRAND.address}
            <br />
            <span className="text-slate-400">CEP: {MORADA_BRAND.cep}</span>
          </span>
        </div>

        <div className="pt-1 border-t border-slate-800/50 space-y-1">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <a href="tel:3133573030" className="text-slate-300 hover:text-white font-bold transition-colors">
              Fixo: (31) 3357-3030
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <a
              href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20atendimento%20Morada%20Digital`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
            >
              WhatsApp: (31) 98427-9865
            </a>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 pt-1">
          {MORADA_BRAND.creci}
        </div>
      </div>

    </aside>
  );
};
