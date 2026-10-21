import React, { useState } from 'react';
import { 
  Building2, 
  Link as LinkIcon, 
  Users, 
  Bot, 
  DollarSign, 
  Plus, 
  Search, 
  Globe, 
  Bell, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Key, 
  Mail, 
  Phone, 
  MapPin, 
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { MORADA_BRAND } from '../../data/mockDatabase';

interface UserRecord {
  id: string;
  initial: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Corretor' | 'Gerente' | 'Administrador';
  color: string;
}

export const SettingsManager: React.FC<{ onReturnToSite?: () => void }> = ({ onReturnToSite }) => {
  const { showToast } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'imobiliaria' | 'integracoes' | 'usuarios' | 'ia' | 'financeiro'>('usuarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Corretor' | 'Gerente' | 'Super Admin'>('Corretor');

  // Users List matching user screenshot
  const [userList, setUserList] = useState<UserRecord[]>([
    {
      id: 'u-1',
      initial: 'A',
      name: 'Administrador',
      email: 'admin@moradadigital.com.br',
      role: 'Super Admin',
      color: 'bg-slate-200 text-slate-800'
    },
    {
      id: 'u-2',
      initial: 'J',
      name: 'João Silva',
      email: 'joao@moradadigital.com.br',
      role: 'Corretor',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'u-3',
      initial: 'M',
      name: 'Maria Santos',
      email: 'maria@moradadigital.com.br',
      role: 'Gerente',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'u-4',
      initial: 'R',
      name: 'Rodrigo Mendonça',
      email: 'rodrigo@moradadigital.com.br',
      role: 'Super Admin',
      color: 'bg-teal-100 text-teal-800'
    }
  ]);

  const filteredUsers = userList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const initial = inviteName.trim().charAt(0).toUpperCase();
    const newUser: UserRecord = {
      id: `u-${Date.now()}`,
      initial,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      color: inviteRole === 'Super Admin' ? 'bg-slate-200 text-slate-800' : inviteRole === 'Gerente' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
    };

    setUserList(prev => [...prev, newUser]);
    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    showToast(`Convite enviado com sucesso para ${inviteEmail}!`, 'Usuário Convidado', 'success');
  };

  const getRoleBadge = (role: UserRecord['role']) => {
    switch (role) {
      case 'Super Admin':
        return <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">Super Admin</span>;
      case 'Corretor':
        return <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">Corretor</span>;
      case 'Gerente':
        return <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-600">Gerente</span>;
      default:
        return <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner & Header matching user's uploaded screenshot */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-6 bg-indigo-600 rounded-full" />
              <h1 className="text-2xl font-bold text-slate-900 font-serif">Configurações</h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 ml-4.5">
              Dados da imobiliária, integrações e preferências
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Bar matching screenshot */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border border-transparent pl-9.5 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-400 outline-none"
              />
            </div>

            {/* "Voltar ao Site" Button matching screenshot */}
            {onReturnToSite && (
              <button
                onClick={onReturnToSite}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Voltar ao Site</span>
              </button>
            )}

            {/* Notification Bell with red dot matching screenshot */}
            <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Pill Bar matching user screenshot */}
        <div className="bg-slate-100/80 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200/60 text-xs font-bold">
          
          <button
            onClick={() => setActiveTab('imobiliaria')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'imobiliaria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Imobiliária</span>
          </button>

          <button
            onClick={() => setActiveTab('integracoes')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'integracoes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-slate-500" />
            <span>Integrações</span>
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Usuários</span>
          </button>

          <button
            onClick={() => setActiveTab('ia')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ia'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-slate-500" />
            <span>IA</span>
          </button>

          <button
            onClick={() => setActiveTab('financeiro')}
            className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'financeiro'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-slate-500" />
            <span>Financeiro</span>
          </button>

        </div>
      </div>

      {/* TAB CONTENT 1: USUÁRIOS E PERMISSÕES (exact match to screenshot) */}
      {activeTab === 'usuarios' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-serif">Usuários e Permissões</h2>

            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4" />
              <span>Convidar Usuário</span>
            </button>
          </div>

          {/* User Cards List matching screenshot */}
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className="bg-white p-4.5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  {/* Initial Circle Avatar matching screenshot */}
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-slate-700 font-bold text-sm border border-slate-200/80 ${user.color}`}>
                    {user.initial}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{user.name}</h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div>
                  {getRoleBadge(user.role)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: IMOBILIÁRIA */}
      {activeTab === 'imobiliaria' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Dados Cadastrais da Morada Digital</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Nome Fantasia</span>
              <div className="font-bold text-slate-900 text-sm">{MORADA_BRAND.name}</div>
              <span className="text-slate-500">{MORADA_BRAND.model}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Razão Social & CRECI</span>
              <div className="font-bold text-slate-900 text-sm">{MORADA_BRAND.legalName}</div>
              <span className="text-indigo-600 font-bold">{MORADA_BRAND.creci}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Sede Operacional de Apoio</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{MORADA_BRAND.address}</span>
              </div>
              <span className="text-slate-500">CEP: {MORADA_BRAND.cep} - {MORADA_BRAND.city} / {MORADA_BRAND.state}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Canais Oficiais</span>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: {MORADA_BRAND.phone}</span>
              </div>
              <span className="text-slate-500">E-mail: {MORADA_BRAND.email}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: INTEGRAÇÕES */}
      {activeTab === 'integracoes' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-serif">Integrações de Portais & APIs</h2>
            <p className="text-xs text-slate-500">Sincronização em tempo real de inventário e contatos</p>
          </div>

          <div className="space-y-4">
            
            {/* ZAP Imóveis Card */}
            <div className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center font-bold text-orange-600 text-sm">
                  ZAP
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">ZAP Imóveis / VivaReal (Grupo OLX)</h3>
                  <p className="text-xs text-slate-500">Exportação automática de XML feed e recebimento de leads direto no CRM.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sincronizado
                </span>
                <button 
                  onClick={() => showToast('Feed XML do ZAP Imóveis atualizado com sucesso!', 'ZAP Imóveis', 'success')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Sincronizar Agora
                </button>
              </div>
            </div>

            {/* WhatsApp Business API Card */}
            <div className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center font-bold text-emerald-600 text-sm">
                  WA
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">WhatsApp Business Cloud API</h3>
                  <p className="text-xs text-slate-500">Conectado ao canal oficial ({MORADA_BRAND.phone}) para disparo de termos e propostas.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Conectado
              </span>
            </div>

            {/* Electronic Signatures Card */}
            <div className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 text-sm">
                  SIGN
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Assinatura Eletrônica (ZapSign / DocuSign)</h3>
                  <p className="text-xs text-slate-500">Validade jurídica plena garantida pela Lei Federal nº 14.063/2020.</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
              </span>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT 4: IA CONFIG */}
      {activeTab === 'ia' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">Configurações de Inteligência Artificial</h2>
              <p className="text-xs text-slate-500">Parâmetros do modelo Gemini 3.8 Flash e do AI Advisor</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              Gemini 3.8 Flash Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                <Bot className="w-4 h-4 text-indigo-600" />
                <span>AI Advisor de Leads & Corretores</span>
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Analisa o perfil comportamental de cada comprador (DISC), sugere o tom de voz ideal para o corretor e propõe próximos passos no CRM.
              </p>
              <div className="text-[10px] text-emerald-700 font-bold">● Habilitado para toda a equipe</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Consultor Jurídico de Contratos</span>
              </span>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Treinado na Lei do Inquilinato (Lei nº 8.245/91), Código Civil e Lei do Distrato para responder prontamente aos corretores.
              </p>
              <div className="text-[10px] text-emerald-700 font-bold">● Habilitado para toda a equipe</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: FINANCEIRO */}
      {activeTab === 'financeiro' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Regras de Comissão e Dados Bancários</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Comissão Padrão Venda</span>
              <div className="font-bold text-slate-900 text-lg">6,0%</div>
              <span className="text-slate-500">3% Imobiliária / 3% Corretores</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Taxa de Adm. Locação</span>
              <div className="font-bold text-slate-900 text-lg">8% a 10%</div>
              <span className="text-slate-500">Descontado do repasse mensal</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Chave Pix Institucional</span>
              <div className="font-bold text-slate-900 text-xs font-mono">financeiro@moradadigital.com.br</div>
              <span className="text-emerald-600 font-bold">Conta Escrow Habilitada</span>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Convidar Novo Usuário</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silveira"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Corporativo</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@moradadigital.com.br"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Perfil de Acesso</label>
                <select
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="Corretor">Corretor</option>
                  <option value="Gerente">Gerente</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md"
                >
                  Enviar Convite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
