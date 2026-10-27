import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  TrendingUp, 
  Home, 
  Building2, 
  Key, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Percent, 
  DollarSign, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  Coins, 
  ChevronRight,
  Info,
  Clock,
  Phone,
  AlertTriangle,
  FileCheck,
  Building,
  Scale
} from 'lucide-react';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { useRealEstate } from '../../context/RealEstateContext';

export type ProptechTab = 'garantia' | 'comprar_ou_alugar' | 'financiamento' | 'reajuste' | 'preco_inteligente' | 'links_uteis';

interface Props {
  initialTab?: ProptechTab;
  onClose?: () => void;
}

export const ProptechToolsHub: React.FC<Props> = ({ initialTab = 'garantia', onClose }) => {
  const { showToast } = useRealEstate();
  const [activeTab, setActiveTab] = useState<ProptechTab>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --------------------------------------------------------------------------
  // STATE: COMPRAR OU ALUGAR
  // --------------------------------------------------------------------------
  const [buyPropertyPrice, setBuyPropertyPrice] = useState<number>(650000);
  const [buyDownPayment, setBuyDownPayment] = useState<number>(130000); // 20%
  const [buyYears, setBuyYears] = useState<number>(30);
  const [rentMonthlyPrice, setRentMonthlyPrice] = useState<number>(2600); // ~0.4% do valor
  const [cdiReturnAnnual, setCdiReturnAnnual] = useState<number>(10.5); // 10.5% a.a. líquido
  const [propertyAppreciationAnnual, setPropertyAppreciationAnnual] = useState<number>(6.5); // 6.5% a.a.

  // --------------------------------------------------------------------------
  // STATE: SIMULADOR FINANCIAMENTO
  // --------------------------------------------------------------------------
  const [finPropertyPrice, setFinPropertyPrice] = useState<number>(750000);
  const [finDownPayment, setFinDownPayment] = useState<number>(150000);
  const [finYears, setFinYears] = useState<number>(30);
  const [finInterestRate, setFinInterestRate] = useState<number>(9.8); // 9.8% a.a.
  const [finAmortizationType, setFinAmortizationType] = useState<'sac' | 'price'>('sac');
  const [useFgts, setUseFgts] = useState<boolean>(true);
  const [fgtsAmount, setFgtsAmount] = useState<number>(45000);

  // --------------------------------------------------------------------------
  // STATE: REAJUSTE DE ALUGUEL
  // --------------------------------------------------------------------------
  const [reajusteCurrentRent, setReajusteCurrentRent] = useState<number>(2800);
  const [reajusteIndexType, setReajusteIndexType] = useState<'ipca' | 'igpm'>('ipca');
  const [reajusteRateValue, setReajusteRateValue] = useState<number>(4.25); // Ex: IPCA 4.25% ou IGPM

  // --------------------------------------------------------------------------
  // STATE: PREÇO INTELIGENTE (ESTIMADOR POR M²)
  // --------------------------------------------------------------------------
  const [smartNeighborhood, setSmartNeighborhood] = useState<string>('Bairro Arvoredo');
  const [smartArea, setSmartArea] = useState<number>(120);
  const [smartBedrooms, setSmartBedrooms] = useState<number>(3);
  const [smartParking, setSmartParking] = useState<number>(2);
  const [smartStandard, setSmartStandard] = useState<'padrao' | 'alto_padrao' | 'luxo'>('alto_padrao');

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} copiado com sucesso!`, 'Copiado', 'crm');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // ==========================================================================
  // CALCULATIONS: COMPRAR OU ALUGAR
  // ==========================================================================
  const finBuyLoan = Math.max(0, buyPropertyPrice - buyDownPayment);
  const buyMonthlyInterest = (9.8 / 100) / 12;
  const buyTotalMonths = buyYears * 12;
  const buyMonthlyAmortization = finBuyLoan / buyTotalMonths;
  const buyFirstInstallment = Math.round(buyMonthlyAmortization + (finBuyLoan * buyMonthlyInterest));

  // Simulação em 10 anos:
  // Cenário 1: Compra (imóvel valoriza)
  const propertyValueIn10Years = Math.round(buyPropertyPrice * Math.pow(1 + propertyAppreciationAnnual / 100, 10));
  // Cenário 2: Alugar e Investir a entrada + diferença de parcela
  const monthlySavings = Math.max(0, buyFirstInstallment - rentMonthlyPrice);
  const monthlyCdiRate = (cdiReturnAnnual / 100) / 12;
  // Montante da entrada após 10 anos
  const downPaymentInvested10Y = buyDownPayment * Math.pow(1 + monthlyCdiRate, 120);
  // Montante dos aportes mensais após 10 anos
  const savingsInvested10Y = monthlySavings * ((Math.pow(1 + monthlyCdiRate, 120) - 1) / monthlyCdiRate);
  const totalRentingNetWorth10Y = Math.round(downPaymentInvested10Y + savingsInvested10Y);

  // ==========================================================================
  // CALCULATIONS: FINANCIAMENTO DETALHADO
  // ==========================================================================
  const effectiveDownPayment = finDownPayment + (useFgts ? fgtsAmount : 0);
  const totalLoanAmount = Math.max(0, finPropertyPrice - effectiveDownPayment);
  const finMonths = finYears * 12;
  const finMonthlyRate = (finInterestRate / 100) / 12;

  let firstFinInstallment = 0;
  let lastFinInstallment = 0;
  let totalFinPaid = 0;

  if (finAmortizationType === 'sac') {
    const sacAmort = totalLoanAmount / finMonths;
    firstFinInstallment = Math.round(sacAmort + (totalLoanAmount * finMonthlyRate));
    lastFinInstallment = Math.round(sacAmort + (sacAmort * finMonthlyRate));
    totalFinPaid = Math.round((firstFinInstallment + lastFinInstallment) / 2 * finMonths);
  } else {
    // PRICE
    const priceFactor = Math.pow(1 + finMonthlyRate, finMonths);
    const priceInstallment = totalLoanAmount * ((finMonthlyRate * priceFactor) / (priceFactor - 1));
    firstFinInstallment = Math.round(priceInstallment);
    lastFinInstallment = Math.round(priceInstallment);
    totalFinPaid = Math.round(priceInstallment * finMonths);
  }

  const minRequiredIncome = Math.round(firstFinInstallment / 0.30); // Parcela máx 30% da renda

  // ==========================================================================
  // CALCULATIONS: REAJUSTE DE ALUGUEL
  // ==========================================================================
  const reajusteAddition = (reajusteCurrentRent * reajusteRateValue) / 100;
  const reajusteNewRent = reajusteCurrentRent + reajusteAddition;

  // ==========================================================================
  // CALCULATIONS: PREÇO INTELIGENTE (CONTAGEM & ARVOREDO)
  // ==========================================================================
  const basePricePerM2: Record<string, { sale: number; rent: number }> = {
    'Bairro Arvoredo': { sale: 6200, rent: 26 },
    'Eldorado': { sale: 5800, rent: 25 },
    'Cabral': { sale: 6400, rent: 27 },
    'Riacho das Pedras': { sale: 4900, rent: 21 },
    'Fonte Grande': { sale: 4700, rent: 20 },
    'Jardim da Cidade': { sale: 5500, rent: 24 }
  };

  const currentM2 = basePricePerM2[smartNeighborhood] || { sale: 5600, rent: 24 };
  const standardMultiplier = smartStandard === 'luxo' ? 1.35 : smartStandard === 'alto_padrao' ? 1.15 : 1.0;

  const estimatedSalePrice = Math.round(smartArea * currentM2.sale * standardMultiplier);
  const estimatedRentPrice = Math.round(smartArea * currentM2.rent * standardMultiplier);
  const annualRentalYield = ((estimatedRentPrice * 12) / estimatedSalePrice * 100).toFixed(2);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0B2545] to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden border-b border-indigo-900/50">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Inovação Proptech • Garantia Total & Agilidade Digital</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Central de Garantias, Calculadoras & Links Úteis
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Aluguel 100% sem fiador para o inquilino, pagamento garantido todo dia 12 para o proprietário, simuladores de compra/aluguel, cálculo de reajustes e guias contratuais completos.
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-sm cursor-pointer self-start md:self-auto"
            >
              ✕
            </button>
          )}
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex gap-2 mt-6 pt-6 border-t border-slate-800/80 overflow-x-auto text-xs pb-1">
          {[
            { id: 'garantia', label: 'Aluguel Sem Fiador & Proteção', icon: ShieldCheck, badge: 'Garantia Total' },
            { id: 'comprar_ou_alugar', label: 'Comprar ou Alugar?', icon: Scale, badge: 'Simulador' },
            { id: 'financiamento', label: 'Financiamento Imobiliário', icon: Calculator, badge: 'SAC / PRICE' },
            { id: 'reajuste', label: 'Calculadora de Reajuste', icon: Percent, badge: 'IPCA / IGP-M' },
            { id: 'preco_inteligente', label: 'Preço Inteligente por m²', icon: TrendingUp, badge: 'Contagem & BH' },
            { id: 'links_uteis', label: 'Links Úteis & Guias', icon: FileText, badge: 'Cartilha' }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* ===================================================================== */}
        {/* TAB 1: GARANTIA MORADA DIGITAL (ALUGUEL SEM FIADOR) */}
        {/* ===================================================================== */}
        {activeTab === 'garantia' && (
          <div className="space-y-8 animate-in fade-in">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                A Revolução da Locação Residencial em Contagem
              </span>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                Aluguel Sem Fiador para Inquilinos. Pagamento Garantido para Proprietários.
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Com tecnologia de análise de crédito em tempo real e garantias contratuais sólidas, eliminamos a burocracia de pedir fiador com imóveis quitados e a necessidade de desembolsar 3 aluguéis de caução.
              </p>
            </div>

            {/* Comparison Cards: Traditional vs Morada Digital */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Modelo Tradicional Burocrático */}
              <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-rose-200 text-rose-900 font-extrabold text-sm">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Imobiliárias Tradicionais (Modelo Ultrapassado)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Exigência de 2 Fiadores:</strong> Devem possuir imóveis quitados registrados na mesma cidade.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Caução Pesada:</strong> Exigem de 3 a 4 aluguéis adiantados à vista (retendo dinheiro do cliente).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Seguro-Fiança Caro:</strong> Taxa anual de 1 a 2 aluguéis que nunca retorna para o inquilino.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Proprietário Desprotegido:</strong> Se o inquilino atrasar, o proprietário fica sem receber até abrir processo judicial.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span><strong>Semana de espera e cartório:</strong> Reconhecimento de firma presencial e dias para aprovação.</span>
                  </li>
                </ul>
              </div>

              {/* Modelo Morada Digital */}
              <div className="bg-emerald-50/80 border border-emerald-300 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-emerald-300 text-emerald-950 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Morada Digital (Garantia Total & 100% Digital)</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-800">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Zero Fiador & Zero Caução:</strong> O inquilino não precisa pedir favor para ninguém nem travar reserva financeira.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pagamento Garantido Todo Dia 12:</strong> O proprietário recebe o valor do aluguel religiosamente no dia 12, mesmo se o inquilino atrasar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Proteção de até R$ 50.000 para Danos:</strong> Cobertura contra avarias e reparos estruturais ao final da locação mediante laudo de vistoria.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Análise de Crédito em Minutos:</strong> Aprovação rápida por inteligência de dados cadastrais.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Contrato 100% Digital:</strong> Assinatura eletrônica com validade jurídica pelo celular (sem ir a cartório).</span>
                  </li>
                </ul>
              </div>

            </div>

            {/* How It Works for Both Sides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <span className="font-bold text-indigo-700 text-xs uppercase tracking-wider block">Passo a Passo do Inquilino</span>
                <h4 className="font-bold text-slate-900 text-base">Como alugar sem fiador na Morada Digital:</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>1. <strong>Escolha o imóvel</strong> no nosso site no Arvoredo ou Contagem.</p>
                  <p>2. <strong>Envie sua documentação digital:</strong> RG/CNH e comprovante de renda dos últimos 3 meses.</p>
                  <p>3. <strong>Análise de crédito instantânea</strong> pela esteira digital.</p>
                  <p>4. <strong>Assine o contrato digital</strong> e receba as chaves com laudo fotográfico de vistoria.</p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-3">
                <span className="font-bold text-emerald-700 text-xs uppercase tracking-wider block">Passo a Passo do Proprietário</span>
                <h4 className="font-bold text-slate-900 text-base">Como funciona a garantia para quem anuncia:</h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <p>1. <strong>Anúncio gratuito</strong> com fotos em alta resolução nos portais.</p>
                  <p>2. <strong>Filtragem rigorosa:</strong> Apenas inquilinos com crédito aprovado visitam seu imóvel.</p>
                  <p>3. <strong>Recebimento assegurado todo dia 12:</strong> Depósito pontual na sua conta corrente.</p>
                  <p>4. <strong>Assessoria jurídica integral:</strong> Cuidamos de todo o processo de desocupação e cobrança sem custos extras.</p>
                </div>
              </div>

            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0B2545] rounded-3xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-white">Dúvidas sobre o Aluguel sem Fiador?</h4>
                <p className="text-xs text-slate-300 mt-0.5">Fale com nossos consultores de locação e tire suas dúvidas em tempo real.</p>
              </div>

              <a
                href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20gostaria%20de%20entender%20como%20funciona%20o%20Aluguel%20sem%20Fiador%20e%20a%20Garantia%20de%20Recebimento%20da%20Morada%20Digital.`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shrink-0"
              >
                <span>Falar com Consultor de Locação</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: CALCULADORA "COMPRAR OU ALUGAR?"                                */}
        {/* ===================================================================== */}
        {activeTab === 'comprar_ou_alugar' && (
          <div className="space-y-6 animate-in fade-in text-xs">
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <span>Simulador Comparativo: Vale Mais a Pena Comprar ou Alugar?</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Cruze o custo de comprar financiado com o valor de morar de aluguel e investir a economia no CDI/Tesouro Selic.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Input Form Controls */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Valor do Imóvel</span>
                    <span className="text-indigo-600">R$ {buyPropertyPrice.toLocaleString('pt-BR')}</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={3000000}
                    step={25000}
                    value={buyPropertyPrice}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setBuyPropertyPrice(val);
                      setBuyDownPayment(Math.round(val * 0.20));
                      setRentMonthlyPrice(Math.round(val * 0.004));
                    }}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Entrada Disponível</span>
                    <span className="text-emerald-600">R$ {buyDownPayment.toLocaleString('pt-BR')} ({((buyDownPayment/buyPropertyPrice)*100).toFixed(0)}%)</span>
                  </div>
                  <input
                    type="range"
                    min={buyPropertyPrice * 0.10}
                    max={buyPropertyPrice * 0.60}
                    step={10000}
                    value={buyDownPayment}
                    onChange={e => setBuyDownPayment(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>Aluguel de um Imóvel Equivalente</span>
                    <span className="text-slate-900">R$ {rentMonthlyPrice.toLocaleString('pt-BR')}/mês</span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={15000}
                    step={100}
                    value={rentMonthlyPrice}
                    onChange={e => setRentMonthlyPrice(Number(e.target.value))}
                    className="w-full accent-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rendimento Investimentos</label>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                      <input
                        type="number"
                        step={0.5}
                        value={cdiReturnAnnual}
                        onChange={e => setCdiReturnAnnual(Number(e.target.value))}
                        className="w-full outline-none font-bold"
                      />
                      <span className="text-slate-400">% a.a.</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Valorização do Imóvel</label>
                    <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-2 rounded-xl">
                      <input
                        type="number"
                        step={0.5}
                        value={propertyAppreciationAnnual}
                        onChange={e => setPropertyAppreciationAnnual(Number(e.target.value))}
                        className="w-full outline-none font-bold"
                      />
                      <span className="text-slate-400">% a.a.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                  💡 <strong>Parcela inicial estimada de compra:</strong> R$ {buyFirstInstallment.toLocaleString('pt-BR')}/mês. 
                  Economia mensal ao alugar: <strong>R$ {monthlySavings.toLocaleString('pt-BR')}/mês</strong> para investir no mercado financeiro.
                </div>
              </div>

              {/* Simulation Result Comparison */}
              <div className="lg:col-span-7 space-y-4">
                
                <h4 className="font-bold text-slate-900 text-base">Projeção de Patrimônio Acumulado em 10 Anos:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Cenário Compra */}
                  <div className="bg-indigo-50/80 border-2 border-indigo-300 rounded-3xl p-5 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                      Opção 1: Comprar Imóvel
                    </span>
                    <div>
                      <span className="text-xs text-slate-500 block">Patrimônio em Imóvel após 10 anos:</span>
                      <span className="text-2xl font-black text-indigo-950 font-display">
                        R$ {propertyValueIn10Years.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-indigo-200 text-[11.5px] text-slate-700">
                      <p>✓ Imóvel próprio e segurança patrimonial permanente</p>
                      <p>✓ Liberdade total para reformas e personalizações</p>
                      <p>✓ Proteção real contra a inflação e herança familiar</p>
                      <p className="text-rose-700">✕ Desembolso de entrada de R$ {buyDownPayment.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Cenário Alugar */}
                  <div className="bg-teal-50/80 border-2 border-teal-300 rounded-3xl p-5 space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-teal-200 text-teal-900">
                      Opção 2: Alugar & Investir
                    </span>
                    <div>
                      <span className="text-xs text-slate-500 block">Patrimônio Financeiro em 10 anos:</span>
                      <span className="text-2xl font-black text-teal-950 font-display">
                        R$ {totalRentingNetWorth10Y.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-teal-200 text-[11.5px] text-slate-700">
                      <p>✓ Liquidez financeira total no banco / investimentos</p>
                      <p>✓ Flexibilidade para mudar de bairro ou cidade</p>
                      <p>✓ Sem custos de manutenção estrutural ou IPTU no início</p>
                      <p className="text-amber-800">⚠️ Exige disciplina férrea para não gastar o dinheiro investido</p>
                    </div>
                  </div>

                </div>

                {/* Intelligent Verdict Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-2">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Veredito Consultivo da Morada Digital:</span>
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {propertyValueIn10Years > totalRentingNetWorth10Y ? (
                      <>
                        No seu perfil e com a taxa de valorização estimada para bairros nobres de Contagem (como o <strong>Bairro Arvoredo</strong>), a <strong>COMPRA DO IMÓVEL</strong> é financeiramente mais vantajosa a longo prazo, gerando uma valorização sólida e construindo patrimônio para sua família.
                      </>
                    ) : (
                      <>
                        Com as taxas atuais do CDI, <strong>ALUGAR COM A GARANTIA MORADA DIGITAL</strong> e investir com disciplina rigorosa a entrada de R$ {buyDownPayment.toLocaleString('pt-BR')} mais os R$ {monthlySavings.toLocaleString('pt-BR')}/mês de diferença pode gerar uma liquidez financeira maior nos primeiros anos.
                      </>
                    )}
                  </p>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: SIMULADOR DE FINANCIAMENTO COMPLETO (SAC VS PRICE)             */}
        {/* ===================================================================== */}
        {activeTab === 'financiamento' && (
          <div className="space-y-6 animate-in fade-in text-xs">
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <span>Simulador de Financiamento Habitacional (Caixa, Itaú, Bradesco, Santander)</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Planeje a compra do seu imóvel com projeção de parcelas decrescentes (SAC) ou fixas (PRICE) e amortização com FGTS.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Controls */}
              <div className="lg:col-span-5 space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Valor do Imóvel (R$)</label>
                  <input
                    type="number"
                    step={10000}
                    value={finPropertyPrice}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setFinPropertyPrice(val);
                      setFinDownPayment(Math.round(val * 0.20));
                    }}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-sm text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Entrada em Dinheiro</label>
                    <input
                      type="number"
                      step={5000}
                      value={finDownPayment}
                      onChange={e => setFinDownPayment(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-xs text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Prazo em Anos</label>
                    <select
                      value={finYears}
                      onChange={e => setFinYears(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-xs"
                    >
                      <option value={15}>15 anos (180 meses)</option>
                      <option value={20}>20 anos (240 meses)</option>
                      <option value={25}>25 anos (300 meses)</option>
                      <option value={30}>30 anos (360 meses)</option>
                      <option value={35}>35 anos (420 meses)</option>
                    </select>
                  </div>
                </div>

                {/* FGTS Checkbox */}
                <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={useFgts}
                      onChange={e => setUseFgts(e.target.checked)}
                      className="rounded accent-indigo-600"
                    />
                    <span>Usar Saldo do FGTS na Entrada</span>
                  </label>

                  {useFgts && (
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Saldo do FGTS disponível:</span>
                      <input
                        type="number"
                        step={5000}
                        value={fgtsAmount}
                        onChange={e => setFgtsAmount(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl font-bold text-xs text-indigo-700"
                      />
                    </div>
                  )}
                </div>

                {/* System of Amortization */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tabela de Amortização</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFinAmortizationType('sac')}
                      className={`p-2.5 rounded-xl font-bold text-center cursor-pointer border ${
                        finAmortizationType === 'sac'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      SAC (Decrescente)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinAmortizationType('price')}
                      className={`p-2.5 rounded-xl font-bold text-center cursor-pointer border ${
                        finAmortizationType === 'price'
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      PRICE (Fixa)
                    </button>
                  </div>
                </div>

              </div>

              {/* Simulation Results Display */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="bg-gradient-to-br from-slate-900 to-[#0B2545] text-white p-6 rounded-3xl border border-indigo-950 shadow-xl space-y-5">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold block">
                        Resultado da Projeção de Crédito
                      </span>
                      <h4 className="text-xl font-bold font-serif text-white mt-0.5">
                        {finAmortizationType === 'sac' ? 'Tabela SAC (Parcelas Decrescentes)' : 'Tabela PRICE (Parcelas Fixas)'}
                      </h4>
                    </div>

                    <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Taxa ref: {finInterestRate}% a.a.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-400 block">1ª Parcela (Inicial):</span>
                      <span className="text-2xl font-black text-teal-300 font-display">
                        R$ {firstFinInstallment.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {finAmortizationType === 'sac' && (
                      <div>
                        <span className="text-[11px] text-slate-400 block">Última Parcela:</span>
                        <span className="text-2xl font-black text-indigo-200 font-display">
                          R$ {lastFinInstallment.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-[11px] text-slate-400 block">Renda Mínima Recomendada:</span>
                      <span className="text-xl font-bold text-amber-300">
                        R$ {minRequiredIncome.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Valor Total Financiado:</span>
                      <strong className="text-white">R$ {totalLoanAmount.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Entrada Total (Recursos + FGTS):</span>
                      <strong className="text-emerald-400">R$ {effectiveDownPayment.toLocaleString('pt-BR')}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Pago ao final de {finMonths} meses:</span>
                      <strong className="text-indigo-200">R$ {totalFinPaid.toLocaleString('pt-BR')}</strong>
                    </div>
                  </div>
                </div>

                {/* Bank Comparison Table */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                  <span className="font-bold text-slate-900 block text-xs">Comparativo Médio das Principais Instituições:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Caixa</span>
                      <span className="text-emerald-700 font-extrabold text-[13px]">9,79% a.a.</span>
                      <span className="text-[10px] text-slate-400 block">SBPE / Pro-Cotista</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Itaú</span>
                      <span className="text-indigo-700 font-extrabold text-[13px]">10,49% a.a.</span>
                      <span className="text-[10px] text-slate-400 block">Aprovação em 1h</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Bradesco</span>
                      <span className="text-slate-800 font-extrabold text-[13px]">10,59% a.a.</span>
                      <span className="text-[10px] text-slate-400 block">Até 80% do valor</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-800 block">Santander</span>
                      <span className="text-slate-800 font-extrabold text-[13px]">10,99% a.a.</span>
                      <span className="text-[10px] text-slate-400 block">Composição 4 pessoas</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20fiz%20uma%20simula%C3%A7%C3%A3o%20de%20financiamento%20no%20valor%20de%20R%24%20${finPropertyPrice.toLocaleString('pt-BR')}%20com%20parcela%20inicial%20de%20R%24%20${firstFinInstallment.toLocaleString('pt-BR')}%20e%20gostaria%20de%20aprovar%20meu%20cr%C3%A9dito%20pela%20Morada%20Digital.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer text-xs"
                >
                  <span>Solicitar Aprovação Gratuita de Carta de Crédito</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: CALCULADORA DE REAJUSTE DE ALUGUEL (IPCA & IGP-M)               */}
        {/* ===================================================================== */}
        {activeTab === 'reajuste' && (
          <div className="space-y-6 animate-in fade-in text-xs max-w-4xl mx-auto">
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-indigo-600" />
                <span>Calculadora Oficial de Reajuste Anual de Locação</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Calcule com precisão o novo valor do aluguel com base no índice estipulado no contrato (IPCA ou IGP-M) e gere o comunicado para envio formal ao inquilino.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Valor Atual do Aluguel (R$)</label>
                  <input
                    type="number"
                    value={reajusteCurrentRent}
                    onChange={e => setReajusteCurrentRent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Índice Contratual</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReajusteIndexType('ipca');
                        setReajusteRateValue(4.25);
                      }}
                      className={`p-2.5 rounded-xl font-bold cursor-pointer border ${
                        reajusteIndexType === 'ipca' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                      }`}
                    >
                      IPCA (Padrão Morada Digital)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReajusteIndexType('igpm');
                        setReajusteRateValue(3.80);
                      }}
                      className={`p-2.5 rounded-xl font-bold cursor-pointer border ${
                        reajusteIndexType === 'igpm' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                      }`}
                    >
                      IGP-M (FGV)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Percentual Acumulado nos Últimos 12 Meses (%)</label>
                  <input
                    type="number"
                    step={0.1}
                    value={reajusteRateValue}
                    onChange={e => setReajusteRateValue(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Result & Generated Notice */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <span className="text-[11px] uppercase font-bold text-slate-400 block">Novo Valor de Locação Calculado:</span>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-900 font-display">
                      R$ {reajusteNewRent.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-emerald-600 font-bold text-xs">
                      (+ R$ {reajusteAddition.toFixed(2)})
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-500">
                    Aplicação de <strong>{reajusteRateValue}%</strong> ({reajusteIndexType.toUpperCase()}) sobre o aluguel anterior de R$ {reajusteCurrentRent.toLocaleString('pt-BR')},00.
                  </p>
                </div>

                {/* Copyable Message */}
                {(() => {
                  const noticeMsg = `Prezado(a) inquilino(a), comunicamos que, conforme estipulado no Contrato de Locação firmado junto à Imobiliária Morada Digital, o valor mensal do aluguel referente ao imóvel passará por reajuste anual pelo índice ${reajusteIndexType.toUpperCase()} (${reajusteRateValue}%). O valor atual de R$ ${reajusteCurrentRent.toFixed(2)} passa para R$ ${reajusteNewRent.toFixed(2)}, com vigência a partir do próximo boleto. Dúvidas: (31) 3357-3030.`;
                  return (
                    <button
                      onClick={() => copyToClipboard(noticeMsg, 'Comunicado formal de reajuste', 'reajuste-copy')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {copiedKey === 'reajuste-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-300" />}
                      <span>{copiedKey === 'reajuste-copy' ? 'Comunicado Copiado!' : 'Copiar Comunicado para WhatsApp'}</span>
                    </button>
                  );
                })()}

              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: PREÇO INTELIGENTE (ESTIMADOR DE VENDA & ALUGUEL POR M²)        */}
        {/* ===================================================================== */}
        {activeTab === 'preco_inteligente' && (
          <div className="space-y-6 animate-in fade-in text-xs max-w-4xl mx-auto">
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <span>Preço Inteligente por m² (Algoritmo de Precificação de Contagem)</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Descubra a faixa ótima de preço para alugar em até 15 dias ou vender em até 45 dias sem deixar o patrimônio desvalorizado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
              
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Bairro de Localização</label>
                  <select
                    value={smartNeighborhood}
                    onChange={e => setSmartNeighborhood(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-2.5 rounded-xl font-bold"
                  >
                    <option value="Bairro Arvoredo">Bairro Arvoredo (Nobre / Alta Liquidez)</option>
                    <option value="Cabral">Cabral (Próximo ao Shopping Contagem)</option>
                    <option value="Eldorado">Eldorado (Comercial / Metrô)</option>
                    <option value="Jardim da Cidade">Jardim da Cidade</option>
                    <option value="Riacho das Pedras">Riacho das Pedras</option>
                    <option value="Fonte Grande">Fonte Grande</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Área (m²)</label>
                    <input
                      type="number"
                      value={smartArea}
                      onChange={e => setSmartArea(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Quartos</label>
                    <input
                      type="number"
                      value={smartBedrooms}
                      onChange={e => setSmartBedrooms(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Vagas</label>
                    <input
                      type="number"
                      value={smartParking}
                      onChange={e => setSmartParking(Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 p-2 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Padrão de Acabamento & Lazer</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'padrao', label: 'Padrão' },
                      { id: 'alto_padrao', label: 'Alto Padrão' },
                      { id: 'luxo', label: 'Luxo' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setSmartStandard(st.id as any)}
                        className={`p-2 rounded-xl font-bold cursor-pointer border ${
                          smartStandard === st.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Estimate Output */}
              <div className="space-y-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimativa para Locação Rápida:</span>
                  <div className="text-2xl font-black text-indigo-950 font-display">
                    R$ {estimatedRentPrice.toLocaleString('pt-BR')}<span className="text-xs font-normal">/mês</span>
                  </div>
                  <span className="inline-block text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Tempo médio de locação: 11 a 16 dias
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimativa para Venda Assertiva:</span>
                  <div className="text-2xl font-black text-slate-900 font-display">
                    R$ {estimatedSalePrice.toLocaleString('pt-BR')}
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Rentabilidade (Yield Anual):</span>
                    <strong className="text-emerald-700 font-bold">{annualRentalYield}% ao ano</strong>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ===================================================================== */}
        {/* TAB 6: LINKS ÚTEIS & CARTILHAS DO MERCADO IMOBILIÁRIO                 */}
        {/* ===================================================================== */}
        {activeTab === 'links_uteis' && (
          <div className="space-y-8 animate-in fade-in text-xs">
            
            <div className="border-b pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>Central de Links Úteis, Guias Práticos & Divisão de Condomínio</span>
              </h3>
              <p className="text-slate-500 mt-1">
                Transparência completa sobre direitos e deveres na locação e na compra, certidões e órgãos oficiais.
              </p>
            </div>

            {/* Divisão de Despesas de Condomínio (Ordinárias vs Extraordinárias) */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Tabela Prática: O que o Inquilino Paga vs O que o Proprietário Deve Reembolsar</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Despesas Ordinárias (Inquilino) */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-blue-900 text-xs pb-2 border-b border-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>DESPESAS ORDINÁRIAS (De responsabilidade do INQUILINO)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11.5px]">
                    <li>• Salários, encargos trabalhistas e previdenciários de funcionários do prédio.</li>
                    <li>• Consumo de água, gás e energia elétrica das áreas comuns.</li>
                    <li>• Limpeza, conservação e pintura das áreas de uso comum de rotina.</li>
                    <li>• Manutenção de elevadores, bombas d'água, interfones e portões elétricos.</li>
                    <li>• Reposição do fundo de reserva usado integralmente em despesas ordinárias.</li>
                  </ul>
                </div>

                {/* Despesas Extraordinárias (Proprietário) */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-5 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-xs pb-2 border-b border-amber-200">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>DESPESAS EXTRAORDINÁRIAS (De responsabilidade do PROPRIETÁRIO)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11.5px]">
                    <li>• Obras de reformas estruturais ou ampliações do edifício.</li>
                    <li>• Pintura geral da fachada, empenas, iluminação externa ou esquadrias externas.</li>
                    <li>• Constituição inicial de Fundo de Reserva.</li>
                    <li>• Instalação de novos equipamentos de segurança, câmeras ou portaria remota.</li>
                    <li>• Indenizações trabalhistas e previdenciárias de empregados anteriores à locação.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Document Checklists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">Checklist de Documentos para Alugar (Sem Burocracia):</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>✓ RG ou CNH digital com CPF do titular</li>
                  <li>✓ Comprovante de residência atual</li>
                  <li>✓ Comprovante de renda dos últimos 3 meses (Holerite, Extrato Bancário ou IRPF)</li>
                  <li>✓ Aprovação de crédito digital em até 1 hora</li>
                </ul>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">Checklist de Certidões Obrigatórias para Venda Segura:</span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  <li>✓ Matrícula Atualizada com Inteiro Teor e Ônus Reais (menos de 30 dias)</li>
                  <li>✓ Certidão Negativa de Débitos Municipais (IPTU Contagem)</li>
                  <li>✓ CNDs Federais (Receita Federal e PGFN)</li>
                  <li>✓ Certidão de Distribuição Cível e Trabalhista (Anti-Fraude à Execução)</li>
                </ul>
              </div>

            </div>

            {/* Official External Links Directory */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 text-xs block">Diretório de Links Oficiais & Consultas Rápidas:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: 'CRECI-MG Oficial', desc: 'Consulta de corretores credenciados e imobiliárias', url: 'https://crecimg.gov.br' },
                  { name: 'Prefeitura de Contagem (IPTU)', desc: 'Emissão de certidões e 2ª via de débitos prediais', url: 'https://contagem.mg.gov.br' },
                  { name: 'Simulador Habitacional Caixa', desc: 'Simulação oficial do programa Minha Casa Minha Vida e SBPE', url: 'http://www.caixa.gov.br' },
                  { name: 'Cartório de Registro de Imóveis', desc: 'Emissão de matrículas e ônus reais online', url: 'https://registradores.onr.org.br' },
                  { name: 'Calculadora de Inflação (IBGE/IPCA)', desc: 'Índice de preços ao consumidor amplo', url: 'https://ibge.gov.br' },
                  { name: 'Índice Geral de Preços (FGV/IGP-M)', desc: 'Variações oficiais de inflação do aluguel', url: 'https://portalibre.fgv.br' },
                ].map((item, idx) => (
                  <a
                    key={idx}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl transition-all flex items-start justify-between group shadow-2xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 text-xs block group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
