import React, { useState } from 'react';
import { 
  FilePenLine, 
  FileText, 
  ShieldCheck, 
  Printer, 
  MessageCircle, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Download, 
  Share2, 
  Building, 
  User, 
  Scale,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { Contrato, ContratoStatus } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const ContractsManager: React.FC = () => {
  const { 
    contratos, 
    addContrato, 
    updateContratoStatus, 
    properties, 
    clientes, 
    currentUser,
    showToast 
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'lista' | 'modelos'>('lista');
  const [selectedContrato, setSelectedContrato] = useState<Contrato | null>(contratos[0] || null);
  const [selectedTemplateType, setSelectedTemplateType] = useState<'venda' | 'locacao_residencial' | 'locacao_comercial'>('venda');
  
  // New Contract Modal
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [newType, setNewType] = useState<Contrato['type']>('venda');
  const [newPropertyId, setNewPropertyId] = useState(properties[0]?.id || '');
  const [newClientName, setNewClientName] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerCpf, setNewOwnerCpf] = useState('');
  const [newValue, setNewValue] = useState<number>(3500000);
  const [newMonthlyRent, setNewMonthlyRent] = useState<number>(15000);
  const [newWarranty, setNewWarranty] = useState<Contrato['warrantyType']>('seguro_fianca');
  const [newAdjustment, setNewAdjustment] = useState<Contrato['adjustmentIndex']>('IPCA');
  const [newStartDate, setNewStartDate] = useState('2026-05-01');
  const [newEndDate, setNewEndDate] = useState('2029-04-30');

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === newPropertyId) || properties[0];

    addContrato({
      type: newType,
      propertyId: prop.id,
      propertyCode: prop.code,
      propertyTitle: prop.title,
      clientName: newClientName || 'Cliente Contratante',
      clientCpf: newClientCpf || '000.000.000-00',
      ownerName: newOwnerName || 'Proprietário Titular',
      ownerCpf: newOwnerCpf || '111.111.111-11',
      brokerName: currentUser.name,
      value: newType === 'venda' ? newValue : (newMonthlyRent * 36),
      monthlyRent: newType !== 'venda' ? newMonthlyRent : undefined,
      warrantyType: newWarranty,
      adjustmentIndex: newAdjustment,
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'aguardando_assinatura',
      notes: 'Contrato gerado com base no modelo jurídico padrão da Morada Digital.'
    });

    setIsNewContractModalOpen(false);
    showToast('Contrato emitido com sucesso e pronto para assinaturas.', 'Contratos', 'success');
  };

  const getStatusBadge = (status: ContratoStatus) => {
    switch (status) {
      case 'vigente':
      case 'assinado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {status === 'vigente' ? 'Vigente' : 'Assinado'}
        </span>;
      case 'aguardando_assinatura':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" /> Aguardando Assinaturas
        </span>;
      case 'minuta':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
          Minuta Preliminar
        </span>;
      case 'encerrado':
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
          Encerrado
        </span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Selector & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('lista')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'lista'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Contratos Ativos & Minutas ({contratos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('modelos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'modelos'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Modelos Jurídicos Atualizados</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsNewContractModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Emitir Novo Contrato</span>
        </button>
      </div>

      {/* VIEW 1: CONTRACTS LIST & VIEWER */}
      {activeTab === 'lista' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Contracts Sidebar List */}
          <div className="lg:col-span-5 space-y-3">
            {contratos.map(ctr => {
              const isSelected = selectedContrato?.id === ctr.id;
              const typeLabel = ctr.type === 'venda' ? 'Compra e Venda' : 'Locação Residencial';

              return (
                <div
                  key={ctr.id}
                  onClick={() => setSelectedContrato(ctr)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-indigo-600 block">
                        {ctr.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                        {typeLabel}
                      </span>
                    </div>
                    {getStatusBadge(ctr.status)}
                  </div>

                  <p className="text-xs text-slate-600 font-medium truncate mb-2">
                    {ctr.propertyTitle}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <span>Partes: {ctr.clientName.split(' ')[0]} x {ctr.ownerName.split(' ')[0]}</span>
                    <span className="font-bold text-slate-800">
                      R$ {(ctr.value / 1000).toLocaleString('pt-BR')}k
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contract Document Preview */}
          <div className="lg:col-span-7">
            {selectedContrato ? (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                
                {/* Header of Contract Document */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 block mb-0.5">
                      {MORADA_BRAND.legalName} • {MORADA_BRAND.creci}
                    </span>
                    <h2 className="text-lg font-bold font-serif text-slate-900">
                      {selectedContrato.type === 'venda'
                        ? 'Contrato de Compromisso de Compra e Venda de Imóvel'
                        : 'Contrato de Locação Residencial com Garantia'}
                    </h2>
                    <span className="text-xs text-slate-500 font-mono">
                      Registro: {selectedContrato.code} • Imóvel: {selectedContrato.propertyCode}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors cursor-pointer"
                      title="Imprimir minuta"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://wa.me/?text=Ol%C3%A1%2C%20segue%20a%20minuta%20do%20contrato%20${selectedContrato.code}%20pela%20Morada%20Digital.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                      title="Compartilhar minuta no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Status Switcher for testing lifecycle */}
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700">Status do Documento:</span>
                  <div className="flex items-center gap-1.5">
                    {(['minuta', 'aguardando_assinatura', 'assinado', 'vigente'] as ContratoStatus[]).map(st => (
                      <button
                        key={st}
                        onClick={() => updateContratoStatus(selectedContrato.id, st)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                          selectedContrato.status === st
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legal Body Preview */}
                <div className="text-xs text-slate-700 space-y-4 max-h-[550px] overflow-y-auto pr-2 leading-relaxed font-serif">
                  
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans space-y-1.5">
                    <div><strong>PROMITENTE COMPRADOR(A) / LOCATÁRIO(A):</strong> {selectedContrato.clientName}, CPF nº {selectedContrato.clientCpf}.</div>
                    <div><strong>PROMITENTE VENDEDOR(A) / LOCADOR(A):</strong> {selectedContrato.ownerName}, CPF nº {selectedContrato.ownerCpf}.</div>
                    <div><strong>INTERMEDIADORA:</strong> {MORADA_BRAND.legalName}, com sede operacional na {MORADA_BRAND.address}, {MORADA_BRAND.creci}.</div>
                  </div>

                  <p>
                    <strong>CLÁUSULA PRIMEIRA – DO OBJETO:</strong> O presente contrato tem por objeto o imóvel matriculado sob a referência da <strong>Morada Digital</strong> sob o código <strong>{selectedContrato.propertyCode}</strong>, denominado <em>"{selectedContrato.propertyTitle}"</em>, com todas as suas benfeitorias, instalações e pertenças descritas no laudo de vistoria.
                  </p>

                  <p>
                    <strong>CLÁUSULA SEGUNDA – DO VALOR E FORMA DE PAGAMENTO:</strong> O valor total ajustado entre as partes é de <strong>R$ {selectedContrato.value.toLocaleString('pt-BR')},00</strong> ({selectedContrato.type === 'venda' ? 'valor irrevogável de venda com quitação de sinal e saldo bancário' : `equivalente a ${selectedContrato.monthlyRent ? 'R$ ' + selectedContrato.monthlyRent.toLocaleString('pt-BR') + ' mensais' : 'aluguel pactuado'}`}), com índice de reajuste anual pelo <strong>{selectedContrato.adjustmentIndex}</strong> nos termos da legislação brasileira vigente.
                  </p>

                  <p>
                    <strong>CLÁUSULA TERCEIRA – DAS CERTIDÕES E DUE DILIGENCE:</strong> A <strong>Morada Digital</strong> atesta que foram emitidas certidões de praxe negativas de débitos municipais, estaduais, federais, trabalhistas (CNDT) e forenses para a garantia jurídica plena e transparência da transação.
                  </p>

                  <p>
                    <strong>CLÁUSULA QUARTA – DA ASSINATURA ELETRÔNICA:</strong> As partes expressamente reconhecem e aceitam a utilização de assinaturas eletrônicas com validade legal nos termos da MP nº 2.200-2/2001 e Lei Federal nº 14.063/2020.
                  </p>

                  <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-6 text-center font-sans text-[11px] text-slate-500">
                    <div className="border-t border-slate-300 pt-2">
                      <span className="font-bold text-slate-800 block">{selectedContrato.clientName}</span>
                      <span>Comprador(a) / Locatário(a)</span>
                    </div>
                    <div className="border-t border-slate-300 pt-2">
                      <span className="font-bold text-slate-800 block">{selectedContrato.ownerName}</span>
                      <span>Vendedor(a) / Locador(a)</span>
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
                Selecione um contrato para visualizar a minuta.
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: MODELOS JURÍDICOS ATUALIZADOS */}
      {activeTab === 'modelos' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Em conformidade com a Lei nº 8.245/91, Lei nº 13.786/18 e Código Civil</span>
              </div>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Biblioteca de Minutas e Modelos Jurídicos Morada Digital
              </h2>
              <p className="text-xs text-slate-500">
                Textos jurídicos integrais prontos para preenchimento com segurança jurídica e combate a inadimplemento.
              </p>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedTemplateType('venda')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplateType === 'venda'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1. Compra & Venda (Arras)
              </button>
              <button
                onClick={() => setSelectedTemplateType('locacao_residencial')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplateType === 'locacao_residencial'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2. Locação Residencial (Lei 8.245)
              </button>
              <button
                onClick={() => setSelectedTemplateType('locacao_comercial')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedTemplateType === 'locacao_comercial'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3. Locação Comercial
              </button>
            </div>
          </div>

          {/* Model Content Render */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 max-h-[600px] overflow-y-auto font-serif text-xs leading-relaxed text-slate-800 space-y-4">
            
            {selectedTemplateType === 'venda' && (
              <>
                <h3 className="font-bold text-center text-sm font-sans uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
                  INSTRUMENTO PARTICULAR DE COMPROMISSO DE VENDA E COMPRA DE IMÓVEL COM SINAL E PRINCÍPIO DE PAGAMENTO
                </h3>
                
                <p className="font-sans text-[11px] text-slate-500">
                  <em>Base Legal: Artigos 417 a 420 (Arras) e 481 a 532 do Código Civil Brasileiro; Lei Federal nº 4.591/64; Lei Federal nº 13.786/2018 (Lei do Distrato Imobiliário).</em>
                </p>

                <p>
                  <strong>DAS PARTES:</strong><br />
                  <strong>PROMITENTE VENDEDOR(A):</strong> [Nome do Proprietário Vendedor], nacionalidade, estado civil, profissão, portador da cédula de identidade RG nº [...], inscrito no CPF/MF sob o nº [...], residente e domiciliado em [...];<br />
                  <strong>PROMITENTE COMPRADOR(A):</strong> [Nome do Comprador], nacionalidade, estado civil, profissão, portador do RG nº [...], inscrito no CPF/MF sob o nº [...], residente e domiciliado em [...];<br />
                  <strong>INTERVENIENTE ANUENTE E CORRETORA DE IMÓVEIS:</strong> {MORADA_BRAND.legalName}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na {MORADA_BRAND.address}, {MORADA_BRAND.creci}, neste ato representada por seus corretores habilitados.
                </p>

                <p>
                  <strong>CLÁUSULA 1ª – DO IMÓVEL:</strong> O PROMITENTE VENDEDOR é o legítimo senhor e possuidor, a justo título, livre e desembaraçado de quaisquer ônus, hipotecas, penhoras, dívidas fiscais ou tributárias, do imóvel [Descrever endereço completo, número da matrícula, Cartório de Registro de Imóveis competente e inscrição cadastral de IPTU].
                </p>

                <p>
                  <strong>CLÁUSULA 2ª – DO PREÇO E DAS CONDIÇÕES DE PAGAMENTO:</strong> O preço total, certo e ajustado para a presente transação imobiliária é de R$ [Valor por extenso], que será adimplido da seguinte forma:<br />
                  a) Sinal e princípio de pagamento (Arras penitenciais nos termos do art. 417 do Código Civil): R$ [Valor do Sinal], pago nesta data via transferência Pix/TED na conta designada do PROMITENTE VENDEDOR ou conta Escrow intermediada pela Morada Digital;<br />
                  b) Recursos próprios / Saldo devedor: R$ [Valor], na data da lavratura da escritura definitiva;<br />
                  c) Financiamento imobiliário / Liberação de FGTS: R$ [Valor], mediante contrato de financiamento com força de escritura pública junto à instituição financeira conveniada.
                </p>

                <p>
                  <strong>CLÁUSULA 3ª – DA POSSE E ENTREGA DAS CHAVES:</strong> A posse precária ou definitiva do imóvel será transferida ao PROMITENTE COMPRADOR na data da outorga da escritura pública de compra e venda ou do registro do contrato de financiamento bancário, com todas as taxas de condomínio e IPTU devidamente quitadas até a data da imissão na posse.
                </p>

                <p>
                  <strong>CLÁUSULA 4ª – DA DUE DILIGENCE JURÍDICA E CERTIDÕES:</strong> O PROMITENTE VENDEDOR obriga-se a apresentar, no prazo improrrogável de 15 (quinze) dias úteis, as certidões negativas de praxe: CND Federal/Previdenciária, CND Estadual, CND Municipal de Tributos Imobiliários, Certidão Negativa de Débitos Trabalhistas (CNDT), Certidões dos Distribuidores Cíveis e Criminais da Justiça Estadual e Federal, Certidões dos Cartórios de Protestos de Títulos dos últimos 5 anos, e declaração de quitação condominial emitida pelo síndico com ata de eleição.
                </p>

                <p>
                  <strong>CLÁUSULA 5ª – DA COMISSÃO DE CORRETAGEM:</strong> Pelos serviços de intermediação imobiliária, mediação e aproximação útil das partes, fica ajustada a comissão de corretagem à {MORADA_BRAND.legalName} no percentual de 6% (seis por cento) sobre o valor total da venda, devida em consonância com os arts. 722 a 729 do Código Civil Brasileiro.
                </p>

                <p>
                  <strong>CLÁUSULA 6ª – DO FORO:</strong> As partes elegem a Comarca de Contagem/MG (ou da localização do imóvel) para dirimir qualquer dúvida ou litígio oriundo do presente contrato.
                </p>
              </>
            )}

            {selectedTemplateType === 'locacao_residencial' && (
              <>
                <h3 className="font-bold text-center text-sm font-sans uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
                  CONTRATO DE LOCAÇÃO RESIDENCIAL URBANA COM GARANTIA LOCATÍCIA
                </h3>
                
                <p className="font-sans text-[11px] text-slate-500">
                  <em>Base Legal: Lei Federal nº 8.245 de 18 de Outubro de 1991 (Lei do Inquilinato), com as alterações introduzidas pela Lei Federal nº 12.112/2009 e Código Civil.</em>
                </p>

                <p>
                  <strong>CLÁUSULA 1ª – DO PRAZO:</strong> O prazo da locação é de 30 (trinta) meses, com início em [Data Inicial] e término em [Data Final], data em que o LOCATÁRIO se obriga a restituir o imóvel completamente desocupado e em perfeito estado de conservação, conforme laudo de vistoria inicial.
                  <br />
                  <em>Parágrafo Único:</em> Fica convencionado que, após o cumprimento de 12 (doze) meses ininterruptos de locação, o LOCATÁRIO ficará isento da multa rescisória, desde que notifique o LOCADOR por escrito com antecedência mínima de 30 (trinta) dias.
                </p>

                <p>
                  <strong>CLÁUSULA 2ª – DO VALOR DO ALUGUEL E REAJUSTE:</strong> O aluguel mensal inicial é de R$ [Valor do aluguel mensal], a ser pago impreterivelmente até o dia 10 (dez) de cada mês vincendo, mediante boleto bancário ou chave Pix emitida pela <strong>Morada Digital</strong>.
                  <br />
                  <em>Parágrafo Primeiro:</em> O valor do aluguel será reajustado anualmente pela variação positiva acumulada do <strong>IPCA (Índice Nacional de Preços ao Consumidor Amplo)</strong> calculado pelo IBGE, ou, em sua ausência, pelo IGP-M da FGV.
                </p>

                <p>
                  <strong>CLÁUSULA 3ª – DOS ENCARGOS DA LOCAÇÃO:</strong> Caberá exclusivamente ao LOCATÁRIO, além do aluguel: as despesas ordinárias de condomínio, parcelas de IPTU do período da locação, contas de consumo de energia elétrica, gás e água, bem como a contratação de Seguro Contra Incêndio Obrigatório.
                </p>

                <p>
                  <strong>CLÁUSULA 4ª – DA GARANTIA LOCATÍCIA (Art. 37 da Lei 8.245/91):</strong> Para garantia fiel de todas as obrigações assumidas neste pacto, adota-se a modalidade de <strong>Seguro Fiança Locatícia</strong> (ou Fiador idôneo proprietário de bem de raiz / Caução em dinheiro depositada em caderneta de poupança vinculada).
                </p>

                <p>
                  <strong>CLÁUSULA 5ª – DA RESCISÃO E MULTA PENAL:</strong> O descumprimento de qualquer cláusula implicará na rescisão do contrato e cobrança de multa penal equivalente a 3 (três) aluguéis vigentes, calculada de forma rigorosamente proporcional ao tempo restante de contrato, nos exatos termos do artigo 4º da Lei nº 8.245/91.
                </p>
              </>
            )}

            {selectedTemplateType === 'locacao_comercial' && (
              <>
                <h3 className="font-bold text-center text-sm font-sans uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-200">
                  CONTRATO DE LOCAÇÃO NÃO-RESIDENCIAL / COMERCIAL COM CLÁUSULA DE DESTINAÇÃO EXCLUSIVA
                </h3>
                
                <p className="font-sans text-[11px] text-slate-500">
                  <em>Base Legal: Artigos 51 a 57 da Lei Federal nº 8.245/1991 (Direito de Renovação Compulsória e Prazos Específicos para Atividades Empresariais).</em>
                </p>

                <p>
                  <strong>CLÁUSULA 1ª – DA DESTINAÇÃO:</strong> O imóvel destina-se estrita e exclusivamente para fins comerciais de [Especificar ramo de atividade comercial, e.g., consultório, escritório de tecnologia, showroom comercial], vedada qualquer alteração de ramo de atividade ou destinação residencial sem anuência prévia e expressa do LOCADOR.
                </p>

                <p>
                  <strong>CLÁUSULA 2ª – DOS ALVARÁS E LICENÇAS:</strong> É de responsabilidade exclusiva do LOCATÁRIO a obtenção, manutenção e pagamento de taxas relativas a Alvarás de Funcionamento, Licenças Sanitárias, AVCB (Auto de Vistoria do Corpo de Bombeiros) e licenças ambientais necessárias à sua atividade econômica.
                </p>
              </>
            )}

          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Sede Operacional: {MORADA_BRAND.address} • Central de Contratos: {MORADA_BRAND.phone}
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Modelo Completo</span>
              </button>

              <button
                onClick={() => {
                  setIsNewContractModalOpen(true);
                  setNewType(selectedTemplateType === 'venda' ? 'venda' : selectedTemplateType);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Preencher Minuta com Cliente Real</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Modal: Emitir Novo Contrato */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <FilePenLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Emitir Novo Contrato Jurídico</h3>
                  <span className="text-xs text-slate-500">Morada Digital • Modelos Atualizados 2026</span>
                </div>
              </div>
              <button 
                onClick={() => setIsNewContractModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Contrato</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="venda">Compromisso de Compra e Venda</option>
                    <option value="locacao_residencial">Locação Residencial (Lei 8.245/91)</option>
                    <option value="locacao_comercial">Locação Comercial / Não-Residencial</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Imóvel Vinculado</label>
                  <select
                    value={newPropertyId}
                    onChange={e => setNewPropertyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>[{p.code}] {p.title.slice(0, 35)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Comprador / Inquilino</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dr. Eduardo Siqueira"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF do Comprador / Inquilino</label>
                  <input
                    type="text"
                    required
                    placeholder="249.810.748-12"
                    value={newClientCpf}
                    onChange={e => setNewClientCpf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Proprietário / Vendedor</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Duarte Prado"
                    value={newOwnerName}
                    onChange={e => setNewOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF do Proprietário</label>
                  <input
                    type="text"
                    required
                    placeholder="183.920.401-90"
                    value={newOwnerCpf}
                    onChange={e => setNewOwnerCpf(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {newType === 'venda' ? (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valor Total da Venda (R$)</label>
                  <input
                    type="number"
                    required
                    value={newValue}
                    onChange={e => setNewValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valor do Aluguel Mensal (R$)</label>
                    <input
                      type="number"
                      required
                      value={newMonthlyRent}
                      onChange={e => setNewMonthlyRent(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Garantia Locatícia</label>
                    <select
                      value={newWarranty}
                      onChange={e => setNewWarranty(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="seguro_fianca">Seguro Fiança (Porto Seguro)</option>
                      <option value="caucao">Caução em Dinheiro (3 Aluguéis)</option>
                      <option value="titulo_capitalizacao">Título de Capitalização</option>
                      <option value="fiador">Fiador com Imóvel Próprio</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Índice Reajuste</label>
                  <select
                    value={newAdjustment}
                    onChange={e => setNewAdjustment(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  >
                    <option value="IPCA">IPCA (Recomendado)</option>
                    <option value="IGPM">IGP-M</option>
                    <option value="INPC">INPC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Início</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={e => setNewStartDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Término</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={e => setNewEndDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/20"
                >
                  Gerar Minuta Oficial
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
