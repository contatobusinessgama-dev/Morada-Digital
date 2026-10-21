import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Flame,
  FileText,
  Building,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Lead, LeadStage, LeadOrigin } from '../../types';

const STAGES: { id: LeadStage; title: string; color: string; badgeColor: string; bgHeader: string }[] = [
  { id: 'novo', title: 'Novo Lead', color: 'border-blue-500', badgeColor: 'bg-blue-100 text-blue-900', bgHeader: 'bg-blue-50/80' },
  { id: 'contato_realizado', title: 'Contato Realizado', color: 'border-purple-500', badgeColor: 'bg-purple-100 text-purple-900', bgHeader: 'bg-purple-50/80' },
  { id: 'visita_agendada', title: 'Visita Agendada', color: 'border-amber-500', badgeColor: 'bg-amber-100 text-amber-900', bgHeader: 'bg-amber-50/80' },
  { id: 'proposta_enviada', title: 'Proposta Enviada', color: 'border-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-900', bgHeader: 'bg-emerald-50/80' },
  { id: 'fechado_ganho', title: 'Fechado / Ganho', color: 'border-green-600', badgeColor: 'bg-green-100 text-green-900', bgHeader: 'bg-green-50/80' },
  { id: 'perdido', title: 'Perdido', color: 'border-rose-400', badgeColor: 'bg-rose-100 text-rose-900', bgHeader: 'bg-rose-50/80' }
];

export const LeadsKanban: React.FC = () => {
  const { leads, moveLeadStage, setSelectedLead, team, addLead, currentUser, showToast } = useRealEstate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrokerFilter, setSelectedBrokerFilter] = useState('todos');
  const [selectedOriginFilter, setSelectedOriginFilter] = useState('todos');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  // New Lead Form state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadBudget, setNewLeadBudget] = useState('2500000');
  const [newLeadOrigin, setNewLeadOrigin] = useState<LeadOrigin>('site_direto');
  const [newLeadNotes, setNewLeadNotes] = useState('');

  // Drag and Drop state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<LeadStage | null>(null);

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.phone.includes(searchQuery) ||
                          (lead.propertyOfInterestTitle && lead.propertyOfInterestTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesBroker = selectedBrokerFilter === 'todos' || lead.assignedBrokerId === selectedBrokerFilter;
    const matchesOrigin = selectedOriginFilter === 'todos' || lead.origin === selectedOriginFilter;

    return matchesSearch && matchesBroker && matchesOrigin;
  });

  const getLeadsByStage = (stage: LeadStage) => {
    return filteredLeads.filter(lead => lead.stage === stage);
  };

  const handleDragStart = (leadId: string) => {
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    if (dragOverStage !== stage) {
      setDragOverStage(stage);
    }
  };

  const handleDrop = (stage: LeadStage) => {
    if (draggedLeadId) {
      moveLeadStage(draggedLeadId, stage);
      setDraggedLeadId(null);
      setDragOverStage(null);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) return;

    addLead({
      name: newLeadName,
      email: newLeadEmail,
      phone: newLeadPhone,
      budgetMax: Number(newLeadBudget) || 2000000,
      origin: newLeadOrigin,
      notes: newLeadNotes || 'Lead adicionado manualmente pelo painel.',
      stage: 'novo'
    });

    setIsNewLeadModalOpen(false);
    setNewLeadName('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    setNewLeadNotes('');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getOriginBadge = (origin: LeadOrigin) => {
    switch (origin) {
      case 'portal_zap': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800">ZAP Imóveis</span>;
      case 'portal_vivareal': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800">VivaReal</span>;
      case 'instagram_ads': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-100 text-pink-800">Instagram Ads</span>;
      case 'indicacao': return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Indicação VIP</span>;
      default: return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">Portal Morada</span>;
    }
  };

  const stageOrder: LeadStage[] = ['novo', 'contato_realizado', 'visita_agendada', 'proposta_enviada', 'fechado_ganho', 'perdido'];
  
  const moveNext = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex < 4) {
      moveLeadStage(lead.id, stageOrder[currentIndex + 1]);
    }
  };

  const movePrev = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stageOrder.indexOf(lead.stage);
    if (currentIndex > 0 && currentIndex <= 4) {
      moveLeadStage(lead.id, stageOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar / Filters */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por cliente, telefone..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-medium"
            />
          </div>

          {/* Broker Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Corretor:</span>
            <select
              value={selectedBrokerFilter}
              onChange={e => setSelectedBrokerFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              <option value="todos">Todos os Corretores ({leads.length})</option>
              {team.filter(m => m.role === 'corretor').map(broker => (
                <option key={broker.id} value={broker.id}>{broker.name}</option>
              ))}
            </select>
          </div>

          {/* Origin Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Canal:</span>
            <select
              value={selectedOriginFilter}
              onChange={e => setSelectedOriginFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
            >
              <option value="todos">Todos os Canais</option>
              <option value="site_direto">Portal Morada</option>
              <option value="portal_zap">ZAP Imóveis</option>
              <option value="portal_vivareal">VivaReal</option>
              <option value="instagram_ads">Instagram Ads</option>
              <option value="indicacao">Indicação</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center text-xs text-slate-600 gap-1.5 bg-amber-50/80 border border-amber-200/60 px-3 py-1.5 rounded-xl font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Distribuição Round-Robin Ativa</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsNewLeadModalOpen(true)}
            className="bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Lead</span>
          </motion.button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[680px] overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const stageLeads = getLeadsByStage(stage.id);
          const stageVGV = stageLeads.reduce((acc, l) => acc + (l.budgetMax || 0), 0);
          const isOverThis = dragOverStage === stage.id;

          return (
            <div
              key={stage.id}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={() => handleDrop(stage.id)}
              className={`rounded-3xl border ${stage.color} border-t-4 flex flex-col transition-all min-w-[260px] ${
                isOverThis ? 'bg-amber-50/80 ring-2 ring-amber-400/50' : 'bg-slate-100/70'
              }`}
            >
              {/* Column Header */}
              <div className={`p-4 rounded-t-2xl ${stage.bgHeader} border-b border-slate-200/80`}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-extrabold text-xs text-slate-800 tracking-tight">{stage.title}</h3>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${stage.badgeColor}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
                  <span>Potencial:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(stageVGV)}</span>
                </div>
              </div>

              {/* Cards List */}
              <div className="p-2.5 flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[720px]">
                {stageLeads.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-slate-300/80 rounded-2xl flex items-center justify-center text-center p-3">
                    <p className="text-[11px] text-slate-400 font-medium">Solte o card aqui para atualizar a etapa</p>
                  </div>
                ) : (
                  stageLeads.map(lead => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/90 hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group relative"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        {getOriginBadge(lead.origin)}
                        
                        {lead.score === 'quente' && (
                          <span className="text-[10px] font-extrabold flex items-center gap-0.5 text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md animate-pulse">
                            <Flame className="w-3 h-3 fill-rose-500 text-rose-500" /> Quente
                          </span>
                        )}
                      </div>

                      {/* Client Name & Phone */}
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                        {lead.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono mb-2">{lead.phone}</p>

                      {/* Property Linked if any */}
                      {lead.propertyOfInterestTitle && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 mb-2.5 text-[11px]">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 font-mono">
                            {lead.propertyOfInterestCode || 'Imóvel'}
                          </span>
                          <p className="text-slate-800 font-semibold line-clamp-1">{lead.propertyOfInterestTitle}</p>
                        </div>
                      )}

                      {/* Visit Date indicator */}
                      {lead.stage === 'visita_agendada' && lead.visitDate && (
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 p-2 rounded-xl mb-2 border border-amber-200/50">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>Visita: {new Date(lead.visitDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                        </div>
                      )}

                      {/* Budget */}
                      <div className="flex items-center justify-between text-[11px] border-t border-slate-100 pt-2 mb-2 text-slate-600">
                        <span>Orçamento máx:</span>
                        <span className="font-extrabold text-slate-900">{formatCurrency(lead.budgetMax)}</span>
                      </div>

                      {/* Footer: Broker & Last Contact & Quick Nav */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={lead.assignedBrokerAvatar}
                            alt={lead.assignedBrokerName}
                            className="w-5 h-5 rounded-full object-cover border border-slate-200"
                            title={`Atribuído a: ${lead.assignedBrokerName}`}
                          />
                          <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[85px]">
                            {lead.assignedBrokerName.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quick column mover buttons */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          {lead.stage !== 'novo' && lead.stage !== 'perdido' && (
                            <button
                              onClick={(e) => movePrev(lead, e)}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800"
                              title="Mover para etapa anterior"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {lead.stage !== 'fechado_ganho' && lead.stage !== 'perdido' && (
                            <button
                              onClick={(e) => moveNext(lead, e)}
                              className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-amber-600"
                              title="Avançar etapa no funil"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Lead Manual */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Lead no CRM</h3>
              <button 
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={newLeadName}
                  onChange={e => setNewLeadName(e.target.value)}
                  placeholder="Ex: Dra. Juliana Matos"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newLeadPhone}
                    onChange={e => setNewLeadPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    value={newLeadEmail}
                    onChange={e => setNewLeadEmail(e.target.value)}
                    placeholder="cliente@email.com"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Orçamento Aprox. (R$)</label>
                  <input
                    type="number"
                    value={newLeadBudget}
                    onChange={e => setNewLeadBudget(e.target.value)}
                    placeholder="2500000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Canal de Origem</label>
                  <select
                    value={newLeadOrigin}
                    onChange={e => setNewLeadOrigin(e.target.value as LeadOrigin)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="site_direto">Portal Morada</option>
                    <option value="portal_zap">ZAP Imóveis</option>
                    <option value="portal_vivareal">VivaReal</option>
                    <option value="instagram_ads">Instagram Ads</option>
                    <option value="indicacao">Indicação Direta</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Observações do Cliente</label>
                <textarea
                  rows={3}
                  value={newLeadNotes}
                  onChange={e => setNewLeadNotes(e.target.value)}
                  placeholder="Preferência por 3 suítes, bairro Jardins, interesse em permuta..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-slate-950 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Inserir no Funil
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
