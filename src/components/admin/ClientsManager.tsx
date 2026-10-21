import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageCircle, 
  Phone, 
  Mail, 
  Building, 
  DollarSign, 
  MapPin, 
  Filter,
  CheckCircle,
  Clock,
  UserPlus
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Cliente } from '../../types';

export const ClientsManager: React.FC = () => {
  const { clientes, addCliente, showToast } = useRealEstate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Client Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [type, setType] = useState<Cliente['type']>('comprador');
  const [budgetMax, setBudgetMax] = useState<number>(2000000);
  const [city, setCity] = useState('Contagem');
  const [notes, setNotes] = useState('');

  const filteredClientes = clientes.filter(c => {
    const matchesType = typeFilter === 'todos' || c.type === typeFilter;
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cpfCnpj.includes(searchTerm) ||
      c.phone.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    addCliente({
      name,
      email,
      phone,
      cpfCnpj,
      type,
      status: 'ativo',
      budgetMax,
      city,
      notes
    });

    setIsModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setCpfCnpj('');
    setNotes('');
  };

  const getTypeBadge = (clientType: Cliente['type']) => {
    switch (clientType) {
      case 'comprador':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Comprador</span>;
      case 'proprietario':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Proprietário</span>;
      case 'locatario':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Locatário</span>;
      case 'investidor':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Investidor</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF/CNPJ ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['todos', 'comprador', 'proprietario', 'locatario', 'investidor'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                typeFilter === t
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Add Client Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Cliente / CPF</th>
                <th className="py-3 px-4">Perfil</th>
                <th className="py-3 px-4">Contatos</th>
                <th className="py-3 px-4">Orçamento / Teto</th>
                <th className="py-3 px-4">Localidade</th>
                <th className="py-3 px-4">Observações</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClientes.map(cliente => (
                <tr key={cliente.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Name & CPF */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-900 block">{cliente.name}</span>
                    <span className="font-mono text-[11px] text-slate-500">{cliente.cpfCnpj}</span>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getTypeBadge(cliente.type)}
                  </td>

                  {/* Contact */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <a
                      href={`https://wa.me/55${cliente.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(cliente.name)}%2C%20tudo%20bem%3F%20Falamos%20da%20Morada%20Digital.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {cliente.phone}
                    </a>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{cliente.email}</span>
                  </td>

                  {/* Budget */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                    {cliente.budgetMax ? `Até R$ ${(cliente.budgetMax / 1000).toLocaleString('pt-BR')}k` : 'Sob consulta'}
                  </td>

                  {/* City */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {cliente.city || 'Contagem / BH'}
                  </td>

                  {/* Notes */}
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 text-[11px]" title={cliente.notes}>
                    {cliente.notes || 'Sem observações.'}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <a
                      href={`https://wa.me/55${cliente.phone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(cliente.name)}%2C%20atendimento%20Morada%20Digital.`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Cadastrar Novo Cliente</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dra. Camila Rocha"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Perfil</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="comprador">Comprador</option>
                    <option value="proprietario">Proprietário</option>
                    <option value="locatario">Locatário</option>
                    <option value="investidor">Investidor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp / Telefone</label>
                  <input
                    type="text"
                    required
                    placeholder="(31) 98427-9865"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={cpfCnpj}
                    onChange={e => setCpfCnpj(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    required
                    placeholder="cliente@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orçamento Máximo (R$)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={e => setBudgetMax(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferências e Observações</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Procura apartamento de 3 dormitórios com 2 vagas em condomínio fechado."
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
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
