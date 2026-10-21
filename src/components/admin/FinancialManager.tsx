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
  Tag
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { FinancialTransaction } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const FinancialManager: React.FC = () => {
  const { financialTransactions, addFinancialTransaction, showToast } = useRealEstate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<'todos' | 'receita' | 'despesa'>('todos');

  // Form
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FinancialTransaction['category']>('comissao_venda');
  const [type, setType] = useState<FinancialTransaction['type']>('receita');
  const [amount, setAmount] = useState<number>(5000);
  const [date, setDate] = useState('2026-04-20');
  const [paymentMethod, setPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('pix');

  const filteredTxs = financialTransactions.filter(tx => {
    return filterType === 'todos' || tx.type === filterType;
  });

  const totalReceitas = financialTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((acc, c) => acc + c.amount, 0);
  const totalDespesas = financialTransactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((acc, c) => acc + c.amount, 0);
  const saldoOperacional = totalReceitas - totalDespesas;
  const previsaoReceber = financialTransactions.filter(t => t.type === 'receita' && t.status === 'pendente').reduce((acc, c) => acc + c.amount, 0);

  const handleAddTx = (e: React.FormEvent) => {
    e.preventDefault();
    addFinancialTransaction({
      description,
      category,
      type,
      amount,
      date,
      dueDate: date,
      status: 'pago',
      paymentMethod
    });

    setIsModalOpen(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Receitas Realizadas</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">
              R$ {totalReceitas.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Comissões & Taxas locação</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Despesas Operacionais</span>
            <span className="text-2xl font-bold font-serif text-rose-600 mt-1 block">
              R$ {totalDespesas.toLocaleString('pt-BR')}
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
              R$ {saldoOperacional.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Margem saudável</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Previsão a Receber</span>
            <span className="text-2xl font-bold font-serif text-amber-600 mt-1 block">
              R$ {previsaoReceber.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Contratos em assinatura</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter and Create Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5">
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
              {f === 'todos' ? 'Todas as Movimentações' : f === 'receita' ? 'Apenas Entradas' : 'Apenas Saídas'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Lançar no Fluxo</span>
        </button>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Descrição da Operação</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Data / Vencimento</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxs.map(tx => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Description */}
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    {tx.type === 'receita' ? (
                      <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span>{tx.description}</span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    <span className="capitalize bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700">
                      {tx.category.replace('_', ' ')}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                    {tx.date.split('-').reverse().join('/')}
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4 whitespace-nowrap uppercase font-mono text-[11px] text-slate-500">
                    {tx.paymentMethod}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {tx.status === 'pago' ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Liquidado
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold flex items-center gap-1 text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> Pendente
                      </span>
                    )}
                  </td>

                  {/* Amount */}
                  <td className={`py-3.5 px-4 text-right whitespace-nowrap font-bold text-sm ${
                    tx.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {tx.type === 'receita' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR')},00
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Lançamento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="font-bold text-slate-900 text-base mb-4 pb-2 border-b border-slate-100">
              Novo Lançamento Financeiro
            </h3>

            <form onSubmit={handleAddTx} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descrição</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Assinatura de Ferramenta / Portais"
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
                    <option value="marketing">Marketing Digital</option>
                    <option value="portais">Portais Imobiliários</option>
                    <option value="sede_operacional">Sede Rua Pinheiro 264</option>
                    <option value="sistemas_crm">Sistemas & CRM</option>
                    <option value="juridico">Assessoria Jurídica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
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
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
