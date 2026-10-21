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
  Building
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { ProposalStatus } from '../../types';

export const ProposalsManager: React.FC = () => {
  const { proposals, updateProposalStatus } = useRealEstate();
  const [selectedProposalForContract, setSelectedProposalForContract] = useState<any | null>(null);

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

              {/* Status Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex gap-1.5">
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

                <button
                  onClick={() => setSelectedProposalForContract(proposal)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gerar Minuta</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Contract Preview Modal */}
      {selectedProposalForContract && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Minuta Padrão de Compromisso de Compra e Venda</h3>
                <span className="text-xs font-mono text-slate-500">Ref: {selectedProposalForContract.code}</span>
              </div>
              <button onClick={() => setSelectedProposalForContract(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-serif text-xs text-slate-700 leading-relaxed space-y-3">
              <p className="font-bold uppercase text-center text-slate-900">
                INSTRUMENTO PARTICULAR DE PROMESSA DE COMPRA E VENDA DE BEM IMÓVEL
              </p>
              <p>
                <strong>PROMITENTE COMPRADOR:</strong> {selectedProposalForContract.leadName}, telefone {selectedProposalForContract.leadPhone}.
              </p>
              <p>
                <strong>OBJETO:</strong> O imóvel matriculado sob código {selectedProposalForContract.propertyCode}, denominado <em>"{selectedProposalForContract.propertyTitle}"</em>.
              </p>
              <p>
                <strong>PREÇO E CONDIÇÕES:</strong> O valor total acordado é de <strong>{formatCurrency(selectedProposalForContract.offeredPrice)}</strong>, sendo pago como sinal o montante de <strong>{formatCurrency(selectedProposalForContract.downPayment)}</strong> e o saldo remanescente na lavratura da Escritura Pública Definitiva.
              </p>
              <p>
                <strong>INTERMEDIAÇÃO IMOBILIÁRIA:</strong> Fica convencionada a taxa de comissão de 6% sobre o valor da transação em favor da Imobiliária Morada Digital e do corretor {selectedProposalForContract.brokerName}.
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
                  alert('Minuta gerada em PDF e enviada para o e-mail do cliente e departamento jurídico.');
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
