import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  Building,
  Tag,
  Edit3,
  Trash2,
  Settings,
  Landmark,
  FileText,
  AlertCircle,
  Check,
  RotateCcw
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { FinancialTransaction, AgencyFinancialSettings } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const FinancialManager: React.FC = () => {
  const { 
    financialTransactions, 
    addFinancialTransaction, 
    updateFinancialTransaction,
    deleteFinancialTransaction,
    financialSettings,
    updateFinancialSettings,
    showToast 
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'transacoes' | 'bancario'>('transacoes');
  const [filterType, setFilterType] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pago' | 'pendente'>('todos');
  
  // Create Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FinancialTransaction['category']>('comissao_venda');
  const [type, setType] = useState<FinancialTransaction['type']>('receita');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState('2026-04-20');
  const [dueDate, setDueDate] = useState('2026-04-30');
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('pix');
  const [status, setStatus] = useState<FinancialTransaction['status']>('pago');
  const [payerOrPayee, setPayerOrPayee] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Edit Transaction Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<FinancialTransaction | null>(null);

  // Edit Financial Settings Modal / State
  const [isEditSettingsModalOpen, setIsEditSettingsModalOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<AgencyFinancialSettings>(financialSettings);

  const filteredTxs = financialTransactions.filter(tx => {
    const matchesType = filterType === 'todos' || tx.type === filterType;
    const matchesStatus = filterStatus === 'todos' || tx.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const totalReceitas = financialTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, c) => acc + c.amount, 0);
  const totalDespesas = financialTransactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, c) => acc + c.amount, 0);
  const saldoOperacional = totalReceitas - totalDespesas;
  const previsaoReceber = financialTransactions.filter(t => t.type === 'receita' && t.status === 'pendente').reduce((acc, c) => acc + c.amount, 0);

  const handleOpenCreateModal = () => {
    setDescription('');
    setCategory('comissao_venda');
    setType('receita');
    setAmount(10000);
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('pix');
    setStatus('pago');
    setPayerOrPayee('');
    setDocumentNumber('');
    setNotes('');
    setIsCreateModalOpen(true);
  };

  const handleCreateTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || amount <= 0) return;

    addFinancialTransaction({
      description,
      category,
      type,
      amount,
      date,
      dueDate,
      status,
      paymentMethod,
      payerOrPayee,
      documentNumber,
      notes
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (tx: FinancialTransaction) => {
    setEditingTx(tx);
    setIsEditModalOpen(true);
  };

  const handleSaveEditTx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;

    updateFinancialTransaction(editingTx.id, {
      description: editingTx.description,
      category: editingTx.category,
      type: editingTx.type,
      amount: editingTx.amount,
      date: editingTx.date,
      dueDate: editingTx.dueDate,
      status: editingTx.status,
      paymentMethod: editingTx.paymentMethod,
      payerOrPayee: editingTx.payerOrPayee,
      documentNumber: editingTx.documentNumber,
      notes: editingTx.notes
    });

    setIsEditModalOpen(false);
    setEditingTx(null);
  };

  const handleDeleteTx = (id: string, desc: string) => {
    if (confirm(`Tem certeza que deseja excluir o lançamento "${desc}"?`)) {
      deleteFinancialTransaction(id);
    }
  };

  const handleToggleStatus = (tx: FinancialTransaction) => {
    const nextStatus = tx.status === 'pago' ? 'pendente' : 'pago';
    updateFinancialTransaction(tx.id, { status: nextStatus });
  };

  const handleOpenSettingsModal = () => {
    setTempSettings(financialSettings);
    setIsEditSettingsModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateFinancialSettings(tempSettings);
    setIsEditSettingsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Receitas Realizadas</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">
              R$ {totalReceitas.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Comissões & Taxas liquidadas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Despesas Pagas</span>
            <span className="text-2xl font-bold font-serif text-rose-600 mt-1 block">
              R$ {totalDespesas.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Sede Contagem, marketing, portais</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Resultado Líquido</span>
            <span className="text-2xl font-bold font-serif text-indigo-700 mt-1 block">
              R$ {saldoOperacional.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Margem operacional positiva</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Previsão a Receber</span>
            <span className="text-2xl font-bold font-serif text-amber-600 mt-1 block">
              R$ {previsaoReceber.toLocaleString('pt-BR')},00
            </span>
            <span className="text-[11px] text-slate-400">Contratos & honorários pendentes</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Institutional Bank & Splits Summary Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white font-display">
              Conta Bancária Institucional & Regras de Repasse
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Banco: <strong>{financialSettings.bankName}</strong> (Cód. {financialSettings.bankCode}) • Agência: <strong>{financialSettings.agencyNumber}</strong> • C/C: <strong>{financialSettings.accountNumber}</strong> • Pix: <code className="text-emerald-400">{financialSettings.pixKey}</code>
          </p>
          <div className="text-[11px] text-slate-400 pt-0.5">
            Divisão Padrão: <strong>{financialSettings.defaultSalesCommissionRate}% de honorários</strong> ({financialSettings.agencySplitPercent}% Imobiliária / {financialSettings.brokerSplitPercent}% Corretor) • Taxa Admin Locação: <strong>{financialSettings.defaultRentalAdminFeePercent}%</strong>
          </div>
        </div>

        <button
          onClick={handleOpenSettingsModal}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-emerald-400" />
          <span>Editar Regras Bancárias & Splits</span>
        </button>
      </div>

      {/* Filter and Create Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {(['todos', 'receita', 'despesa'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === f
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'todos' ? 'Todos os Lançamentos' : f === 'receita' ? 'Entradas (Receitas)' : 'Saídas (Despesas)'}
            </button>
          ))}

          <span className="text-slate-300 px-1">|</span>

          {(['todos', 'pago', 'pendente'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'todos' ? 'Status: Todos' : s === 'pago' ? 'Liquidados' : 'Pendentes'}
            </button>
          ))}
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento Financeiro</span>
        </button>
      </div>

      {/* Transactions Table with EDIT & DELETE ACTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Descrição da Operação</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Favorecido / Pagador</th>
                <th className="py-3 px-4">Data / Vencimento</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxs.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Description */}
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      {tx.type === 'receita' ? (
                        <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded-md bg-rose-50 text-rose-600 shrink-0">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div>
                        <span>{tx.description}</span>
                        {tx.documentNumber && (
                          <span className="block text-[10px] text-slate-400 font-mono font-normal">
                            Doc/NF: {tx.documentNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <span className="capitalize bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700">
                      {tx.category.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Payer or Payee */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700">
                    {tx.payerOrPayee || <span className="text-slate-400 italic">Morada Digital</span>}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <div>{tx.date.split('-').reverse().join('/')}</div>
                    {tx.dueDate && tx.dueDate !== tx.date && (
                      <span className="text-[10px] text-amber-600 block">
                        Venc: {tx.dueDate.split('-').reverse().join('/')}
                      </span>
                    )}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap uppercase font-mono text-[11px] text-slate-500">
                    {tx.paymentMethod}
                  </td>

                  {/* Status with Quick Toggle */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleToggleStatus(tx)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-all ${
                        tx.status === 'pago' 
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title="Clique para alternar entre Liquidado e Pendente"
                    >
                      {tx.status === 'pago' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Liquidado</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pendente</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Amount */}
                  <td className={`py-3.5 px-4 text-right whitespace-nowrap font-bold text-sm ${
                    tx.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.type === 'receita' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR')},00
                  </td>

                  {/* Action Buttons: Edit and Delete */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(tx)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar todos os dados do lançamento financeiro"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTx(tx.id, tx.description)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir lançamento financeiro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: NOVO LANÇAMENTO FINANCEIRO */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Novo Lançamento Financeiro
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição da Operação</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Honorários de Venda / Portais Imobiliários ZAP"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Movimentação</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="receita">Receita (Entrada)</option>
                    <option value="despesa">Despesa (Saída)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="comissao_venda">Comissão de Venda</option>
                    <option value="taxa_locacao">Taxa de Locação</option>
                    <option value="marketing">Marketing & Tráfego Pago</option>
                    <option value="portais">Portais Imobiliários</option>
                    <option value="sede_operacional">Sede Operacional Contagem</option>
                    <option value="sistemas_crm">Sistemas & CRM</option>
                    <option value="juridico">Assessoria Jurídica</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="pix">Pix</option>
                    <option value="ted">TED / Transferência</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="cartao">Cartão Corporativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data da Operação</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Favorecido / Pagador</label>
                  <input
                    type="text"
                    placeholder="Ex: Cliente / Fornecedor"
                    value={payerOrPayee}
                    onChange={e => setPayerOrPayee(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="pago">Liquidado (Pago)</option>
                    <option value="pendente">Pendente</option>
                    <option value="agendado">Agendado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nº do Documento / NF (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: NF-e 4920"
                  value={documentNumber}
                  onChange={e => setDocumentNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
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
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDITAR LANÇAMENTO FINANCEIRO (TUDO) */}
      {isEditModalOpen && editingTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Editar Lançamento Financeiro</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditTx} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  value={editingTx.description}
                  onChange={e => setEditingTx({ ...editingTx, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Movimentação</label>
                  <select
                    value={editingTx.type}
                    onChange={e => setEditingTx({ ...editingTx, type: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="receita">Receita (Entrada)</option>
                    <option value="despesa">Despesa (Saída)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoria</label>
                  <select
                    value={editingTx.category}
                    onChange={e => setEditingTx({ ...editingTx, category: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="comissao_venda">Comissão de Venda</option>
                    <option value="taxa_locacao">Taxa de Locação</option>
                    <option value="marketing">Marketing & Tráfego Pago</option>
                    <option value="portais">Portais Imobiliários</option>
                    <option value="sede_operacional">Sede Operacional Contagem</option>
                    <option value="sistemas_crm">Sistemas & CRM</option>
                    <option value="juridico">Assessoria Jurídica</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingTx.amount}
                    onChange={e => setEditingTx({ ...editingTx, amount: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Forma de Pagamento</label>
                  <select
                    value={editingTx.paymentMethod}
                    onChange={e => setEditingTx({ ...editingTx, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="pix">Pix</option>
                    <option value="ted">TED / Transferência</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="cartao">Cartão Corporativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data da Operação</label>
                  <input
                    type="date"
                    required
                    value={editingTx.date}
                    onChange={e => setEditingTx({ ...editingTx, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Data de Vencimento</label>
                  <input
                    type="date"
                    required
                    value={editingTx.dueDate || editingTx.date}
                    onChange={e => setEditingTx({ ...editingTx, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Favorecido / Pagador</label>
                  <input
                    type="text"
                    value={editingTx.payerOrPayee || ''}
                    onChange={e => setEditingTx({ ...editingTx, payerOrPayee: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingTx.status}
                    onChange={e => setEditingTx({ ...editingTx, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="pago">Liquidado (Pago)</option>
                    <option value="pendente">Pendente</option>
                    <option value="agendado">Agendado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nº do Documento / NF</label>
                <input
                  type="text"
                  value={editingTx.documentNumber || ''}
                  onChange={e => setEditingTx({ ...editingTx, documentNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações Internas</label>
                <textarea
                  rows={2}
                  value={editingTx.notes || ''}
                  onChange={e => setEditingTx({ ...editingTx, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                />
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
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: EDITAR REGRAS BANCÁRIAS E SPLITS DA IMOBILIÁRIA (TUDO) */}
      {isEditSettingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Editar Dados Bancários & Regras de Divisão (Splits)
                </h3>
              </div>
              <button onClick={() => setIsEditSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">Regras de Honorários & Splits</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Comissão Venda (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempSettings.defaultSalesCommissionRate}
                      onChange={e => setTempSettings({ ...tempSettings, defaultSalesCommissionRate: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parte Agência (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempSettings.agencySplitPercent}
                      onChange={e => setTempSettings({ ...tempSettings, agencySplitPercent: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-indigo-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Parte Corretor (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempSettings.brokerSplitPercent}
                      onChange={e => setTempSettings({ ...tempSettings, brokerSplitPercent: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Taxa Locação (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={tempSettings.defaultRentalAdminFeePercent}
                      onChange={e => setTempSettings({ ...tempSettings, defaultRentalAdminFeePercent: Number(e.target.value) })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-xs block">Conta Bancária & Chave Pix Oficial</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Instituição Bancária</label>
                    <input
                      type="text"
                      value={tempSettings.bankName}
                      onChange={e => setTempSettings({ ...tempSettings, bankName: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Código do Banco</label>
                    <input
                      type="text"
                      value={tempSettings.bankCode}
                      onChange={e => setTempSettings({ ...tempSettings, bankCode: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Agência</label>
                    <input
                      type="text"
                      value={tempSettings.agencyNumber}
                      onChange={e => setTempSettings({ ...tempSettings, agencyNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Conta Corrente</label>
                    <input
                      type="text"
                      value={tempSettings.accountNumber}
                      onChange={e => setTempSettings({ ...tempSettings, accountNumber: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Titular da Conta</label>
                    <input
                      type="text"
                      value={tempSettings.accountHolder}
                      onChange={e => setTempSettings({ ...tempSettings, accountHolder: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CNPJ</label>
                    <input
                      type="text"
                      value={tempSettings.cnpj}
                      onChange={e => setTempSettings({ ...tempSettings, cnpj: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Chave Pix</label>
                    <input
                      type="text"
                      value={tempSettings.pixKey}
                      onChange={e => setTempSettings({ ...tempSettings, pixKey: e.target.value })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono text-emerald-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tipo de Chave</label>
                    <select
                      value={tempSettings.pixKeyType}
                      onChange={e => setTempSettings({ ...tempSettings, pixKeyType: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                    >
                      <option value="email">E-mail</option>
                      <option value="cnpj">CNPJ</option>
                      <option value="telefone">Telefone</option>
                      <option value="aleatoria">Aleatória</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditSettingsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-[#0B2545] hover:bg-[#071930] text-white rounded-xl shadow-md"
                >
                  Salvar Regras Financeiras
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
