import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Award, 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Phone, 
  Mail, 
  MapPin, 
  Copy, 
  Check, 
  Edit3, 
  Eye, 
  Wallet, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Search, 
  Sparkles,
  QrCode,
  Building,
  ArrowUpRight,
  X,
  UploadCloud,
  BadgeCheck,
  Camera
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { User, Comissao } from '../../types';
import { UserAvatarUpload } from '../common/UserAvatarUpload';

export const BrokersManager: React.FC = () => {
  const { team, addBroker, updateBroker, comissoes, updateComissaoStatus, showToast } = useRealEstate();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'ferias' | 'inativo'>('todos');
  
  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingBroker, setEditingBroker] = useState<User | null>(null);
  const [statementBroker, setStatementBroker] = useState<User | null>(null);
  const [copiedPixId, setCopiedPixId] = useState<string | null>(null);

  // New Broker Form State
  const [name, setName] = useState('');
  const [creci, setCreci] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('(31) 9');
  const [pixKey, setPixKey] = useState('');
  const [pixKeyType, setPixKeyType] = useState<User['pixKeyType']>('cpf');
  const [commissionRate, setCommissionRate] = useState(45);
  const [rentalCommissionRate, setRentalCommissionRate] = useState(50);
  const [salesGoal, setSalesGoal] = useState(5000000);
  const [status, setStatus] = useState<'ativo' | 'ferias' | 'inativo'>('ativo');
  const [city, setCity] = useState('Contagem - MG');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80');
  const [specialtiesText, setSpecialtiesText] = useState('Alto Padrão, Contagem e Região, Locações');

  // Filter team
  const brokers = team.filter(b => {
    const matchesSearch = 
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.creci && b.creci.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'todos' || b.status === statusFilter || (!b.status && statusFilter === 'ativo');
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalBrokers = team.filter(u => u.role === 'corretor' || u.role === 'admin').length;
  const activeBrokers = team.filter(u => u.status === 'ativo' || !u.status).length;
  const totalTeamVGV = team.reduce((acc, curr) => acc + (curr.salesMonthVGV || 0), 0);
  const totalPaidCommissions = team.reduce((acc, curr) => acc + (curr.paidCommissions || 0), 0);
  const totalPendingCommissions = team.reduce((acc, curr) => acc + (curr.pendingCommissions || 0), 0);

  const handleCopyPix = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedPixId(id);
    showToast(`Chave Pix ${key} copiada com sucesso!`, 'Pix Copiado', 'crm');
    setTimeout(() => setCopiedPixId(null), 3000);
  };

  const handleRegisterBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !creci) {
      showToast('Nome completo e Número do CRECI são obrigatórios.', 'Validação', 'info');
      return;
    }

    const cleanCreci = creci.toUpperCase().startsWith('CRECI') ? creci.toUpperCase() : `CRECI ${creci.toUpperCase()}`;

    addBroker({
      name,
      email,
      phone,
      creci: cleanCreci,
      role: 'corretor',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      cpf,
      pixKey: pixKey || cpf || email,
      pixKeyType,
      commissionRate: Number(commissionRate) || 45,
      rentalCommissionRate: Number(rentalCommissionRate) || 50,
      salesGoal: Number(salesGoal) || 5000000,
      salesMonthVGV: 0,
      activeLeadsCount: 0,
      status,
      joinedDate: new Date().toLocaleDateString('pt-BR'),
      city,
      specialties: specialtiesText.split(',').map(s => s.trim()).filter(Boolean),
      totalSalesVGV: 0,
      paidCommissions: 0,
      pendingCommissions: 0
    });

    setIsRegisterModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setCreci('');
    setCpf('');
    setEmail('');
    setPhone('(31) 9');
    setPixKey('');
    setCommissionRate(45);
    setRentalCommissionRate(50);
    setSalesGoal(5000000);
    setSpecialtiesText('Alto Padrão, Contagem e Região');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBroker) return;

    updateBroker(editingBroker.id, {
      name: editingBroker.name,
      creci: editingBroker.creci,
      cpf: editingBroker.cpf,
      email: editingBroker.email,
      phone: editingBroker.phone,
      avatar: editingBroker.avatar,
      pixKey: editingBroker.pixKey,
      pixKeyType: editingBroker.pixKeyType,
      commissionRate: Number(editingBroker.commissionRate),
      rentalCommissionRate: Number(editingBroker.rentalCommissionRate),
      salesGoal: Number(editingBroker.salesGoal),
      status: editingBroker.status,
      city: editingBroker.city,
      specialties: editingBroker.specialties
    });

    setEditingBroker(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Get Broker's specific commissions
  const getBrokerCommissions = (brokerId: string): Comissao[] => {
    return comissoes.filter(c => c.brokerId === brokerId);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Corretores Cadastrados */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Corretores Credenciados
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-display">
              {totalBrokers} <span className="text-xs font-normal text-slate-500">({activeBrokers} ativos)</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% com CRECI Verificado</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2545] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: VGV do Mês Equipe */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              VGV Produzido no Mês
            </span>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-display">
              {formatCurrency(totalTeamVGV)}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Meta Global: R$ 45.000.000</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Comissões Repassadas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Comissões Já Repassadas
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1 font-display">
              {formatCurrency(totalPaidCommissions)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Liquidado via Pix</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Repasses Pendentes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Repasses Pendentes (Pix)
            </span>
            <div className="text-2xl font-bold text-amber-700 mt-1 font-display">
              {formatCurrency(totalPendingCommissions)}
            </div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Aguardando escritura / chaves</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, CRECI, telefone ou e-mail..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Apenas Ativos</option>
            <option value="ferias">Em Férias</option>
            <option value="inativo">Inativos</option>
          </select>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Corretor (CRECI)</span>
        </button>
      </div>

      {/* Brokers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {brokers.map(broker => {
          const goalPercentage = broker.salesGoal && broker.salesGoal > 0 
            ? Math.min(100, Math.round(((broker.salesMonthVGV || 0) / broker.salesGoal) * 100))
            : 0;

          const brokerCommissionsList = getBrokerCommissions(broker.id);

          return (
            <div 
              key={broker.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header Profile */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => setEditingBroker(broker)}
                      className="relative group cursor-pointer"
                      title="Clique para editar dados e foto real do corretor"
                    >
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs bg-slate-100 group-hover:ring-2 group-hover:ring-[#0B2545] transition-all">
                        <img
                          src={broker.avatar}
                          alt={broker.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-slate-950/50 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                          <Camera className="w-4 h-4" />
                        </div>
                      </div>
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white z-10 ${
                        broker.status === 'ativo' || !broker.status ? 'bg-emerald-500' : broker.status === 'ferias' ? 'bg-amber-500' : 'bg-slate-400'
                      }`} title={`Status: ${broker.status || 'ativo'}`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {broker.name}
                        </h4>
                        <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" title="CRECI Homologado" />
                      </div>
                      
                      {/* CRECI Badge */}
                      <div className="mt-0.5 inline-flex items-center gap-1 bg-blue-50 text-[#0B2545] font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>{broker.creci || 'CRECI Sob Consulta'}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{broker.city || 'Contagem / BH - MG'}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    broker.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {broker.role === 'admin' ? 'Diretoria' : 'Corretor'}
                  </span>
                </div>

                {/* Specialties tags */}
                {broker.specialties && broker.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {broker.specialties.map((spec, i) => (
                      <span key={i} className="text-[9.5px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}

                {/* Commission Split & Pix Info */}
                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5 text-[#0B2545]" />
                      <span>Comissão Venda:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {broker.commissionRate || 45}% do honorário
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-[#0B2545]" />
                      <span>Comissão Locação:</span>
                    </span>
                    <span className="font-bold text-slate-900 font-mono">
                      {broker.rentalCommissionRate || 50}% do 1º aluguel
                    </span>
                  </div>

                  {broker.pixKey && (
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 text-xs">
                      <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                        <QrCode className="w-3.5 h-3.5 text-teal-700" />
                        <span>Chave Pix:</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-700 truncate max-w-[130px]" title={broker.pixKey}>
                          {broker.pixKey}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyPix(broker.pixKey!, broker.id)}
                          className="text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Copiar Chave Pix"
                        >
                          {copiedPixId === broker.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sales Goal Progress */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 text-[11px] font-semibold">Meta de VGV Mensal</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px]">
                      {formatCurrency(broker.salesMonthVGV || 0)} / {formatCurrency(broker.salesGoal || 5000000)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all rounded-full ${
                        goalPercentage >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${goalPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{goalPercentage}% atingido</span>
                    <span>{broker.activeLeadsCount || 0} leads em atendimento</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`https://wa.me/55${broker.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(broker.name)},%20contato%20da%20Diretoria%20Morada%20Digital`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStatementBroker(broker)}
                    className="p-1.5 text-slate-600 hover:text-[#0B2545] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Ver Extrato de Comissões e Repasses"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingBroker({ ...broker })}
                    className="p-1.5 text-slate-600 hover:text-[#0B2545] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Editar Cadastro & Comissões"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: CADASTRAR NOVO CORRETOR                               */}
      {/* ============================================================== */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Cadastrar Novo Corretor</h3>
                <p className="text-xs text-slate-500">Credenciamento oficial com CRECI, chave Pix e regras de comissão</p>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleRegisterBroker} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo do Corretor *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ex: Matheus Guimarães Silva"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número do CRECI (com Região) *</label>
                  <input
                    type="text"
                    required
                    value={creci}
                    onChange={e => setCreci(e.target.value)}
                    placeholder="Ex: CRECI 248.910-F/MG"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-[#0B2545] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF do Corretor</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={e => setCpf(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="(31) 98427-9865"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="corretor@moradadigital.com.br"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Finance / Commissions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-[#0B2545]" />
                  <span>Controle de Comissão & Repasse Pix</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Comissão Venda (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={commissionRate}
                        onChange={e => setCommissionRate(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Padrão imobiliária: 40% a 50%</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Comissão Locação (%)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={rentalCommissionRate}
                        onChange={e => setRentalCommissionRate(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                      />
                      <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">%</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Sobre o 1º mês de aluguel</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Meta VGV Mensal (R$)</label>
                    <input
                      type="number"
                      step="100000"
                      value={salesGoal}
                      onChange={e => setSalesGoal(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chave Pix para Pagamento</label>
                    <input
                      type="text"
                      value={pixKey}
                      onChange={e => setPixKey(e.target.value)}
                      placeholder="Chave Pix (CPF, e-mail, celular ou aleatória)"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo de Chave Pix</label>
                    <select
                      value={pixKeyType}
                      onChange={e => setPixKeyType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                    >
                      <option value="cpf">CPF</option>
                      <option value="email">E-mail</option>
                      <option value="telefone">Celular</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="aleatoria">Chave Aleatória (EVP)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Região / Cidade de Atuação</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Contagem / Belo Horizonte - MG"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Especialidades (separadas por vírgula)</label>
                  <input
                    type="text"
                    value={specialtiesText}
                    onChange={e => setSpecialtiesText(e.target.value)}
                    placeholder="Alto Padrão, Condomínios, Bairro Arvoredo"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Foto de Perfil Real do Corretor</label>
                <UserAvatarUpload
                  currentAvatar={avatar}
                  userName={name || 'Novo Corretor'}
                  userRole="Corretor"
                  onAvatarChange={(newUrl) => setAvatar(newUrl)}
                  size="md"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-5 py-2 text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
                >
                  Confirmar Cadastro do Corretor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDITAR CORRETOR                                       */}
      {/* ============================================================== */}
      {editingBroker && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Editar Dados do Corretor</h3>
                <p className="text-xs text-slate-500">{editingBroker.name} • {editingBroker.creci}</p>
              </div>
              <button onClick={() => setEditingBroker(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Foto de Perfil Real</label>
                <UserAvatarUpload
                  currentAvatar={editingBroker.avatar || ''}
                  userName={editingBroker.name}
                  userRole={editingBroker.role === 'admin' ? 'Diretoria' : 'Corretor'}
                  onAvatarChange={(newUrl) => setEditingBroker({ ...editingBroker, avatar: newUrl })}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nome</label>
                  <input
                    type="text"
                    required
                    value={editingBroker.name}
                    onChange={e => setEditingBroker({ ...editingBroker, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Número do CRECI</label>
                  <input
                    type="text"
                    required
                    value={editingBroker.creci || ''}
                    onChange={e => setEditingBroker({ ...editingBroker, creci: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingBroker.status || 'ativo'}
                    onChange={e => setEditingBroker({ ...editingBroker, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="ferias">Em Férias</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={editingBroker.phone}
                    onChange={e => setEditingBroker({ ...editingBroker, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CPF</label>
                  <input
                    type="text"
                    value={editingBroker.cpf || ''}
                    onChange={e => setEditingBroker({ ...editingBroker, cpf: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Commissions */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900">Regras de Comissão e Pagamentos Pix</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Comissão Vendas (%)</label>
                    <input
                      type="number"
                      value={editingBroker.commissionRate || 45}
                      onChange={e => setEditingBroker({ ...editingBroker, commissionRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Comissão Locação (%)</label>
                    <input
                      type="number"
                      value={editingBroker.rentalCommissionRate || 50}
                      onChange={e => setEditingBroker({ ...editingBroker, rentalCommissionRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Meta VGV (R$)</label>
                    <input
                      type="number"
                      step="100000"
                      value={editingBroker.salesGoal || 5000000}
                      onChange={e => setEditingBroker({ ...editingBroker, salesGoal: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Chave Pix Cadastrada</label>
                  <input
                    type="text"
                    value={editingBroker.pixKey || ''}
                    onChange={e => setEditingBroker({ ...editingBroker, pixKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBroker(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#0B2545] hover:bg-[#0f2e59] text-white px-5 py-2 text-xs font-bold rounded-xl shadow cursor-pointer transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: EXTRATO DE COMISSÕES E REPASSES PIX DO CORRETOR       */}
      {/* ============================================================== */}
      {statementBroker && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={statementBroker.avatar}
                  alt=""
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Extrato de Comissões & Repasses
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-800">{statementBroker.name}</span>
                    <span>•</span>
                    <span className="font-mono text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded font-semibold">{statementBroker.creci}</span>
                    <span>•</span>
                    <span>Chave Pix: {statementBroker.pixKey || 'Não cadastrada'}</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setStatementBroker(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {/* Commissions Table for this broker */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Total VGV Histórico</span>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {formatCurrency(statementBroker.totalSalesVGV || 0)}
                  </div>
                </div>

                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Comissões Recebidas (Pix)</span>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {formatCurrency(statementBroker.paidCommissions || 0)}
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Repasse Pendente</span>
                  <div className="text-base font-bold text-amber-700 mt-0.5">
                    {formatCurrency(statementBroker.pendingCommissions || 0)}
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                Histórico de Negócios & Honorários
              </h4>

              {getBrokerCommissions(statementBroker.id).length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Nenhum contrato formalizado com divisão de comissão registrado ainda para este corretor.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Conforme novas propostas forem aceitas no módulo Comercial, elas aparecerão aqui automaticamente.</p>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                      <tr>
                        <th className="py-2.5 px-3">Código</th>
                        <th className="py-2.5 px-3">Imóvel</th>
                        <th className="py-2.5 px-3">Valor Negócio</th>
                        <th className="py-2.5 px-3">Parte do Corretor</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getBrokerCommissions(statementBroker.id).map(com => (
                        <tr key={com.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono text-[10px] text-slate-500 font-bold">
                            {com.code}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900 max-w-[180px] truncate">
                            {com.propertyTitle}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold">
                            {formatCurrency(com.totalDealValue)}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                            {formatCurrency(com.brokerShareValue)}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              com.status === 'pago' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : com.status === 'liberado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {com.status === 'pago' ? 'Pago via Pix' : com.status === 'liberado' ? 'Liberado p/ Pix' : 'A Receber'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => setStatementBroker(null)}
                className="bg-slate-900 text-white px-5 py-2 text-xs font-bold rounded-xl"
              >
                Fechar Extrato
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
