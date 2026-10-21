import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Building, 
  Send, 
  Plus, 
  Flame, 
  CheckCircle2, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Lead, LeadStage } from '../../types';
import { AIAdvisor } from './AIAdvisor';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose }) => {
  const { 
    moveLeadStage, 
    addLeadInteraction, 
    addProposal, 
    team, 
    properties,
    setSelectedProperty,
    setCurrentView
  } = useRealEstate();

  const [activeRightTab, setActiveRightTab] = useState<'interacoes' | 'ai_advisor'>('interacoes');
  const [newNote, setNewNote] = useState('');
  const [interactionType, setInteractionType] = useState<'nota' | 'ligacao' | 'whatsapp' | 'visita' | 'proposta'>('nota');
  const [showProposalForm, setShowProposalForm] = useState(false);

  // Proposal form state
  const [offerPrice, setOfferPrice] = useState(lead.budgetMax || 2500000);
  const [downPayment, setDownPayment] = useState(500000);
  const [paymentMethod, setPaymentMethod] = useState<'a_vista' | 'financiamento' | 'permuta'>('financiamento');
  const [proposalNotes, setProposalNotes] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    addLeadInteraction(lead.id, newNote, interactionType);
    setNewNote('');
  };

  const handleCreateProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const propId = lead.propertyOfInterestId || properties[0].id;
    const propObj = properties.find(p => p.id === propId) || properties[0];

    const commRate = 6;
    const commTotal = (offerPrice * commRate) / 100;
    const commBroker = commTotal * 0.4; // 40% of commission goes to broker
    const commAgency = commTotal * 0.6; // 60% agency

    addProposal({
      leadId: lead.id,
      leadName: lead.name,
      leadPhone: lead.phone,
      propertyId: propObj.id,
      propertyCode: propObj.code,
      propertyTitle: propObj.title,
      propertyAskingPrice: propObj.price,
      offeredPrice: offerPrice,
      paymentMethod,
      downPayment,
      status: 'em_analise',
      brokerId: lead.assignedBrokerId,
      brokerName: lead.assignedBrokerName,
      commissionRate: commRate,
      commissionTotal: commTotal,
      commissionBrokerPart: commBroker,
      commissionAgencyPart: commAgency,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: proposalNotes || 'Proposta gerada através do atendimento no CRM.'
    });

    addLeadInteraction(
      lead.id,
      `Formalizada Proposta no valor de ${formatCurrency(offerPrice)} para o imóvel ${propObj.code}.`,
      'proposta'
    );

    setShowProposalForm(false);
  };

  const stagesList: { id: LeadStage; label: string }[] = [
    { id: 'novo', label: '1. Novo Lead' },
    { id: 'contato_realizado', label: '2. Contato Realizado' },
    { id: 'visita_agendada', label: '3. Visita Agendada' },
    { id: 'proposta_enviada', label: '4. Proposta Enviada' },
    { id: 'fechado_ganho', label: '5. Fechado / Ganho' },
    { id: 'perdido', label: '6. Perdido' }
  ];

  const cleanPhone = lead.phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(lead.name)}%2C%20tudo%20bem%3F%20Aqui%20%C3%A9%20da%20Morada%20Digital.`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              {lead.score === 'quente' && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-rose-500" /> Lead Quente
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Captado em {lead.createdAt} via <strong>{lead.origin.replace('_', ' ')}</strong> • Atribuído a <strong>{lead.assignedBrokerName}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage Switcher Pills */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex gap-2 overflow-x-auto">
          {stagesList.map(s => (
            <button
              key={s.id}
              onClick={() => moveLeadStage(lead.id, s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                lead.stage === s.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Client Data & Property Linked */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Quick Actions Bar */}
            <div className="flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${lead.phone}`}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Ligar</span>
              </a>

              <button
                onClick={() => setShowProposalForm(!showProposalForm)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Proposta</span>
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Telefone</span>
                <span className="font-semibold text-slate-900">{lead.phone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">E-mail</span>
                <span className="font-semibold text-slate-900">{lead.email || 'Não informado'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Orçamento Máximo</span>
                <span className="font-bold text-emerald-600 text-sm">{formatCurrency(lead.budgetMax)}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bairros de Interesse</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {lead.preferredNeighborhoods.map((b, i) => (
                    <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] font-medium text-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Property of Interest */}
            {lead.propertyOfInterestTitle && (
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-2">
                <span className="text-[10px] uppercase font-bold text-amber-700 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" /> Imóvel Vinculado
                </span>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2">
                  {lead.propertyOfInterestTitle}
                </h4>
                <span className="text-xs font-mono text-slate-500 block">
                  Código: {lead.propertyOfInterestCode}
                </span>
              </div>
            )}

            {/* Proposal Creator Box if opened */}
            {showProposalForm && (
              <form onSubmit={handleCreateProposal} className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-amber-400">Formalizar Proposta</h4>
                  <button type="button" onClick={() => setShowProposalForm(false)} className="text-slate-400 text-xs">✕</button>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400">Valor da Proposta (R$)</label>
                  <input
                    type="number"
                    required
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400">Sinal / Entrada (R$)</label>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={e => setDownPayment(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400">Forma de Pagamento</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="a_vista">À Vista</option>
                      <option value="financiamento">Financiamento</option>
                      <option value="permuta">Com Permuta</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer shadow"
                >
                  Registrar Proposta e Avançar Funil
                </button>
              </form>
            )}

          </div>

          {/* Right Column: Interaction Timeline */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Add Interaction Form */}
            <form onSubmit={handleAddInteraction} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Registrar Interação:</span>
                <div className="flex gap-1">
                  {(['nota', 'ligacao', 'whatsapp', 'visita'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInteractionType(type)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        interactionType === type
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Ex: Cliente confirmou visita para amanhã às 15h acompanhado da arquiteta..."
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div>
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-4">
                Histórico de Atendimentos ({lead.interactions.length})
              </h3>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {lead.interactions.map(item => (
                  <div key={item.id} className="relative pl-8 space-y-1">
                    <div className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-100 flex items-center justify-center" />
                    
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">{item.author}</span>
                      <span>{item.date}</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                      <span className="text-[10px] font-bold uppercase text-blue-600 mr-2">
                        [{item.type}]
                      </span>
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
