import React, { useState } from 'react';
import { 
  Building, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MessageCircle, 
  Printer, 
  Search, 
  FileText, 
  User, 
  ArrowUpRight,
  ShieldCheck,
  Edit3,
  Trash2
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Locacao } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const RentalsManager: React.FC = () => {
  const { locacoes, updateLocacaoStatus, updateLocacao, deleteLocacao, showToast } = useRealEstate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedReceipt, setSelectedReceipt] = useState<Locacao | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLocacao, setEditingLocacao] = useState<Locacao | null>(null);
  const [locacaoToDelete, setLocacaoToDelete] = useState<Locacao | null>(null);

  const filteredLocacoes = locacoes.filter(loc => {
    const matchesStatus = filterStatus === 'todos' || loc.currentMonthStatus === filterStatus;
    const matchesSearch = 
      loc.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRentals = locacoes.length;
  const totalMonthlyVolume = locacoes.reduce((acc, curr) => acc + curr.monthlyRent, 0);
  const totalAgencyAdminFee = locacoes.reduce((acc, curr) => acc + curr.adminFeeValue, 0);
  const totalOwnerNetPayout = locacoes.reduce((acc, curr) => acc + curr.ownerNetTransfer, 0);

  const getStatusBadge = (status: Locacao['currentMonthStatus']) => {
    switch (status) {
      case 'pago':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pago & Repassado
        </span>;
      case 'em_aberto':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" /> Aguardando Vencimento
        </span>;
      case 'atrasado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Em Atraso
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Contratos Ativos</span>
            <span className="text-2xl font-bold font-serif text-slate-900 mt-1 block">{totalRentals}</span>
            <span className="text-[11px] text-slate-400">100% locações garantidas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Volume de Aluguéis/Mês</span>
            <span className="text-2xl font-bold font-serif text-indigo-600 mt-1 block">
              R$ {totalMonthlyVolume.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-indigo-600 font-medium">Fluxo sob gestão</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Taxa Admin Morada Digital</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">
              R$ {totalAgencyAdminFee.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Receita recorrente mensal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Repasse aos Proprietários</span>
            <span className="text-2xl font-bold font-serif text-slate-800 mt-1 block">
              R$ {totalOwnerNetPayout.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Líquido direto via TED/Pix</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por inquilino, imóvel ou proprietário..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['todos', 'pago', 'em_aberto', 'atrasado'].map(st => (
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
      </div>

      {/* Rentals Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Código / Imóvel</th>
                <th className="py-3 px-4">Inquilino (Locatário)</th>
                <th className="py-3 px-4">Proprietário (Locador)</th>
                <th className="py-3 px-4">Aluguel & Encargos</th>
                <th className="py-3 px-4">Taxa Admin MD</th>
                <th className="py-3 px-4">Repasse Líquido</th>
                <th className="py-3 px-4 text-center">Status Mês</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLocacoes.map(loc => (
                <tr key={loc.id} className="hover:bg-slate-50/80 transition-colors">
                  
                  {/* Property */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <span className="font-mono font-bold text-indigo-700 block">{loc.code}</span>
                    <span className="font-bold text-slate-900 block truncate" title={loc.propertyTitle}>
                      {loc.propertyTitle}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate block">
                      Vencimento: dia {loc.paymentDueDay} • Garantia: {loc.warranty}
                    </span>
                  </td>

                  {/* Tenant */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{loc.tenantName}</span>
                    <a
                      href={`https://wa.me/55${loc.tenantPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(loc.tenantName)}%2C%20lembrete%20do%20aluguel%20Morada%20Digital.`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      {loc.tenantPhone}
                    </a>
                  </td>

                  {/* Owner */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-slate-800 block">{loc.ownerName}</span>
                    <span className="text-[11px] text-slate-500 block">{loc.ownerPhone}</span>
                  </td>

                  {/* Rent */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-900">
                    R$ {loc.monthlyRent.toLocaleString('pt-BR')},00
                    <span className="text-[10px] text-slate-400 block font-normal">
                      + Cond: R$ {loc.condoFee} | IPTU: R$ {loc.iptuMonthly}
                    </span>
                  </td>

                  {/* Admin Fee */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-emerald-700 font-bold">
                    R$ {loc.adminFeeValue.toLocaleString('pt-BR')},00
                    <span className="text-[10px] text-slate-400 block font-normal">
                      ({loc.adminFeePercent}% de taxa)
                    </span>
                  </td>

                  {/* Owner Net Payout */}
                  <td className="py-3.5 px-4 whitespace-nowrap font-bold text-slate-800">
                    R$ {loc.ownerNetTransfer.toLocaleString('pt-BR')},00
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(loc.currentMonthStatus)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {loc.currentMonthStatus !== 'pago' ? (
                        <button
                          onClick={() => updateLocacaoStatus(loc.id, 'pago')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Confirmar Pagamento e Repasse"
                        >
                          Baixar Pago
                        </button>
                      ) : (
                        <button
                          onClick={() => updateLocacaoStatus(loc.id, 'em_aberto')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                          title="Voltar para em aberto"
                        >
                          Estornar
                        </button>
                      )}

                      {/* Edit Rental Financial Data */}
                      <button
                        onClick={() => {
                          setEditingLocacao({ ...loc });
                          setIsEditModalOpen(true);
                        }}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar valores financeiros da locação"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Receipt Modal Trigger */}
                      <button
                        onClick={() => setSelectedReceipt(loc)}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                        title="Emitir Recibo / Extrato de Repasse"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {/* Delete Rental Button */}
                      <button
                        onClick={() => setLocacaoToDelete(loc)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir Contrato de Locação (Diretor / ADM)"
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

      {/* Modal: Recibo e Extrato de Locação */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Recibo & Extrato de Repasse de Aluguel</h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pb-2 border-b border-slate-200">
                <span>Contrato: {selectedReceipt.code}</span>
                <span>Competência: Abril / 2026</span>
              </div>

              <div>
                <strong>Imóvel:</strong> {selectedReceipt.propertyTitle} ({selectedReceipt.propertyCode})
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Locatário (Inquilino)</span>
                  <div className="font-bold text-slate-800">{selectedReceipt.tenantName}</div>
                  <div className="text-slate-500">{selectedReceipt.tenantPhone}</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Locador (Proprietário)</span>
                  <div className="font-bold text-slate-800">{selectedReceipt.ownerName}</div>
                  <div className="text-slate-500">{selectedReceipt.ownerPhone}</div>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>(+) Aluguel Bruto:</span>
                  <span className="font-bold">R$ {selectedReceipt.monthlyRent.toLocaleString('pt-BR')},00</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>(-) Taxa de Administração ({selectedReceipt.adminFeePercent}%):</span>
                  <span>- R$ {selectedReceipt.adminFeeValue.toLocaleString('pt-BR')},00</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-700 text-sm">
                  <span>(=) Repasse Líquido ao Proprietário:</span>
                  <span>R$ {selectedReceipt.ownerNetTransfer.toLocaleString('pt-BR')},00</span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center pt-2">
                {MORADA_BRAND.legalName} • {MORADA_BRAND.creci} • Sede: {MORADA_BRAND.address}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Recibo</span>
              </button>

              <a
                href={`https://wa.me/55${selectedReceipt.tenantPhone.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(selectedReceipt.tenantName)}%2C%20segue%20o%20recibo%20de%20aluguel%20referente%20a%20${selectedReceipt.propertyCode}%20pela%20Morada%20Digital.`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar no WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: EDITAR VALORES FINANCEIROS DA LOCAÇÃO */}
      {isEditModalOpen && editingLocacao && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Editar Valores da Locação ({editingLocacao.code})</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const rent = Number(editingLocacao.monthlyRent);
              const feePct = Number(editingLocacao.adminFeePercent);
              const adminVal = Math.round(rent * (feePct / 100));
              const netTransfer = rent - adminVal;

              updateLocacao(editingLocacao.id, {
                ...editingLocacao,
                adminFeeValue: adminVal,
                ownerNetTransfer: netTransfer
              });
              setIsEditModalOpen(false);
            }} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aluguel Mensal (R$)</label>
                  <input
                    type="number"
                    required
                    value={editingLocacao.monthlyRent}
                    onChange={e => setEditingLocacao({ ...editingLocacao, monthlyRent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taxa Admin (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingLocacao.adminFeePercent}
                    onChange={e => setEditingLocacao({ ...editingLocacao, adminFeePercent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-indigo-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dia Vencimento</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={editingLocacao.paymentDueDay}
                    onChange={e => setEditingLocacao({ ...editingLocacao, paymentDueDay: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condomínio Estimado (R$)</label>
                  <input
                    type="number"
                    value={editingLocacao.condoFee}
                    onChange={e => setEditingLocacao({ ...editingLocacao, condoFee: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">IPTU Mensal (R$)</label>
                  <input
                    type="number"
                    value={editingLocacao.iptuMonthly}
                    onChange={e => setEditingLocacao({ ...editingLocacao, iptuMonthly: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inquilino(a)</label>
                  <input
                    type="text"
                    value={editingLocacao.tenantName}
                    onChange={e => setEditingLocacao({ ...editingLocacao, tenantName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proprietário(a)</label>
                  <input
                    type="text"
                    value={editingLocacao.ownerName}
                    onChange={e => setEditingLocacao({ ...editingLocacao, ownerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Modalidade de Garantia</label>
                <input
                  type="text"
                  value={editingLocacao.warranty}
                  onChange={e => setEditingLocacao({ ...editingLocacao, warranty: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
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
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
                >
                  Salvar Valores da Locação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Rental Confirmation Modal */}
      {locacaoToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Excluir Contrato de Locação?</h3>
              <p className="text-slate-500">
                Deseja excluir a locação <strong>{locacaoToDelete.code}</strong> do imóvel <strong>{locacaoToDelete.propertyTitle}</strong> (Inquilino: {locacaoToDelete.tenantName})?
              </p>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-800 text-[11.5px]">
              O histórico financeiro de repasses e taxa de administração deste imóvel será removido da listagem ativa.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLocacaoToDelete(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteLocacao(locacaoToDelete.id);
                  setLocacaoToDelete(null);
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
