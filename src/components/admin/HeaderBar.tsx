import React, { useState } from 'react';
import { 
  Plus, 
  RotateCcw, 
  MessageCircle, 
  Search, 
  Bell, 
  User as UserIcon,
  MapPin,
  CheckCircle,
  Building2,
  Users,
  Target,
  Key,
  FileText,
  FilePenLine,
  ChevronDown,
  Globe,
  LogOut,
  Camera
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { UserAvatarUpload } from '../common/UserAvatarUpload';

export const HeaderBar: React.FC<{ onReturnToSite?: () => void }> = ({ onReturnToSite }) => {
  const { 
    activeModule, 
    setActiveModule, 
    currentUser, 
    setCurrentUser, 
    team, 
    updateBroker,
    resetToInitialDemo,
    visitas,
    leads,
    logoutSystem,
    showToast
  } = useRealEstate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const titles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { 
      title: 'Dashboard Operacional', 
      subtitle: 'Visão executiva em tempo real: VGV, visitas, contratos e performance' 
    },
    imoveis: { 
      title: 'Gestão de Imóveis', 
      subtitle: 'Inventário completo, valores de venda/locação, fotos e sincronização' 
    },
    clientes: { 
      title: 'Base de Clientes', 
      subtitle: 'Compradores, proprietários, locatários e investidores com perfil completo' 
    },
    corretores: { 
      title: 'Gestão de Corretores & Credenciamento CRECI', 
      subtitle: 'Cadastro profissional, número de CRECI, controle de comissões, metas de VGV e repasses Pix' 
    },
    leads: { 
      title: 'Funil de Vendas & Leads', 
      subtitle: 'Pipeline Kanban comercial, temperatura dos leads e SLA de atendimento' 
    },
    agenda: { 
      title: 'Agenda de Compromissos', 
      subtitle: 'Calendário de vistorias, visitas, reuniões e assinaturas de contratos' 
    },
    visitas: { 
      title: 'Gestão de Visitas a Imóveis', 
      subtitle: 'Agendamentos, controle de chaves na portaria/sede, termos digitais e feedbacks' 
    },
    propostas: { 
      title: 'Propostas Comerciais', 
      subtitle: 'Negociações em curso, contrapropostas e comissões calculadas automaticamente' 
    },
    contratos: { 
      title: 'Contratos Imobiliários & Modelos Jurídicos', 
      subtitle: 'Minutas atualizadas de Compra, Venda e Locação (Lei 8.245/91 e Código Civil)' 
    },
    locacoes: { 
      title: 'Gestão de Locações Ativas', 
      subtitle: 'Controle mensal de aluguéis, repasses aos proprietários e taxa de administração' 
    },
    comissoes: { 
      title: 'Controle de Comissões', 
      subtitle: 'Divisão de honorários por corretor captador, vendedor e imobiliária' 
    },
    financeiro: { 
      title: 'Financeiro & Fluxo de Caixa', 
      subtitle: 'Receitas de comissões, taxas de locação, custos operacionais e DRE' 
    },
    marketing: { 
      title: 'Marketing Digital & Campanhas', 
      subtitle: 'Meta Ads, Google Ads, portais ZAP/VivaReal e gerador de criativos para WhatsApp' 
    }
  };

  const currentInfo = titles[activeModule] || { title: 'Morada Digital', subtitle: 'Plataforma Imobiliária' };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      
      {/* Upper Info Strip */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-1.5 flex flex-wrap items-center justify-between text-xs font-sans border-b border-slate-800">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-teal-400" />
            <strong className="text-white">Sede Operacional:</strong> {MORADA_BRAND.address} • CEP: {MORADA_BRAND.cep}
          </span>
          <span className="hidden md:inline-block text-slate-400">|</span>
          <span className="hidden md:inline-block text-teal-300 font-medium">
            Imobiliária 100% Digital • Lançamento 2026
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`https://wa.me/${MORADA_BRAND.phoneClean}?text=Ol%C3%A1%2C%20atendimento%20Morada%20Digital`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Direto: {MORADA_BRAND.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Module Title */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
            {currentInfo.title}
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            {currentInfo.subtitle}
          </p>
        </div>

        {/* Action Controls & User Simulation */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Quick Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Registro</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>

            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Criar Novo
                </div>
                <button
                  onClick={() => setActiveModule('visitas')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Key className="w-4 h-4 text-indigo-600" />
                  <div>
                    <span className="font-semibold block">Agendar Visita</span>
                    <span className="text-[10px] text-slate-400">Com chave e termo digital</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveModule('leads')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Target className="w-4 h-4 text-teal-600" />
                  <div>
                    <span className="font-semibold block">Cadastrar Lead</span>
                    <span className="text-[10px] text-slate-400">Entrada no funil comercial</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveModule('imoveis')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="font-semibold block">Cadastrar Imóvel</span>
                    <span className="text-[10px] text-slate-400">Venda, Locação ou Lançamento</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveModule('propostas')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <div>
                    <span className="font-semibold block">Nova Proposta</span>
                    <span className="text-[10px] text-slate-400">Compra ou locação formal</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveModule('contratos')}
                  className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FilePenLine className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-semibold block">Emitir Contrato</span>
                    <span className="text-[10px] text-slate-400">Modelo jurídico atualizado</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Voltar ao Site Button (matches user screenshot) */}
          {onReturnToSite && (
            <button
              onClick={onReturnToSite}
              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Retornar para o Portal Público da Morada Digital"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Voltar ao Site</span>
            </button>
          )}

          {/* User Role Simulation Switcher with Avatar */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 pl-1.5 pr-3 py-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-300 bg-white shadow-xs cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all"
              title="Clique para alterar a foto real de perfil"
            >
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-900 text-white font-bold text-[10px]">
                  {currentUser.name.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </button>
            <span className="text-slate-500 font-medium hidden sm:inline">Usuário:</span>
            <select
              value={currentUser.id}
              onChange={e => {
                const user = team.find(u => u.id === e.target.value);
                if (user) {
                  setCurrentUser(user);
                  showToast(`Você agora está simulando: ${user.name} (${user.role.toUpperCase()})`, 'Perfil', 'info');
                }
              }}
              className="bg-transparent text-slate-900 font-bold outline-none cursor-pointer text-xs"
            >
              {team.map(u => (
                <option key={u.id} value={u.id} className="text-slate-900 bg-white">
                  {u.name} ({u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Demo Button */}
          <button
            onClick={resetToInitialDemo}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Restaurar dados padrão de demonstração"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Logout Lock Button */}
          <button
            onClick={logoutSystem}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Bloquear sistema / Encerrar sessão"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* MODAL: ALTERAR FOTO REAL DO USUÁRIO LOGADO */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>Alterar Foto Real ({currentUser.name})</span>
              </h3>
              <button 
                onClick={() => setIsAvatarModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <UserAvatarUpload
                currentAvatar={currentUser.avatar || ''}
                userName={currentUser.name}
                userRole={currentUser.role === 'admin' ? 'Super Admin / Diretor' : currentUser.role}
                onAvatarChange={(newAvatar) => {
                  updateBroker(currentUser.id, { avatar: newAvatar });
                }}
                size="lg"
              />

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(false)}
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs cursor-pointer shadow-md"
                >
                  Concluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
};
