import React, { useState } from 'react';
import { 
  Megaphone, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Share2, 
  Copy, 
  MessageCircle, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Pause,
  Play,
  MapPin,
  Phone
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { MarketingCampaign } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { askBrokerAI } from '../../services/aiBrokerService';

export const MarketingManager: React.FC = () => {
  const { marketingCampaigns, toggleCampaignStatus, properties, showToast } = useRealEstate();

  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedNetwork, setSelectedNetwork] = useState<'instagram' | 'whatsapp' | 'portais'>('instagram');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const totalLeads = marketingCampaigns.reduce((acc, c) => acc + c.leadsGenerated, 0);
  const totalSpent = marketingCampaigns.reduce((acc, c) => acc + c.spent, 0);
  const avgCpl = (totalSpent / (totalLeads || 1)).toFixed(2);
  const avgRoas = (marketingCampaigns.reduce((acc, c) => acc + c.roas, 0) / marketingCampaigns.length).toFixed(1);

  const handleGeneratePost = async () => {
    const prop = properties.find(p => p.id === selectedPropertyId) || properties[0];
    setIsGenerating(true);

    const prompt = `Gere uma copy irresistível de marketing imobiliário para divulgação no ${selectedNetwork.toUpperCase()} do seguinte imóvel:
Código: ${prop.code}
Título: ${prop.title}
Tipo: ${prop.type}
Bairro/Cidade: ${prop.neighborhood}, ${prop.city}
Valor: R$ ${(prop.price / 1000).toLocaleString('pt-BR')}k
Destaques: ${prop.features.slice(0, 4).join(', ')}

Dados da imobiliária que DEVEM constar na assinatura:
Morada Digital - 100% Digital • Lançamento 2026
Sede Operacional: ${MORADA_BRAND.address} • CEP: ${MORADA_BRAND.cep}
WhatsApp para agendamentos: ${MORADA_BRAND.phone}
${MORADA_BRAND.creci}

Inclua hashtags estratégicas e chamada para ação no WhatsApp.`;

    const result = await askBrokerAI(prompt, 'Marketing Morada Digital');
    setGeneratedPost(result);
    setIsGenerating(false);
  };

  const copyPost = () => {
    navigator.clipboard.writeText(generatedPost);
    showToast('Post copiado com sucesso!', 'Marketing', 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Leads Gerados</span>
            <span className="text-2xl font-bold font-serif text-slate-900 mt-1 block">{totalLeads}</span>
            <span className="text-[11px] text-emerald-600 font-bold">+28% neste mês</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Investimento Total</span>
            <span className="text-2xl font-bold font-serif text-indigo-600 mt-1 block">
              R$ {totalSpent.toLocaleString('pt-BR')}
            </span>
            <span className="text-[11px] text-slate-400">Meta Ads & Google Ads</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Custo Médio / Lead (CPL)</span>
            <span className="text-2xl font-bold font-serif text-emerald-600 mt-1 block">
              R$ {avgCpl}
            </span>
            <span className="text-[11px] text-emerald-600 font-bold">Abaixo da média de mercado</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">ROAS Médio</span>
            <span className="text-2xl font-bold font-serif text-purple-600 mt-1 block">
              {avgRoas}x
            </span>
            <span className="text-[11px] text-slate-400">Retorno sobre investimento</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Campaigns Table & Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Campaigns Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Campanhas em Veiculação</h3>
              <span className="text-xs text-slate-500">Métricas de captação digital</span>
            </div>
            <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">
              ● Tráfego Ativo
            </span>
          </div>

          <div className="space-y-3">
            {marketingCampaigns.map(camp => (
              <div
                key={camp.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {camp.channel.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      camp.status === 'ativa' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {camp.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">{camp.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1">"{camp.headline}"</p>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Leads</span>
                    <strong className="text-slate-900">{camp.leadsGenerated}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">CPL</span>
                    <strong className="text-emerald-600">R$ {camp.cpl.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">ROAS</span>
                    <strong className="text-indigo-600">{camp.roas}x</strong>
                  </div>

                  <button
                    onClick={() => toggleCampaignStatus(camp.id)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                    title={camp.status === 'ativa' ? 'Pausar campanha' : 'Ativar campanha'}
                  >
                    {camp.status === 'ativa' ? <Pause className="w-4 h-4 text-amber-600" /> : <Play className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Copy & Marketing Generator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Gerador de Copies & Anúncios IA</span>
            </h3>
            <span className="text-xs text-slate-500">Crie textos prontos com a assinatura oficial da Morada Digital</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Imóvel para Divulgação</label>
              <select
                value={selectedPropertyId}
                onChange={e => setSelectedPropertyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>[{p.code}] {p.title.slice(0, 30)}...</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Rede Social / Canal</label>
              <div className="grid grid-cols-3 gap-2">
                {(['instagram', 'whatsapp', 'portais'] as const).map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSelectedNetwork(n)}
                    className={`py-2 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                      selectedNetwork === n
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Criando Copy Persuasiva...' : 'Gerar Anúncio com IA'}</span>
            </button>

            {generatedPost && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-700 text-[11px]">Texto do Anúncio Gerado:</span>
                  <button
                    onClick={copyPost}
                    className="text-indigo-600 hover:underline flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </button>
                </div>

                <div className="text-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto pr-1 text-[11px] leading-relaxed">
                  {generatedPost}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
