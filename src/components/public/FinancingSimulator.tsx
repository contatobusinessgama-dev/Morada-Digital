import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, ArrowRight, CheckCircle2, DollarSign, Percent, ShieldCheck, Sparkles, PieChart } from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';

export const FinancingSimulator: React.FC = () => {
  const { addLead, showToast } = useRealEstate();

  const [propertyPrice, setPropertyPrice] = useState(3200000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [termYears, setTermYears] = useState(30);
  const [interestRateYear, setInterestRateYear] = useState(10.2); // % a.a.
  const [tableSystem, setTableSystem] = useState<'SAC' | 'PRICE'>('SAC');

  // Contact capture inside simulator
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [leadCreated, setLeadCreated] = useState(false);

  // Calculations
  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPayment;
  const totalMonths = termYears * 12;
  const monthlyRate = interestRateYear / 100 / 12;

  // Price installment
  const priceInstallment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  // SAC first installment: (Loan / months) + (Loan * monthlyRate)
  const sacAmortization = loanAmount / totalMonths;
  const sacFirstInstallment = sacAmortization + (loanAmount * monthlyRate);
  const sacLastInstallment = sacAmortization + (sacAmortization * monthlyRate);

  const displayFirstInstallment = tableSystem === 'SAC' ? sacFirstInstallment : priceInstallment;
  const displayLastInstallment = tableSystem === 'SAC' ? sacLastInstallment : priceInstallment;
  const requiredIncome = displayFirstInstallment / 0.3; // 30% max debt commitment in Brazil

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSimulateWithBroker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      phone,
      budgetMax: propertyPrice,
      interestType: 'venda',
      stage: 'novo',
      origin: 'site_direto',
      notes: `Simulação de Financiamento: Imóvel ${formatCurrency(propertyPrice)}, Entrada ${downPaymentPercent}% (${formatCurrency(downPayment)}), Prazo ${termYears} anos (${tableSystem}), Parcela inicial ${formatCurrency(displayFirstInstallment)}.`
    });

    setLeadCreated(true);
    showToast('Proposta de crédito solicitada com sucesso!', 'Simulação Concluída', 'success');
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 md:p-10 shadow-2xl max-w-5xl mx-auto relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5" /> Simulador de Crédito Imobiliário Caixa, Itaú & Santander
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white">
            Descubra as Parcelas do seu Novo Imóvel
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Simulação dinâmica com taxas de mercado em tempo real.
          </p>
        </div>

        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTableSystem('SAC')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tableSystem === 'SAC' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tabela SAC (Decrescente)
          </button>
          <button
            onClick={() => setTableSystem('PRICE')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tableSystem === 'PRICE' ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tabela PRICE (Fixa)
          </button>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders and Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Valor do Imóvel */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>Valor do Imóvel Selecionado</span>
              <span className="text-base font-extrabold text-amber-400">{formatCurrency(propertyPrice)}</span>
            </div>
            <input
              type="range"
              min={300000}
              max={15000000}
              step={100000}
              value={propertyPrice}
              onChange={e => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>R$ 300 mil</span>
              <span>R$ 15M+</span>
            </div>
          </div>

          {/* Entrada */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-2">
              <span>Valor da Entrada ({downPaymentPercent}%)</span>
              <span className="text-base font-extrabold text-emerald-400">{formatCurrency(downPayment)}</span>
            </div>
            <input
              type="range"
              min={15}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={e => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
              <span>Mínimo 15%</span>
              <span>Até 60%</span>
            </div>
          </div>

          {/* Prazo em Anos & Taxa de Juros */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Prazo de Financiamento
              </label>
              <select
                value={termYears}
                onChange={e => setTermYears(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value={15}>15 Anos (180 meses)</option>
                <option value={20}>20 Anos (240 meses)</option>
                <option value={25}>25 Anos (300 meses)</option>
                <option value={30}>30 Anos (360 meses)</option>
                <option value={35}>35 Anos (420 meses)</option>
              </select>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                Taxa de Juros Estimada
              </label>
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white">
                <input
                  type="number"
                  step="0.1"
                  value={interestRateYear}
                  onChange={e => setInterestRateYear(Number(e.target.value))}
                  className="w-16 bg-transparent outline-none"
                />
                <span className="text-amber-400">% a.a.</span>
              </div>
            </div>
          </div>

          {/* Graphical Proportional Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                Entrada: {downPaymentPercent}% ({formatCurrency(downPayment)})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Financiado: {100 - downPaymentPercent}% ({formatCurrency(loanAmount)})
              </span>
            </div>
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${downPaymentPercent}%` }}
              />
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${100 - downPaymentPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Results & Action Card */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div>
            <span className="text-[11px] uppercase font-bold text-amber-400 tracking-wider block">
              Primeira Parcela Estimada ({tableSystem})
            </span>
            <div className="text-3xl font-extrabold font-display text-white mt-1">
              {formatCurrency(displayFirstInstallment)}
            </div>
            {tableSystem === 'SAC' && (
              <p className="text-xs text-slate-400 mt-1">
                Última parcela: <span className="text-emerald-400 font-semibold">{formatCurrency(displayLastInstallment)}</span>
              </p>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Saldo a Financiar:</span>
              <span className="font-bold text-white">{formatCurrency(loanAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Renda Bruta Sugerida:</span>
              <span className="font-bold text-amber-400">{formatCurrency(requiredIncome)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Amortização Mensal:</span>
              <span className="font-semibold text-white">{tableSystem === 'SAC' ? formatCurrency(sacAmortization) : 'Tabela Price'}</span>
            </div>
          </div>

          {/* Quick Lead Form */}
          <div className="pt-4 border-t border-slate-800">
            {leadCreated ? (
              <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-2xl text-center text-emerald-300 text-xs space-y-1">
                <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
                <p className="font-bold">Simulação enviada para nossos corretores!</p>
                <p className="text-[11px]">Você receberá uma proposta com as menores taxas dos bancos.</p>
              </div>
            ) : (
              <form onSubmit={handleSimulateWithBroker} className="space-y-3">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quer aprovação de crédito sem burocracia?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-slate-900 border border-slate-700 px-3 py-2 text-xs rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="WhatsApp"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-700 px-3 py-2 text-xs rounded-xl text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <span>Receber Proposta Bancária Oficial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
