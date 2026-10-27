import React, { useState } from 'react';
import { 
  Key, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Star, 
  FileText, 
  Plus, 
  Search, 
  MessageCircle,
  Building,
  Check,
  Printer,
  ShieldCheck,
  Smile,
  Edit3,
  Trash2
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Visita, VisitaStatus } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const VisitasManager: React.FC = () => {
  const { 
    visitas, 
    addVisita, 
    updateVisitaStatus, 
    addVisitaFeedback, 
    updateVisita,
    deleteVisita,
    properties, 
    team, 
    currentUser,
    showToast 
  } = useRealEstate();

  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [isNewVisitModalOpen, setIsNewVisitModalOpen] = useState(false);
  const [selectedVisitaTerm, setSelectedVisitaTerm] = useState<Visita | null>(null);
  const [feedbackVisita, setFeedbackVisita] = useState<Visita | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Edit Visit State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVisita, setEditingVisita] = useState<Visita | null>(null);
  const [visitaToDelete, setVisitaToDelete] = useState<Visita | null>(null);

  // New Visit Form
  const [newPropertyId, setNewPropertyId] = useState(properties[0]?.id || '');
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newBrokerId, setNewBrokerId] = useState(currentUser.id);
  const [newDate, setNewDate] = useState('2026-04-25');
  const [newTime, setNewTime] = useState('14:00');
  const [newKeyLocation, setNewKeyLocation] = useState('Portaria Social com identificação da Morada Digital');
  const [newNotes, setNewNotes] = useState('');

  // Filtered visits
  const filteredVisitas = visitas.filter(v => {
    const matchesStatus = filterStatus === 'todos' || v.status === filterStatus;
    const matchesSearch = 
      v.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.leadOrClientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalAgendadas = visitas.filter(v => v.status === 'agendada').length;
  const totalConfirmadas = visitas.filter(v => v.status === 'confirmada').length;
  const totalRealizadas = visitas.filter(v => v.status === 'realizada').length;
  const avgRating = (visitas.filter(v => v.feedbackRating).reduce((acc, curr) => acc + (curr.feedbackRating || 0), 0) / (visitas.filter(v => v.feedbackRating).length || 1)).toFixed(1);

  const handleCreateVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === newPropertyId);
    const broker = team.find(u => u.id === newBrokerId) || team[0];

    if (!prop) {
      showToast('Selecione um imóvel válido.', 'Erro', 'crm');
      return;
    }

    addVisita({
      propertyId: prop.id,
      propertyCode: prop.code,
      propertyTitle: prop.title,
      propertyAddress: prop.address + ', ' + prop.neighborhood,
      leadOrClientName: newClientName || 'Cliente Agendado',
      leadOrClientPhone: newClientPhone || '(31) 98427-9865',
      brokerId: broker.id,
      brokerName: broker.name,
      date: newDate,
      time: newTime,
      status: 'agendada',
      keyLocation: newKeyLocation,
      termSigned: false,
      notes: newNotes
    });

    setIsNewVisitModalOpen(false);
    // Reset fields
    setNewClientName('');
    setNewClientPhone('');
    setNewNotes('');
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackVisita) {
      addVisitaFeedback(feedbackVisita.id, feedbackRating, feedbackComment);
      setFeedbackVisita(null);
      setFeedbackComment('');
    }
  };

  const getStatusBadge = (status: VisitaStatus) => {
    switch (status) {
      case 'confirmada':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Confirmada
        </span>;
      case 'agendada':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
          <Clock className="w-3.5 h-3.5 text-indigo-600" /> Agendada
        </span>;
      case 'realizada':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <Check className="w-3.5 h-3.5 text-blue-600" /> Realizada
        </span>;
      case 'cancelada':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" /> Cancelada
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Agendadas</span>
            <span className="text-2xl font-bold font-serif text-indigo-600 mt-1 block">{totalAgendadas}</span>
            <span className="text-[11px] text-slate-400">Aguardando confirmação</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Confirmadas</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">{totalConfirmadas}</span>
            <span className="text-[11px] text-emerald-600 font-medium">Chaves & Portarias OK</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Realizadas no Mês</span>
            <span className="text-2xl font-bold font-serif text-blue-600 mt-1 block">{totalRealizadas}</span>
            <span className="text-[11px] text-slate-400">Com termo digital assinado</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Key className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Avaliação Média</span>
            <span className="text-2xl font-bold font-serif text-amber-500 mt-1 block flex items-center gap-1.5">
              {avgRating} <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </span>
            <span className="text-[11px] text-slate-400">Satisfação dos clientes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Smile className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por imóvel, cliente ou código..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 w-full md:w-auto">
          {['todos', 'agendada', 'confirmada', 'realizada', 'cancelada'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* New Visit Button */}
        <button
          onClick={() => setIsNewVisitModalOpen(true)}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Nova Visita</span>
        </button>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Data</th>
                <th className="py-3 px-4">Imóvel & Endereço</th>
                <th className="py-3 px-4">Cliente & Contato</th>
                <th className="py-3 px-4">Corretor</th>
                <th className="py-3 px-4">Localização da Chave</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVisitas.map(visita => {
                const dateFormatted = visita.date.split('-').reverse().join('/');
                
                return (
                  <tr key={visita.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Code & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-700 block text-xs">
                        {visita.code}
                      </span>
                      <span className="text-slate-600 flex items-center gap-1 mt-0.5 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" /> {dateFormatted} às {visita.time}
                      </span>
                    </td>

                    {/* Property */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate" title={visita.propertyTitle}>
                        {visita.propertyTitle}
                      </span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {visita.propertyAddress}
                      </span>
                    </td>

                    {/* Client & Phone */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-slate-800 block">
                        {visita.leadOrClientName}
                      </span>
                      <a
                        href={`https://wa.me/55${visita.leadOrClientPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(visita.leadOrClientName)}%2C%20confirmamos%20sua%20visita%20ao%20im%C3%B3vel%20${visita.propertyCode}%20pela%20Morada%20Digital%20no%20dia%20${dateFormatted}%20%C3%A0s%20${visita.time}.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 mt-0.5"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {visita.leadOrClientPhone}
                      </a>
                    </td>

                    {/* Broker */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-700 font-medium block">
                        {visita.brokerName}
                      </span>
                    </td>

                    {/* Key Location */}
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <div className="flex items-start gap-1.5 text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200/60">
                        <Key className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-tight line-clamp-2">
                          {visita.keyLocation}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(visita.status)}
                      {visita.feedbackRating && (
                        <div className="flex items-center justify-center gap-0.5 mt-1 text-amber-500 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{visita.feedbackRating}/5</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Status Switcher Quick Menu */}
                        {visita.status === 'agendada' && (
                          <button
                            onClick={() => updateVisitaStatus(visita.id, 'confirmada')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            title="Confirmar Visita"
                          >
                            Confirmar
                          </button>
                        )}

                        {visita.status === 'confirmada' && (
                          <button
                            onClick={() => {
                              updateVisitaStatus(visita.id, 'realizada');
                              setFeedbackVisita(visita);
                            }}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                            title="Marcar como Realizada e Coletar Feedback"
                          >
                            Concluir
                          </button>
                        )}

                        {/* Termo de Visita Button */}
                        <button
                          onClick={() => setSelectedVisitaTerm(visita)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Visualizar Termo de Visita Digital"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Edit Visit Button */}
                        <button
                          onClick={() => {
                            setEditingVisita({ ...visita });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar Visita"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Visit Button */}
                        <button
                          onClick={() => setVisitaToDelete(visita)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir Visita Definitivamente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Agendar Nova Visita */}
      {isNewVisitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Agendar Nova Visita</h3>
                  <span className="text-xs text-slate-500">Morada Digital • Gestão Comercial</span>
                </div>
              </div>
              <button 
                onClick={() => setIsNewVisitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVisit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Imóvel para Visitação</label>
                <select
                  value={newPropertyId}
                  onChange={e => setNewPropertyId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  required
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} ({p.neighborhood}) - R$ {(p.price / 1000).toLocaleString('pt-BR')}k
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente / Lead</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Larissa Campos"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp do Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="(31) 98427-9865"
                    value={newClientPhone}
                    onChange={e => setNewClientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corretor</label>
                  <select
                    value={newBrokerId}
                    onChange={e => setNewBrokerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {team.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Localização da Chave / Portaria</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Portaria social com autorização prévia da Morada Digital"
                  value={newKeyLocation}
                  onChange={e => setNewKeyLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Observações de Apoio</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Cliente tem interesse em verificar insolação da tarde e vagas de garagem."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewVisitModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Confirmar Agendamento
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Termo de Visita Digital */}
      {selectedVisitaTerm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-400 flex items-center justify-center text-white font-black text-sm">
                  MD
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg font-serif">Termo de Visita a Imóvel Digital</h3>
                  <span className="text-xs text-slate-500">
                    {MORADA_BRAND.legalName} • {MORADA_BRAND.creci}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedVisitaTerm(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Term Content Document */}
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pb-2 border-b border-slate-200">
                <span>Protocolo: {selectedVisitaTerm.code}</span>
                <span>Data: {selectedVisitaTerm.date.split('-').reverse().join('/')} às {selectedVisitaTerm.time}</span>
              </div>

              <p>
                Pelo presente instrumento, o(a) visitante abaixo qualificado(a) declara que visitou, nesta data, acompanhado(a) pelo(a) corretor(a) credenciado(a) da <strong>Morada Digital</strong>, o imóvel descrito a seguir:
              </p>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div><strong>Imóvel:</strong> {selectedVisitaTerm.propertyTitle} (Cód: {selectedVisitaTerm.propertyCode})</div>
                <div><strong>Endereço:</strong> {selectedVisitaTerm.propertyAddress}</div>
                <div><strong>Chave / Portaria:</strong> {selectedVisitaTerm.keyLocation}</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div><strong>Visitante:</strong> {selectedVisitaTerm.leadOrClientName}</div>
                <div><strong>Telefone / WhatsApp:</strong> {selectedVisitaTerm.leadOrClientPhone}</div>
                <div><strong>Corretor Responsável:</strong> {selectedVisitaTerm.brokerName}</div>
              </div>

              <p className="text-[11px] text-slate-500">
                <strong>Cláusula de Reconhecimento de Intermediação:</strong> O(a) visitante reconhece que a apresentação do imóvel acima foi intermediada com exclusividade pela <strong>Morada Digital</strong>, comprometendo-se a realizar qualquer eventual proposta, negociação de compra ou locação diretamente por intermédio desta plataforma, em estrita conformidade com os artigos 722 a 729 do Código Civil Brasileiro.
              </p>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Assinatura Digital Validade Jurídica (Lei 14.063/2020)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Hash: SHA256-MD8092B</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Gerar PDF</span>
              </button>

              <a
                href={`https://wa.me/55${selectedVisitaTerm.leadOrClientPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(selectedVisitaTerm.leadOrClientName)}%2C%20segue%20o%20link%20do%20seu%20Termo%20de%20Visita%20Digital%20Morada%20Digital%20referente%20ao%20im%C3%B3vel%20${selectedVisitaTerm.propertyCode}%3A%20https%3A%2F%2Fmoradadigital.com.br%2Ftermo%2F${selectedVisitaTerm.code}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar no WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* Modal: Feedback Pós-Visita */}
      {feedbackVisita && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-1">Feedback da Visita Realizada</h3>
            <p className="text-xs text-slate-500 mb-4">
              {feedbackVisita.leadOrClientName} • {feedbackVisita.propertyCode}
            </p>

            <form onSubmit={handleSaveFeedback} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Nota de Satisfação (1 a 5 estrelas)</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">Nota: {feedbackRating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Comentários e Intenção de Proposta</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ex: O cliente elogiou a iluminação e acabamentos. Sinalizou que enviará proposta amanhã."
                  value={feedbackComment}
                  onChange={e => setFeedbackComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFeedbackVisita(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Fechar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR VISITA (DIRETOR / ADM)                                      */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingVisita && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Editar Visita</h3>
                  <span className="text-[11px] font-mono text-slate-500">{editingVisita.code} • {editingVisita.propertyCode}</span>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateVisita(editingVisita.id, {
                  date: editingVisita.date,
                  time: editingVisita.time,
                  leadOrClientName: editingVisita.leadOrClientName,
                  leadOrClientPhone: editingVisita.leadOrClientPhone,
                  keyLocation: editingVisita.keyLocation,
                  status: editingVisita.status,
                  notes: editingVisita.notes
                });
                setIsEditModalOpen(false);
                setEditingVisita(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Visitante</label>
                  <input
                    type="text"
                    required
                    value={editingVisita.leadOrClientName}
                    onChange={e => setEditingVisita({ ...editingVisita, leadOrClientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editingVisita.leadOrClientPhone}
                    onChange={e => setEditingVisita({ ...editingVisita, leadOrClientPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={editingVisita.date}
                    onChange={e => setEditingVisita({ ...editingVisita, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={editingVisita.time}
                    onChange={e => setEditingVisita({ ...editingVisita, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Visita</label>
                  <select
                    value={editingVisita.status}
                    onChange={e => setEditingVisita({ ...editingVisita, status: e.target.value as VisitaStatus })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  >
                    <option value="agendada">Agendada</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="realizada">Realizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portaria / Chaves</label>
                  <input
                    type="text"
                    value={editingVisita.keyLocation}
                    onChange={e => setEditingVisita({ ...editingVisita, keyLocation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações da Visita</label>
                <textarea
                  rows={2}
                  value={editingVisita.notes || ''}
                  onChange={e => setEditingVisita({ ...editingVisita, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EXCLUIR VISITA (CONFIRMAÇÃO)                                       */}
      {/* ========================================================================= */}
      {visitaToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Excluir Agendamento de Visita?</h3>
              <p className="text-slate-500">
                Deseja excluir a visita <strong>{visitaToDelete.code}</strong> para o cliente <strong>{visitaToDelete.leadOrClientName}</strong> no imóvel {visitaToDelete.propertyCode}?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVisitaToDelete(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteVisita(visitaToDelete.id);
                  setVisitaToDelete(null);
                }}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
