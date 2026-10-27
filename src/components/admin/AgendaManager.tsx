import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Video,
  Key,
  MessageCircle,
  Edit3,
  Trash2
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { AgendaEvent } from '../../types';

export const AgendaManager: React.FC = () => {
  const { 
    agendaEvents, 
    addAgendaEvent, 
    updateAgendaEvent, 
    deleteAgendaEvent, 
    toggleAgendaCompleted, 
    team, 
    currentUser,
    showToast 
  } = useRealEstate();

  const [filterType, setFilterType] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Event State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<AgendaEvent | null>(null);

  // New Event Form
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AgendaEvent['type']>('visita');
  const [date, setDate] = useState('2026-04-24');
  const [time, setTime] = useState('10:00');
  const [brokerId, setBrokerId] = useState(currentUser.id);
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const filteredEvents = agendaEvents.filter(ev => {
    return filterType === 'todos' || ev.type === filterType;
  });

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const broker = team.find(b => b.id === brokerId) || team[0];

    addAgendaEvent({
      title,
      type,
      date,
      time,
      brokerId: broker.id,
      brokerName: broker.name,
      clientName,
      location,
      notes,
      completed: false
    });

    setIsModalOpen(false);
    setTitle('');
    setClientName('');
    setLocation('');
    setNotes('');
  };

  const getEventIcon = (eventType: AgendaEvent['type']) => {
    switch (eventType) {
      case 'visita':
        return <Key className="w-4 h-4 text-indigo-600" />;
      case 'vistoria':
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case 'assinatura':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'reuniao':
        return <Video className="w-4 h-4 text-purple-600" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {['todos', 'visita', 'vistoria', 'assinatura', 'reuniao'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Agendar Compromisso</span>
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.map(event => {
          const dateFormatted = event.date.split('-').reverse().join('/');

          return (
            <div
              key={event.id}
              className={`bg-white rounded-2xl p-5 border transition-all ${
                event.completed 
                  ? 'border-slate-200 bg-slate-50/60 opacity-70' 
                  : 'border-slate-200 hover:border-indigo-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getEventIcon(event.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {event.type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleAgendaCompleted(event.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      event.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    {event.completed ? 'Concluído ✓' : 'Marcar Concluído'}
                  </button>

                  <button
                    onClick={() => {
                      setEditingEvent({ ...event });
                      setIsEditModalOpen(true);
                    }}
                    className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar Compromisso"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setEventToDelete(event)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Compromisso"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className={`font-bold text-slate-900 text-sm mb-2 ${event.completed ? 'line-through text-slate-400' : ''}`}>
                {event.title}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{dateFormatted} às {event.time}</span>
                </div>

                {event.clientName && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Cliente: {event.clientName}</span>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Responsável: <strong>{event.brokerName}</strong></span>
                {event.notes && (
                  <span className="truncate max-w-[120px] text-slate-400" title={event.notes}>
                    {event.notes}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Agendar Compromisso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Agendar Novo Compromisso</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Compromisso</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Vistoria de Entrega das Chaves"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Atividade</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="visita">Visita a Imóvel</option>
                    <option value="vistoria">Vistoria Fotográfica</option>
                    <option value="assinatura">Assinatura de Contrato</option>
                    <option value="reuniao">Reunião com Cliente</option>
                    <option value="fechamento">Fechamento / Proposta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corretor Responsável</label>
                  <select
                    value={brokerId}
                    onChange={e => setBrokerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {team.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cliente Vinculado</label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Alberto Mendonça"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Local / Endereço</label>
                  <input
                    type="text"
                    placeholder="Ex: Alameda dos Ipês, 88"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Anotações e Instruções</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Levar chave da portaria e laudo de vistoria impresso."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR COMPROMISSO (DIRETOR / ADM)                                 */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Editar Compromisso da Agenda</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateAgendaEvent(editingEvent.id, {
                  title: editingEvent.title,
                  type: editingEvent.type,
                  date: editingEvent.date,
                  time: editingEvent.time,
                  clientName: editingEvent.clientName,
                  location: editingEvent.location,
                  notes: editingEvent.notes
                });
                setIsEditModalOpen(false);
                setEditingEvent(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Compromisso</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title}
                  onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={editingEvent.date}
                    onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Horário</label>
                  <input
                    type="time"
                    required
                    value={editingEvent.time}
                    onChange={e => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Cliente</label>
                  <input
                    type="text"
                    value={editingEvent.clientName || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Local</label>
                  <input
                    type="text"
                    value={editingEvent.location || ''}
                    onChange={e => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações</label>
                <textarea
                  rows={2}
                  value={editingEvent.notes || ''}
                  onChange={e => setEditingEvent({ ...editingEvent, notes: e.target.value })}
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
      {/* MODAL: EXCLUIR COMPROMISSO (CONFIRMAÇÃO)                                  */}
      {/* ========================================================================= */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Excluir Compromisso da Agenda?</h3>
              <p className="text-slate-500">
                Deseja excluir permanentemente o compromisso <strong>"{eventToDelete.title}"</strong> agendado para {eventToDelete.date} às {eventToDelete.time}?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteAgendaEvent(eventToDelete.id);
                  setEventToDelete(null);
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
