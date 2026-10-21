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
  Percent
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Comissao } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const CommissionsManager: React.FC = () => {
  const { comissoes, updateComissaoStatus, team } = useRealEstate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

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

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Total de Honorários</span>
            <span className="text-2xl font-bold font-serif text-slate-900 mt-1 block">
              R$ {totalComissoesValor.toLocaleString('pt-BR')}
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
              R$ {totalAgencyShare.toLocaleString('pt-BR')}
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
              R$ {totalBrokersPayout.toLocaleString('pt-BR')}
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
              R$ {totalPago.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Pagamentos efetuados</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
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

        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
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
                <th className="py-3 px-4 text-right">Ação</th>
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
                      {com.status === 'a_receber' && (
                        <button
                          onClick={() => updateComissaoStatus(com.id, 'liberado')}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Liberar
                        </button>
                      )}

                      {com.status === 'liberado' && (
                        <button
                          onClick={() => updateComissaoStatus(com.id, 'pago')}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Pagar
                        </button>
                      )}

                      {com.status === 'pago' && (
                        <button
                          onClick={() => window.print()}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                          title="Imprimir demonstrativo"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
