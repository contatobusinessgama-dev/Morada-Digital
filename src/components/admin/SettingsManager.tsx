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
  ExternalLink,
  Edit3,
  Trash2,
  Check,
  RotateCcw,
  Sliders,
  Lock,
  Landmark,
  Camera
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  User, 
  UserPermissions, 
  UserRole,
  DEFAULT_ADMIN_PERMISSIONS, 
  DEFAULT_GERENTE_PERMISSIONS, 
  DEFAULT_CORRETOR_PERMISSIONS 
} from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { MoradaLogo } from '../common/MoradaLogo';
import { UserAvatarUpload } from '../common/UserAvatarUpload';

export const SettingsManager: React.FC<{ onReturnToSite?: () => void }> = ({ onReturnToSite }) => {
  const { 
    team, 
    addBroker, 
    updateBroker, 
    deleteBroker,
    financialSettings,
    updateFinancialSettings,
    socialMediaConfig,
    updateSocialMediaConfig,
    showToast 
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'imobiliaria' | 'integracoes' | 'usuarios' | 'ia' | 'financeiro'>('usuarios');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMatrix, setShowMatrix] = useState(false);

  // Modal: Convidar / Cadastrar Novo Usuário
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('(31) 3357-3030');
  const [inviteRole, setInviteRole] = useState<UserRole>('corretor');
  const [inviteCreci, setInviteCreci] = useState('');
  const [inviteCpf, setInviteCpf] = useState('');
  const [inviteAvatar, setInviteAvatar] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80');

  // Modal: Editar Usuário
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Modal: Gerenciar Permissões Granulares
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [permissionUser, setPermissionUser] = useState<User | null>(null);
  const [currentPermissions, setCurrentPermissions] = useState<UserPermissions>(DEFAULT_CORRETOR_PERMISSIONS);

  // Financial Settings State
  const [finSettings, setFinSettings] = useState(financialSettings);

  const filteredUsers = team.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.creci && u.creci.toLowerCase().includes(searchTerm.toLowerCase())) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenInvite = () => {
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('(31) 3357-3030');
    setInviteRole('corretor');
    setInviteCreci('');
    setInviteCpf('');
    setInviteAvatar('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80');
    setIsInviteModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const initialPermissions = inviteRole === 'admin' 
      ? DEFAULT_ADMIN_PERMISSIONS 
      : inviteRole === 'gerente' 
      ? DEFAULT_GERENTE_PERMISSIONS 
      : DEFAULT_CORRETOR_PERMISSIONS;

    addBroker({
      name: inviteName,
      email: inviteEmail,
      phone: invitePhone,
      role: inviteRole,
      creci: inviteCreci || undefined,
      cpf: inviteCpf || undefined,
      avatar: inviteAvatar || `https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80`,
      status: 'ativo',
      commissionRate: inviteRole === 'corretor' ? 45 : 100,
      permissions: initialPermissions
    });

    setIsInviteModalOpen(false);
  };

  const handleOpenEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditUserModalOpen(true);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    updateBroker(editingUser.id, editingUser);
    setIsEditUserModalOpen(false);
    setEditingUser(null);
  };

  const handleOpenPermissions = (user: User) => {
    setPermissionUser(user);
    const existingPerms = user.permissions || (
      user.role === 'admin' 
        ? DEFAULT_ADMIN_PERMISSIONS 
        : user.role === 'gerente' 
        ? DEFAULT_GERENTE_PERMISSIONS 
        : DEFAULT_CORRETOR_PERMISSIONS
    );
    setCurrentPermissions({ ...existingPerms });
    setIsPermissionsModalOpen(true);
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    setCurrentPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleApplyPreset = (presetType: 'admin' | 'gerente' | 'corretor') => {
    if (presetType === 'admin') setCurrentPermissions(DEFAULT_ADMIN_PERMISSIONS);
    if (presetType === 'gerente') setCurrentPermissions(DEFAULT_GERENTE_PERMISSIONS);
    if (presetType === 'corretor') setCurrentPermissions(DEFAULT_CORRETOR_PERMISSIONS);
    showToast(`Perfil pré-definido de ${presetType.toUpperCase()} carregado nas chaves.`, 'Permissões', 'info');
  };

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionUser) return;

    updateBroker(permissionUser.id, {
      permissions: currentPermissions
    });

    showToast(`Permissões do usuário ${permissionUser.name} atualizadas com sucesso!`, 'Controle de Acesso', 'success');
    setIsPermissionsModalOpen(false);
    setPermissionUser(null);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) {
      deleteBroker(id);
    }
  };

  const handleSaveFinancialSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialSettings(finSettings);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">Super Admin / Diretor</span>;
      case 'gerente':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">Gerente Comercial</span>;
      case 'corretor':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">Corretor Credenciado</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs font-bold">
        {[
          { id: 'usuarios', label: 'Usuários & Permissões', icon: Users },
          { id: 'imobiliaria', label: 'Dados da Imobiliária', icon: Building2 },
          { id: 'financeiro', label: 'Regras Financeiras & Splits', icon: DollarSign },
          { id: 'integracoes', label: 'Integrações & Portais', icon: LinkIcon },
          { id: 'ia', label: 'Assistente IA & Jurídico', icon: Bot }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: USUÁRIOS E PERMISSÕES (COMPLETO) */}
      {activeTab === 'usuarios' && (
        <div className="space-y-4">
          
          {/* Header Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou CRECI..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowMatrix(!showMatrix)}
                className="px-3.5 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                <span>{showMatrix ? 'Ver Lista de Usuários' : 'Ver Matriz de Perfis'}</span>
              </button>

              <button
                onClick={handleOpenInvite}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Usuário</span>
              </button>
            </div>
          </div>

          {/* Matrix View (if toggled) */}
          {showMatrix ? (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4 overflow-x-auto text-xs">
              <div className="pb-2 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Matriz de Acessos & Perfis do Sistema</h3>
                  <p className="text-slate-500 text-[11px]">Visão comparativa de privilégios entre Super Admin, Gerente e Corretor</p>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                  RBAC Morada Digital
                </span>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-4">Capacidade / Permissão</th>
                    <th className="py-2.5 px-4 text-center">Super Admin (Diretoria)</th>
                    <th className="py-2.5 px-4 text-center">Gerente Comercial</th>
                    <th className="py-2.5 px-4 text-center">Corretor Credenciado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { label: 'Cadastrar Imóveis (até 15 fotos)', admin: true, gerente: true, corretor: true },
                    { label: 'Editar Imóveis e Informações', admin: true, gerente: true, corretor: true },
                    { label: 'Excluir Imóveis do Inventário', admin: true, gerente: false, corretor: false },
                    { label: 'Visualizar Todos os Leads da Agência', admin: true, gerente: true, corretor: false },
                    { label: 'Lançar e Negociar Propostas', admin: true, gerente: true, corretor: true },
                    { label: 'Aprovar Minutas Contratuais', admin: true, gerente: true, corretor: false },
                    { label: 'Agendar e Confirmar Visitas', admin: true, gerente: true, corretor: true },
                    { label: 'Visualizar Fluxo Financeiro da Imobiliária', admin: true, gerente: true, corretor: false },
                    { label: 'Aprovar e Liberar Repasses Pix de Comissões', admin: true, gerente: false, corretor: false },
                    { label: 'Cadastrar e Editar Corretores e Regras', admin: true, gerente: true, corretor: false },
                    { label: 'Gerenciar Usuários, Senhas e Permissões', admin: true, gerente: false, corretor: false },
                    { label: 'Alterar Configurações Gerais do Sistema', admin: true, gerente: false, corretor: false }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{row.label}</td>
                      <td className="py-2.5 px-4 text-center font-bold text-emerald-600">
                        {row.admin ? '✓ Permitido' : '—'}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                        {row.gerente ? '✓ Permitido' : <span className="text-slate-300">Não</span>}
                      </td>
                      <td className="py-2.5 px-4 text-center font-bold text-slate-700">
                        {row.corretor ? '✓ Permitido' : <span className="text-slate-300">Não</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* User List Table matching the design */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Usuário</th>
                      <th className="py-3 px-4">E-mail Corporativo</th>
                      <th className="py-3 px-4">CRECI / CPF</th>
                      <th className="py-3 px-4">Perfil de Acesso</th>
                      <th className="py-3 px-4 text-center">Permissões</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map(user => {
                      const isSuperAdmin = user.id === 'usr-0';
                      const initial = user.name.trim().charAt(0).toUpperCase();

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                          
                          {/* User info */}
                          <td className="py-3.5 px-4 flex items-center gap-3">
                            <div 
                              onClick={() => handleOpenEditUser(user)}
                              className="relative group w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-indigo-700 cursor-pointer shadow-xs hover:ring-2 hover:ring-indigo-500 transition-all"
                              title="Clique para editar usuário e alterar foto real"
                            >
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              ) : (
                                <span>{initial}</span>
                              )}
                              <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                                <Camera className="w-4 h-4" />
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{user.name}</span>
                                {isSuperAdmin && (
                                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                                    Diretor
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 block">{user.phone}</span>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                            {user.email}
                          </td>

                          {/* CRECI / CPF */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-bold text-slate-800 block">{user.creci || 'CRECI Sob Consulta'}</span>
                            {user.cpf && <span className="text-[10px] text-slate-400 block font-mono">CPF: {user.cpf}</span>}
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>

                          {/* Permissions summary badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-center">
                            <button
                              onClick={() => handleOpenPermissions(user)}
                              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-[11px] transition-colors border border-slate-200 hover:border-indigo-200 cursor-pointer inline-flex items-center gap-1"
                              title="Configurar permissões granulares deste usuário"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{isSuperAdmin ? 'Todas Ativas (12/12)' : 'Personalizar'}</span>
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditUser(user)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                title="Editar dados cadastrais do usuário"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {!isSuperAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Excluir usuário"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: DADOS DA IMOBILIÁRIA */}
      {activeTab === 'imobiliaria' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">Dados Cadastrais da Morada Digital</h2>
              <p className="text-xs text-slate-500">Informações jurídicas, sede operacional e registro CRECI</p>
            </div>
            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ● {MORADA_BRAND.statusBadge}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Razão Social</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800">
                  {MORADA_BRAND.legalName}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Registro CRECI Jurídico</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800 font-bold">
                  {MORADA_BRAND.creci}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telefone Fixo Central</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-indigo-700">
                  (31) 3357-3030
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp & Plantão de Vendas</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-bold text-emerald-700">
                  (31) 98427-9865
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sede Operacional Física</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-semibold">
                  {MORADA_BRAND.address}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">CEP</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono">
                  {MORADA_BRAND.cep}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">E-mail Corporativo</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-mono">
                  {MORADA_BRAND.email}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modelo de Negócio</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {MORADA_BRAND.model}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: REGRAS FINANCEIRAS E SPLITS */}
      {activeTab === 'financeiro' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-serif">Regras de Honorários e Dados Bancários</h2>
              <p className="text-xs text-slate-500">Configure comissões padrão, percentual dos corretores e conta institucional</p>
            </div>
          </div>

          <form onSubmit={handleSaveFinancialSettings} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Comissão Venda Total</span>
                <input
                  type="number"
                  step="0.1"
                  value={finSettings.defaultSalesCommissionRate}
                  onChange={e => setFinSettings({ ...finSettings, defaultSalesCommissionRate: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-base"
                />
                <span className="text-[11px] text-slate-500 block">Padrão CRECI-MG: 6%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Parte Imobiliária (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={finSettings.agencySplitPercent}
                  onChange={e => setFinSettings({ ...finSettings, agencySplitPercent: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-indigo-700 font-bold text-base"
                />
                <span className="text-[11px] text-slate-500 block">Retenção da agência</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Parte Corretores (%)</span>
                <input
                  type="number"
                  step="0.1"
                  value={finSettings.brokerSplitPercent}
                  onChange={e => setFinSettings({ ...finSettings, brokerSplitPercent: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-emerald-700 font-bold text-base"
                />
                <span className="text-[11px] text-slate-500 block">Repasse à equipe</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Taxa Admin Locação</span>
                <input
                  type="number"
                  step="0.1"
                  value={finSettings.defaultRentalAdminFeePercent}
                  onChange={e => setFinSettings({ ...finSettings, defaultRentalAdminFeePercent: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-base"
                />
                <span className="text-[11px] text-slate-500 block">Taxa mensal do aluguel</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <span className="font-bold text-slate-800 text-xs block">Dados Bancários para Recebimento de Honorários</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Banco</label>
                  <input
                    type="text"
                    value={finSettings.bankName}
                    onChange={e => setFinSettings({ ...finSettings, bankName: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Agência</label>
                  <input
                    type="text"
                    value={finSettings.agencyNumber}
                    onChange={e => setFinSettings({ ...finSettings, agencyNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Conta Corrente</label>
                  <input
                    type="text"
                    value={finSettings.accountNumber}
                    onChange={e => setFinSettings({ ...finSettings, accountNumber: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chave Pix Institucional</label>
                  <input
                    type="text"
                    value={finSettings.pixKey}
                    onChange={e => setFinSettings({ ...finSettings, pixKey: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-emerald-700 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titular da Conta</label>
                  <input
                    type="text"
                    value={finSettings.accountHolder}
                    onChange={e => setFinSettings({ ...finSettings, accountHolder: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Configurações Financeiras</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB CONTENT 4: INTEGRAÇÕES */}
      {activeTab === 'integracoes' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Integração com Portais Imobiliários</h2>

          <div className="space-y-4 text-xs">
            {[
              { name: 'Grupo ZAP (ZAP Imóveis & VivaReal)', status: 'Conectado', desc: 'Sincronização XML automatizada de anúncios e fotos em alta resolução.' },
              { name: 'OLX Imóveis', status: 'Conectado', desc: 'Envio diário de anúncios qualificados para a região de Contagem e Grande BH.' },
              { name: 'WhatsApp Business API', status: 'Ativo', desc: 'Roteamento instantâneo de novos leads para corretores de plantão.' }
            ].map((p, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <p className="text-slate-500 mt-0.5">{p.desc}</p>
                </div>
                <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold text-[11px]">
                  ● {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: IA E JURÍDICO */}
      {activeTab === 'ia' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Assistente IA Especialista Imobiliário & Jurídico</h2>
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 text-xs">
            <span className="font-bold text-indigo-900 text-sm">Treinado na Legislação Imobiliária Brasileira</span>
            <p className="text-slate-600 leading-relaxed">
              Equipado com a Lei do Inquilinato (Lei nº 8.245/91), Código Civil, Lei do Distrato e diretrizes do CRECI-MG para assessoria ágil em contratos e negociações.
            </p>
            <div className="text-[11px] text-emerald-700 font-bold">● Habilitado e integrado para toda a equipe</div>
          </div>
        </div>
      )}

      {/* MODAL: CONVIDAR / CADASTRAR NOVO USUÁRIO */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Cadastrar Novo Usuário</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Foto de Perfil Real</label>
                <UserAvatarUpload
                  currentAvatar={inviteAvatar}
                  userName={inviteName || 'Novo Usuário'}
                  userRole={inviteRole}
                  onAvatarChange={(newUrl) => setInviteAvatar(newUrl)}
                  size="md"
                />
              </div>

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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    value={invitePhone}
                    onChange={e => setInvitePhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perfil de Acesso</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="corretor">Corretor Credenciado</option>
                    <option value="gerente">Gerente Comercial</option>
                    <option value="admin">Super Admin / Diretor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Número do CRECI</label>
                  <input
                    type="text"
                    placeholder="Ex: CRECI 68.165-F/MG"
                    value={inviteCreci}
                    onChange={e => setInviteCreci(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={inviteCpf}
                    onChange={e => setInviteCpf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
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
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
                >
                  Gravar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR USUÁRIO (TUDO) */}
      {isEditUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Editar Dados do Usuário ({editingUser.name})</span>
              </h3>
              <button onClick={() => setIsEditUserModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Foto de Perfil Real</label>
                <UserAvatarUpload
                  currentAvatar={editingUser.avatar || ''}
                  userName={editingUser.name}
                  userRole={editingUser.role}
                  onAvatarChange={(newUrl) => setEditingUser({ ...editingUser, avatar: newUrl })}
                  size="md"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CRECI</label>
                  <input
                    type="text"
                    value={editingUser.creci || ''}
                    onChange={e => setEditingUser({ ...editingUser, creci: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingUser.cpf || ''}
                    onChange={e => setEditingUser({ ...editingUser, cpf: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perfil</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="admin">Super Admin / Diretor</option>
                    <option value="gerente">Gerente</option>
                    <option value="corretor">Corretor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chave Pix</label>
                  <input
                    type="text"
                    value={editingUser.pixKey || ''}
                    onChange={e => setEditingUser({ ...editingUser, pixKey: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono text-emerald-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Comissão Split (%)</label>
                  <input
                    type="number"
                    value={editingUser.commissionRate || 45}
                    onChange={e => setEditingUser({ ...editingUser, commissionRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingUser.status || 'ativo'}
                    onChange={e => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="ferias">Férias</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cidade / Base</label>
                  <input
                    type="text"
                    value={editingUser.city || 'Contagem - MG'}
                    onChange={e => setEditingUser({ ...editingUser, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biografia / Apresentação</label>
                <textarea
                  rows={2}
                  value={editingUser.bio || ''}
                  onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditUserModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GERENCIAR PERMISSÕES GRANULARES (TODAS) */}
      {isPermissionsModalOpen && permissionUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Permissões de Acesso: {permissionUser.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cargo atual: <strong>{permissionUser.role.toUpperCase()}</strong> • CRECI: {permissionUser.creci || '—'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsPermissionsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-5 pt-3 text-xs">
              
              {/* Presets Quick Apply */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Carregar Perfil Pré-definido:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('admin')}
                    className="p-2 rounded-xl bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-800 font-bold text-[11px] transition-all cursor-pointer text-center"
                  >
                    Diretor / Admin (Todas)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('gerente')}
                    className="p-2 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-purple-800 font-bold text-[11px] transition-all cursor-pointer text-center"
                  >
                    Gerente Comercial
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('corretor')}
                    className="p-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-blue-800 font-bold text-[11px] transition-all cursor-pointer text-center"
                  >
                    Corretor Credenciado
                  </button>
                </div>
              </div>

              {/* Category 1: Imóveis & Inventário */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block text-xs">1. Imóveis & Inventário</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'canCreateProperties', label: 'Cadastrar Imóveis (até 15 fotos)' },
                    { key: 'canEditProperties', label: 'Editar Imóveis' },
                    { key: 'canDeleteProperties', label: 'Excluir Imóveis' }
                  ].map(p => {
                    const active = currentPermissions[p.key as keyof UserPermissions];
                    return (
                      <div
                        key={p.key}
                        onClick={() => handleTogglePermission(p.key as any)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none ${
                          active ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {active && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] leading-tight">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 2: Comercial & Vendas */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block text-xs">2. Comercial, Leads & Vendas</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'canViewAllLeads', label: 'Visualizar Todos os Leads (sem restrição)' },
                    { key: 'canManageProposals', label: 'Criar e Negociar Propostas' },
                    { key: 'canManageContracts', label: 'Aprovar Minutas Contratuais' },
                    { key: 'canScheduleVisits', label: 'Agendar e Confirmar Visitas com Chaves' }
                  ].map(p => {
                    const active = currentPermissions[p.key as keyof UserPermissions];
                    return (
                      <div
                        key={p.key}
                        onClick={() => handleTogglePermission(p.key as any)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none ${
                          active ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {active && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] leading-tight">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 3: Financeiro & Comissões */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block text-xs">3. Financeiro & Comissões</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { key: 'canViewAgencyFinancial', label: 'Visualizar Fluxo de Caixa da Imobiliária' },
                    { key: 'canApproveCommissions', label: 'Liberar e Baixar Pagamentos Pix de Comissões' }
                  ].map(p => {
                    const active = currentPermissions[p.key as keyof UserPermissions];
                    return (
                      <div
                        key={p.key}
                        onClick={() => handleTogglePermission(p.key as any)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none ${
                          active ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {active && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] leading-tight">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category 4: Sistema & Gestão */}
              <div className="space-y-2">
                <span className="font-bold text-slate-900 block text-xs">4. Sistema & Gestão</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'canManageBrokers', label: 'Cadastrar Corretores' },
                    { key: 'canManageUsersAndRoles', label: 'Gerenciar Usuários & Perfis' },
                    { key: 'canManageSettings', label: 'Editar Configurações Gerais' }
                  ].map(p => {
                    const active = currentPermissions[p.key as keyof UserPermissions];
                    return (
                      <div
                        key={p.key}
                        onClick={() => handleTogglePermission(p.key as any)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 select-none ${
                          active ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                          active ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'
                        }`}>
                          {active && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-[11px] leading-tight">{p.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPermissionsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Permissões</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
