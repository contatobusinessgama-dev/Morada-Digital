import React, { useState } from 'react';
import { 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Download, 
  ShieldCheck, 
  AlertCircle,
  Building,
  Edit3,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Proposal, ProposalStatus } from '../../types';

export const ProposalsManager: React.FC = () => {
  const { proposals, updateProposalStatus, updateProposal, deleteProposal, showToast } = useRealEstate();
  const [selectedProposalForContract, setSelectedProposalForContract] = useState<any | null>(null);

  // Edit Proposal Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const [editLeadName, setEditLeadName] = useState('');
  const [editLeadPhone, setEditLeadPhone] = useState('');
  const [editOfferedPrice, setEditOfferedPrice] = useState<number>(0);
  const [editDownPayment, setEditDownPayment] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<ProposalStatus>('em_analise');
  const [editCommissionRate, setEditCommissionRate] = useState<number>(6);

  // Delete Confirmation State
  const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);

  const handleOpenEdit = (p: Proposal) => {
    setEditingProposal(p);
    setEditLeadName(p.leadName);
    setEditLeadPhone(p.leadPhone);
    setEditOfferedPrice(p.offeredPrice);
    setEditDownPayment(p.downPayment);
    setEditStatus(p.status);
    setEditCommissionRate(p.commissionRate || 6);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProposal) return;

    const commTotal = (editOfferedPrice * editCommissionRate) / 100;
    const commAgency = (commTotal * 60) / 100;
    const commBroker = (commTotal * 40) / 100;

    updateProposal(editingProposal.id, {
      leadName: editLeadName,
      leadPhone: editLeadPhone,
      offeredPrice: Number(editOfferedPrice),
      downPayment: Number(editDownPayment),
      status: editStatus,
      commissionRate: Number(editCommissionRate),
      commissionTotal: commTotal,
      commissionAgencyPart: commAgency,
      commissionBrokerPart: commBroker
    });

    setIsEditModalOpen(false);
    setEditingProposal(null);
  };

  const handleConfirmDelete = () => {
    if (!proposalToDelete) return;
    deleteProposal(proposalToDelete.id);
    setProposalToDelete(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case 'contrato_assinado':
        return <span className="bg-green-100 text-green-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Contrato Assinado</span>;
      case 'aceita':
        return <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Proposta Aceita</span>;
      case 'contraproposta':
        return <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Contraproposta</span>;
      case 'recusada':
        return <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Recusada</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px]">Em Análise Jurídica</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Gestão de Propostas & Contratos</h2>
          <p className="text-xs text-slate-500">
            Acompanhamento de ofertas comerciais, divisão de comissão da imobiliária e minutas contratuais.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-700 font-medium">Comissão Padrão: 6% (Repasse automático no fechamento)</span>
        </div>
      </div>

      {/* Proposals Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {proposals.map(proposal => {
          const discountPercent = ((proposal.propertyAskingPrice - proposal.offeredPrice) / proposal.propertyAskingPrice * 100).toFixed(1);

          return (
            <div key={proposal.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-mono text-xs font-bold text-slate-500 block">{proposal.code}</span>
                  <h3 className="font-bold text-sm text-slate-900">{proposal.leadName}</h3>
                  <span className="text-xs text-slate-500">{proposal.leadPhone}</span>
                </div>
                {getStatusBadge(proposal.status)}
              </div>

              {/* Property Linked */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  Imóvel: {proposal.propertyCode}
                </span>
                <p className="font-semibold text-slate-800 line-clamp-1">{proposal.propertyTitle}</p>
                <div className="flex justify-between mt-1 text-slate-500 text-[11px]">
                  <span>Valor Pedido: {formatCurrency(proposal.propertyAskingPrice)}</span>
                  <span className="font-bold text-rose-600">Diferença: -{discountPercent}%</span>
                </div>
              </div>

              {/* Offer & Payment Details */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Valor Ofertado</span>
                  <span className="text-base font-extrabold text-slate-900">{formatCurrency(proposal.offeredPrice)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Sinal / Entrada</span>
                  <span className="text-base font-bold text-emerald-600">{formatCurrency(proposal.downPayment)}</span>
                </div>
              </div>

              {/* Commission Breakdown */}
              <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/50 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Comissão Total ({proposal.commissionRate}%):</span>
                  <span>{formatCurrency(proposal.commissionTotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>• Imobiliária (Morada Digital):</span>
                  <span className="font-semibold">{formatCurrency(proposal.commissionAgencyPart)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>• Corretor ({proposal.brokerName}):</span>
                  <span className="font-semibold text-emerald-700">{formatCurrency(proposal.commissionBrokerPart)}</span>
                </div>
              </div>

              {/* Status & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  {proposal.status !== 'contrato_assinado' && (
                    <button
                      onClick={() => updateProposalStatus(proposal.id, 'contrato_assinado')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Aprovar & Assinar
                    </button>
                  )}
                  {proposal.status === 'em_analise' && (
                    <button
                      onClick={() => updateProposalStatus(proposal.id, 'contraproposta')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Contraproposta
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProposalForContract(proposal)}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Minuta</span>
                  </button>

                  {/* Director / Admin Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(proposal)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Editar Proposta (Apenas Diretor / Gestor)"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Director / Admin Delete Button */}
                  <button
                    onClick={() => setProposalToDelete(proposal)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Excluir Proposta Definitivamente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL: EDITAR PROPOSTA (DIRETOR / ADM)                                    */}
      {/* ========================================================================= */}
      {isEditModalOpen && editingProposal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Editar Proposta Comercial</h3>
                  <span className="text-[11px] font-mono text-slate-500">Ref: {editingProposal.code}</span>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Proponente</label>
                  <input
                    type="text"
                    required
                    value={editLeadName}
                    onChange={e => setEditLeadName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editLeadPhone}
                    onChange={e => setEditLeadPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Ofertado (R$)</label>
                  <input
                    type="number"
                    required
                    value={editOfferedPrice}
                    onChange={e => setEditOfferedPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sinal / Arras (R$)</label>
                  <input
                    type="number"
                    required
                    value={editDownPayment}
                    onChange={e => setEditDownPayment(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status da Proposta</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as ProposalStatus)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold"
                  >
                    <option value="em_analise">Em Análise</option>
                    <option value="aceita">Aceita</option>
                    <option value="contraproposta">Contraproposta</option>
                    <option value="recusada">Recusada</option>
                    <option value="contrato_assinado">Contrato Assinado</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Taxa de Comissão (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={editCommissionRate}
                    onChange={e => setEditCommissionRate(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 font-bold"
                  />
                </div>
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
      {/* MODAL: CONFIRMAR EXCLUSÃO DE PROPOSTA                                      */}
      {/* ========================================================================= */}
      {proposalToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-4 text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900">Excluir Proposta Comercial?</h3>
              <p className="text-slate-500">
                Tem certeza que deseja excluir permanentemente a proposta <strong>{proposalToDelete.code}</strong> de <strong>{proposalToDelete.leadName}</strong>?
              </p>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-800 text-[11px]">
              Esta ação removerá a proposta da listagem geral e não poderá ser desfeita.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProposalToDelete(null)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Preview Modal */}
      {selectedProposalForContract && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Minuta Padrão de Compromisso de Compra e Venda</h3>
                <span className="text-xs font-mono text-slate-500">Ref: {selectedProposalForContract.code} • Morada Digital (CRECI 104.900-J)</span>
              </div>
              <button onClick={() => setSelectedProposalForContract(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 font-serif text-xs text-slate-700 leading-relaxed space-y-3.5">
              <p className="font-bold uppercase text-center text-slate-900 border-b pb-2">
                INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE BEM IMÓVEL
              </p>
              <p>
                <strong>PROMITENTE COMPRADOR:</strong> {selectedProposalForContract.leadName}, telefone {selectedProposalForContract.leadPhone}.
              </p>
              <p>
                <strong>OBJETO:</strong> O imóvel matriculado sob código {selectedProposalForContract.propertyCode}, denominado <em>"{selectedProposalForContract.propertyTitle}"</em>, situado na circunscrição imobiliária competente.
              </p>
              <p>
                <strong>PREÇO E CONDIÇÕES:</strong> O valor total acordado é de <strong>{formatCurrency(selectedProposalForContract.offeredPrice)}</strong>, sendo pago a título de sinal o montante de <strong>{formatCurrency(selectedProposalForContract.downPayment)}</strong> e o saldo remanescente na lavratura da Escritura Pública Definitiva.
              </p>
              
              {/* Cláusulas da Apostila Definitiva */}
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60 font-sans space-y-2 text-[11px] text-amber-950">
                <p>
                  <strong>CLÁUSULA PENAL POR DESISTÊNCIA (SINAL / ARRAS):</strong> Caso o COMPRADOR desista da compra por motivo injustificado, perderá o valor dado como sinal e arras em favor do VENDEDOR. Caso o VENDEDOR desista da venda, deverá devolver o valor do sinal em dobro ao COMPRADOR, acrescido de correção monetária e multa de 10% sobre o valor total do negócio.
                </p>
                <p>
                  <strong>CLÁUSULA DE IMISSÃO NA POSSE:</strong> A posse definitiva do imóvel será transmitida ao COMPRADOR somente após a quitação total do preço ajustado e a lavratura da Escritura Pública de Compra e Venda no Cartório de Notas.
                </p>
              </div>

              <p>
                <strong>INTERMEDIAÇÃO IMOBILIÁRIA:</strong> Fica convencionada a taxa de comissão de {selectedProposalForContract.commissionRate || 6}% sobre o valor da transação em favor da Imobiliária Morada Digital e do corretor credenciado {selectedProposalForContract.brokerName}, sob a responsabilidade técnica do Diretor Daniel Gama (CRECI 68.165-F).
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedProposalForContract(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert('Minuta gerada com as cláusulas de Arras e Imissão na Posse! Enviada para análise jurídica e e-mail do cliente.');
                  setSelectedProposalForContract(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Minuta em PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
