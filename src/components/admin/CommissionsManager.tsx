import React, { useState } from 'react';
import { 
  Wallet, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  User, 
  Building, 
  Printer, 
  ArrowUpRight, 
  Calendar,
  Search,
  Percent,
  Plus,
  Edit3,
  Trash2,
  Check
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Comissao } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const CommissionsManager: React.FC = () => {
  const { 
    comissoes, 
    updateComissaoStatus, 
    addComissao,
    updateComissao,
    deleteComissao,
    team,
    properties 
  } = useRealEstate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // Modal: Create Commission
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDealType, setNewDealType] = useState<'venda' | 'locacao'>('venda');
  const [newPropertyCode, setNewPropertyCode] = useState(properties[0]?.code || 'MD-1001');
  const [newPropertyTitle, setNewPropertyTitle] = useState(properties[0]?.title || 'Casa no Bairro Arvoredo');
  const [newDealValue, setNewDealValue] = useState<number>(1800000);
  const [newTotalRate, setNewTotalRate] = useState<number>(6.0);
  const [newAgencyRate, setNewAgencyRate] = useState<number>(3.3);
  const [newBrokerId, setNewBrokerId] = useState(team[1]?.id || team[0]?.id || 'usr-1');
  const [newBrokerRate, setNewBrokerRate] = useState<number>(2.7);
  const [newCaptadorId, setNewCaptadorId] = useState('');
  const [newCaptadorRate, setNewCaptadorRate] = useState<number>(0);
  const [newDealDate, setNewDealDate] = useState('2026-04-21');
  const [newStatus, setNewStatus] = useState<Comissao['status']>('a_receber');

  // Modal: Edit Commission
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComissao, setEditingComissao] = useState<Comissao | null>(null);

  const filteredComissoes = comissoes.filter(c => {
    const matchesStatus = filterStatus === 'todos' || c.status === filterStatus;
    const matchesSearch = 
      c.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalComissoesValor = comissoes.reduce((acc, curr) => acc + curr.totalCommissionValue, 0);
  const totalAgencyShare = comissoes.reduce((acc, curr) => acc + curr.agencyShareValue, 0);
  const totalBrokersPayout = comissoes.reduce((acc, curr) => acc + curr.brokerShareValue + (curr.captadorShareValue || 0), 0);
  const totalPago = comissoes.filter(c => c.status === 'pago').reduce((acc, curr) => acc + curr.totalCommissionValue, 0);

  const getStatusBadge = (status: Comissao['status']) => {
    switch (status) {
      case 'pago':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Liquidado / Pago
        </span>;
      case 'liberado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
          <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" /> Liberado p/ Pagamento
        </span>;
      case 'a_receber':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" /> A Receber (Escritura/Chaves)
        </span>;
    }
  };

  const handleCreateCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const broker = team.find(u => u.id === newBrokerId) || team[0];
    const captador = team.find(u => u.id === newCaptadorId);

    const totalVal = Math.round(newDealValue * (newTotalRate / 100));
    const agencyVal = Math.round(newDealValue * (newAgencyRate / 100));
    const brokerVal = Math.round(newDealValue * (newBrokerRate / 100));
    const captadorVal = captador ? Math.round(newDealValue * (newCaptadorRate / 100)) : 0;

    addComissao({
      code: `COM-${Math.floor(1000 + Math.random() * 9000)}`,
      dealType: newDealType,
      propertyCode: newPropertyCode,
      propertyTitle: newPropertyTitle,
      totalDealValue: newDealValue,
      totalCommissionRate: newTotalRate,
      totalCommissionValue: totalVal,
      agencyShareRate: newAgencyRate,
      agencyShareValue: agencyVal,
      brokerId: broker.id,
      brokerName: broker.name,
      brokerShareRate: newBrokerRate,
      brokerShareValue: brokerVal,
      captadorBrokerId: captador?.id,
      captadorBrokerName: captador?.name,
      captadorShareRate: captador ? newCaptadorRate : undefined,
      captadorShareValue: captador ? captadorVal : undefined,
      status: newStatus,
      dealDate: newDealDate
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (com: Comissao) => {
    setEditingComissao({ ...com });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComissao) return;

    // Recalculate values based on current rates
    const totalVal = Math.round(editingComissao.totalDealValue * (editingComissao.totalCommissionRate / 100));
    const agencyVal = Math.round(editingComissao.totalDealValue * (editingComissao.agencyShareRate / 100));
    const brokerVal = Math.round(editingComissao.totalDealValue * (editingComissao.brokerShareRate / 100));
    const captadorVal = editingComissao.captadorShareRate 
      ? Math.round(editingComissao.totalDealValue * (editingComissao.captadorShareRate / 100)) 
      : 0;

    updateComissao(editingComissao.id, {
      ...editingComissao,
      totalCommissionValue: totalVal,
      agencyShareValue: agencyVal,
      brokerShareValue: brokerVal,
      captadorShareValue: captadorVal
    });

    setIsEditModalOpen(false);
    setEditingComissao(null);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Excluir o registro de honorários/comissão ${code}?`)) {
      deleteComissao(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total de Honorários</span>
            <span className="text-2xl font-bold font-serif text-slate-900 mt-1 block">
              R$ {totalComissoesValor.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Total gerado em negócios</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Parte Morada Digital</span>
            <span className="text-2xl font-bold font-serif text-indigo-600 mt-1 block">
              R$ {totalAgencyShare.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Receita bruta da imobiliária</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Repasse aos Corretores</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">
              R$ {totalBrokersPayout.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Captadores & Vendedores</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <User className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Já Liquidado</span>
            <span className="text-2xl font-bold font-serif text-blue-600 mt-1 block">
              R$ {totalPago.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Pagamentos efetuados</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter, Search & Create Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, corretor ou imóvel..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex flex-wrap items-center gap-1.5">
            {['todos', 'a_receber', 'liberado', 'pago'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Lançar Honorários</span>
          </button>
        </div>
      </div>

      {/* Commissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Data</th>
                <th className="py-3 px-4">Imóvel & Tipo</th>
                <th className="py-3 px-4">VGV da Transação</th>
                <th className="py-3 px-4">Honorários Totais</th>
                <th className="py-3 px-4">Parte Imobiliária</th>
                <th className="py-3 px-4">Parte Corretor(es)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComissoes.map(com => {
                const dateFormatted = com.dealDate.split('-').reverse().join('/');

                return (
                  <tr key={com.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Code & Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-indigo-700 block">{com.code}</span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{dateFormatted}</span>
                    </td>

                    {/* Property */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block truncate" title={com.propertyTitle}>
                        {com.propertyTitle}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        Cód: {com.propertyCode} • Transação: <strong className="uppercase">{com.dealType}</strong>
                      </span>
                    </td>

                    {/* Deal Value */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                      R$ {com.totalDealValue.toLocaleString('pt-BR')},00
                    </td>

                    {/* Total Commission */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-indigo-700">
                      R$ {com.totalCommissionValue.toLocaleString('pt-BR')},00
                      <span className="text-[10px] text-slate-400 block font-normal">
                        ({com.totalCommissionRate}% total)
                      </span>
                    </td>

                    {/* Agency Share */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                      R$ {com.agencyShareValue.toLocaleString('pt-BR')},00
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Morada Digital ({com.agencyShareRate}%)
                      </span>
                    </td>

                    {/* Broker Share */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-emerald-700">
                        R$ {com.brokerShareValue.toLocaleString('pt-BR')},00
                        <span className="text-[10px] text-slate-500 block font-normal">
                          {com.brokerName} ({com.brokerShareRate}%)
                        </span>
                      </div>
                      {com.captadorBrokerName && (
                        <div className="text-[11px] text-slate-600 mt-1">
                          + R$ {com.captadorShareValue?.toLocaleString('pt-BR')},00
                          <span className="text-[10px] text-slate-400 block">
                            Captador: {com.captadorBrokerName} ({com.captadorShareRate}%)
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {getStatusBadge(com.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {com.status === 'a_receber' && (
                          <button
                            onClick={() => updateComissaoStatus(com.id, 'liberado')}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Liberar
                          </button>
                        )}

                        {com.status === 'liberado' && (
                          <button
                            onClick={() => updateComissaoStatus(com.id, 'pago')}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                          >
                            Pagar
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(com)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Editar comissão, VGV e divisões"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(com.id, com.code)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Excluir comissão"
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

      {/* MODAL: NOVO LANÇAMENTO DE COMISSÃO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Novo Lançamento de Honorários</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCommission} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Negócio</label>
                  <select
                    value={newDealType}
                    onChange={e => setNewDealType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="venda">Venda</option>
                    <option value="locacao">Locação</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Inicial</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="a_receber">A Receber</option>
                    <option value="liberado">Liberado p/ Pagamento</option>
                    <option value="pago">Liquidado (Pago)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Imóvel</label>
                <input
                  type="text"
                  required
                  value={newPropertyTitle}
                  onChange={e => setNewPropertyTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Código do Imóvel</label>
                  <input
                    type="text"
                    required
                    value={newPropertyCode}
                    onChange={e => setNewPropertyCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">VGV do Negócio (R$)</label>
                  <input
                    type="number"
                    required
                    value={newDealValue}
                    onChange={e => setNewDealValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px]">Distribuição de Percentuais</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Honorários (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newTotalRate}
                      onChange={e => setNewTotalRate(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Agência (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newAgencyRate}
                      onChange={e => setNewAgencyRate(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-indigo-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Corretor (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newBrokerRate}
                      onChange={e => setNewBrokerRate(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corretor Principal</label>
                  <select
                    value={newBrokerId}
                    onChange={e => setNewBrokerId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    {team.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Corretor Captador (Opcional)</label>
                  <select
                    value={newCaptadorId}
                    onChange={e => setNewCaptadorId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="">Nenhum (100% vendedor)</option>
                    {team.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md"
                >
                  Gravar Honorários
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR COMISSÃO (TUDO) */}
      {isEditModalOpen && editingComissao && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Editar Honorários & Comissão ({editingComissao.code})</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingComissao.status}
                    onChange={e => setEditingComissao({ ...editingComissao, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="a_receber">A Receber</option>
                    <option value="liberado">Liberado p/ Pagamento</option>
                    <option value="pago">Liquidado (Pago)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">VGV do Negócio (R$)</label>
                  <input
                    type="number"
                    value={editingComissao.totalDealValue}
                    onChange={e => setEditingComissao({ ...editingComissao, totalDealValue: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título do Imóvel</label>
                <input
                  type="text"
                  value={editingComissao.propertyTitle}
                  onChange={e => setEditingComissao({ ...editingComissao, propertyTitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block text-[11px]">Taxas e Splits (%)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Total (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingComissao.totalCommissionRate}
                      onChange={e => setEditingComissao({ ...editingComissao, totalCommissionRate: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Agência (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingComissao.agencyShareRate}
                      onChange={e => setEditingComissao({ ...editingComissao, agencyShareRate: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-indigo-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Corretor (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingComissao.brokerShareRate}
                      onChange={e => setEditingComissao({ ...editingComissao, brokerShareRate: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl text-slate-800 font-bold text-emerald-700"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Corretor</label>
                  <input
                    type="text"
                    value={editingComissao.brokerName}
                    onChange={e => setEditingComissao({ ...editingComissao, brokerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data do Negócio</label>
                  <input
                    type="date"
                    value={editingComissao.dealDate}
                    onChange={e => setEditingComissao({ ...editingComissao, dealDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
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

    </div>
  );
};
