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
  Phone,
  Plus,
  Edit3,
  Trash2,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Video,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { MarketingCampaign, SocialMediaConfig } from '../../types';
import { MORADA_BRAND } from '../../data/mockDatabase';
import { askBrokerAI } from '../../services/aiBrokerService';
import { DailyPostGenerator } from './DailyPostGenerator';
import { LeadCaptureAIAssistant } from './LeadCaptureAIAssistant';

export const MarketingManager: React.FC = () => {
  const { 
    marketingCampaigns, 
    addMarketingCampaign,
    updateMarketingCampaign,
    deleteMarketingCampaign,
    toggleCampaignStatus, 
    properties, 
    socialMediaConfig,
    updateSocialMediaConfig,
    showToast 
  } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'post_diario' | 'captacao_ia' | 'campanhas' | 'redes_sociais' | 'ia_copies'>('post_diario');

  // Modal: Nova Campanha
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<MarketingCampaign['channel']>('meta_ads');
  const [budget, setBudget] = useState<number>(3000);
  const [spent, setSpent] = useState<number>(500);
  const [leadsGenerated, setLeadsGenerated] = useState<number>(20);
  const [headline, setHeadline] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [status, setStatus] = useState<MarketingCampaign['status']>('ativa');

  // Modal: Editar Campanha
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);

  // Social Media Local Form State
  const [socialForm, setSocialForm] = useState<SocialMediaConfig>(socialMediaConfig);

  // AI Copy State
  const [selectedPropertyId, setSelectedPropertyId] = useState(properties[0]?.id || '');
  const [selectedNetwork, setSelectedNetwork] = useState<'instagram' | 'whatsapp' | 'portais'>('instagram');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const totalLeads = marketingCampaigns.reduce((acc, c) => acc + c.leadsGenerated, 0);
  const totalSpent = marketingCampaigns.reduce((acc, c) => acc + c.spent, 0);
  const avgCpl = (totalSpent / (totalLeads || 1)).toFixed(2);
  const avgRoas = (marketingCampaigns.reduce((acc, c) => acc + c.roas, 0) / (marketingCampaigns.length || 1)).toFixed(1);

  const handleOpenCreateModal = () => {
    setName('');
    setChannel('meta_ads');
    setBudget(3500);
    setSpent(0);
    setLeadsGenerated(0);
    setHeadline('Encontre o imóvel ideal em Contagem com a Morada Digital.');
    setTargetAudience('Famílias e compradores qualificados em Contagem e Grande BH');
    setLinkUrl('https://wa.me/5531984279865');
    setStatus('ativa');
    setIsCreateModalOpen(true);
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || budget <= 0) return;

    const cpl = leadsGenerated > 0 ? Number((spent / leadsGenerated).toFixed(2)) : 0;
    const roas = spent > 0 ? Number(((spent * 8.5) / spent).toFixed(1)) : 10.0;

    addMarketingCampaign({
      name,
      channel,
      budget,
      spent,
      leadsGenerated,
      cpl,
      roas,
      status,
      headline,
      targetAudience,
      linkUrl
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEditModal = (camp: MarketingCampaign) => {
    setEditingCampaign({ ...camp });
    setIsEditModalOpen(true);
  };

  const handleSaveEditCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;

    const cpl = editingCampaign.leadsGenerated > 0 
      ? Number((editingCampaign.spent / editingCampaign.leadsGenerated).toFixed(2)) 
      : 0;

    updateMarketingCampaign(editingCampaign.id, {
      ...editingCampaign,
      cpl
    });

    setIsEditModalOpen(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id: string, campName: string) => {
    if (confirm(`Deseja remover a campanha "${campName}"?`)) {
      deleteMarketingCampaign(id);
    }
  };

  const handleSaveSocialMedia = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialMediaConfig(socialForm);
  };

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
Telefone Fixo: (31) 3357-3030 • WhatsApp: ${MORADA_BRAND.whatsapp}
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
            <span className="text-[11px] text-slate-400">Meta Ads, Google & Portais</span>
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
            <span className="text-[11px] text-emerald-600 font-bold">Otimizado para Contagem</span>
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

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('post_diario')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'post_diario'
              ? 'border-amber-500 text-amber-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Post Diário com IA (Logo + Telefones)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            Redes Sociais
          </span>
        </button>

        <button
          onClick={() => setActiveTab('captacao_ia')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'captacao_ia'
              ? 'border-indigo-600 text-indigo-600 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4 text-indigo-600" />
          <span>Assistente de Captação IA</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold">
            4 Módulos
          </span>
        </button>

        <button
          onClick={() => setActiveTab('campanhas')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'campanhas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Campanhas de Tráfego & Anúncios</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-normal">
            {marketingCampaigns.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('redes_sociais')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'redes_sociais'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Cadastrar & Editar Redes Sociais</span>
        </button>

        <button
          onClick={() => setActiveTab('ia_copies')}
          className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'ia_copies'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Gerador de Copies Rápidas</span>
        </button>
      </div>

      {/* TAB 0.1: POST DIÁRIO COM IA (LOGO E TELEFONES OBRIGATÓRIOS) */}
      {activeTab === 'post_diario' && (
        <DailyPostGenerator />
      )}

      {/* TAB 0.2: ASSISTENTE DE IA PARA CAPTAÇÃO TOTAL DE CLIENTES */}
      {activeTab === 'captacao_ia' && (
        <LeadCaptureAIAssistant />
      )}

      {/* TAB 1: CAMPANHAS DE TRÁFEGO */}
      {activeTab === 'campanhas' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Campanhas em Veiculação</h3>
              <p className="text-xs text-slate-500">Controle de orçamento, custos por lead e links de captação</p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Nova Campanha</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketingCampaigns.map(camp => (
              <div
                key={camp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-3 shadow-xs"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {camp.channel.replace('_', ' ')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        camp.status === 'ativa' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : camp.status === 'pausada' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {camp.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{camp.name}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleCampaignStatus(camp.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                      title={camp.status === 'ativa' ? 'Pausar campanha' : 'Ativar campanha'}
                    >
                      {camp.status === 'ativa' ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                    <button
                      onClick={() => handleOpenEditModal(camp)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-indigo-50 text-indigo-600 cursor-pointer"
                      title="Editar campanha de marketing"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-500 cursor-pointer"
                      title="Excluir campanha"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  "{camp.headline}"
                </p>

                {camp.targetAudience && (
                  <div className="text-[11px] text-slate-500">
                    <strong>Público:</strong> {camp.targetAudience}
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs text-center">
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">Verba</span>
                    <strong className="text-slate-800">R$ {camp.budget}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">Investido</span>
                    <strong className="text-slate-800">R$ {camp.spent}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">Leads</span>
                    <strong className="text-emerald-700">{camp.leadsGenerated}</strong>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50">
                    <span className="text-[10px] text-slate-400 block">ROAS</span>
                    <strong className="text-indigo-700">{camp.roas}x</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CADASTRAR & EDITAR REDES SOCIAIS DA IMOBILIÁRIA */}
      {activeTab === 'redes_sociais' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-display">
                Configuração de Redes Sociais & Presença Digital
              </h3>
              <p className="text-xs text-slate-500">
                Cadastre e edite os links oficiais que aparecem no site, campanhas e cartões digitais da Morada Digital
              </p>
            </div>

            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ● Central Contagem / MG
            </div>
          </div>

          <form onSubmit={handleSaveSocialMedia} className="space-y-6 text-xs">
            
            {/* Social Networks Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram Oficial</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={socialForm.instagramUrl}
                    onChange={e => setSocialForm({ ...socialForm, instagramUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="https://instagram.com/moradadigital.imoveis"
                  />
                  {socialForm.instagramUrl && (
                    <a href={socialForm.instagramUrl} target="_blank" rel="noreferrer" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Página no Facebook</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={socialForm.facebookUrl}
                    onChange={e => setSocialForm({ ...socialForm, facebookUrl: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                    placeholder="https://facebook.com/moradadigital.mg"
                  />
                  {socialForm.facebookUrl && (
                    <a href={socialForm.facebookUrl} target="_blank" rel="noreferrer" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4 text-rose-600" />
                  <span>Canal no YouTube (Vídeos & Tours)</span>
                </label>
                <input
                  type="url"
                  value={socialForm.youtubeUrl}
                  onChange={e => setSocialForm({ ...socialForm, youtubeUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="https://youtube.com/@moradadigital.oficial"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-slate-900" />
                  <span>Perfil no TikTok</span>
                </label>
                <input
                  type="url"
                  value={socialForm.tiktokUrl}
                  onChange={e => setSocialForm({ ...socialForm, tiktokUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="https://tiktok.com/@moradadigital"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Linkedin className="w-4 h-4 text-sky-700" />
                  <span>LinkedIn Corporativo</span>
                </label>
                <input
                  type="url"
                  value={socialForm.linkedinUrl}
                  onChange={e => setSocialForm({ ...socialForm, linkedinUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="https://linkedin.com/company/morada-digital-imoveis"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Business (Número Principal)</span>
                </label>
                <input
                  type="text"
                  value={socialForm.whatsappBusinessNumber}
                  onChange={e => setSocialForm({ ...socialForm, whatsappBusinessNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
                  placeholder="(31) 98427-9865"
                />
              </div>

            </div>

            {/* Slogan and Tracking Pixels */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <span className="font-bold text-slate-800 text-xs block">
                Bio das Redes & IDs de Conversão (Pixel)
              </span>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio / Slogan de Redes Sociais</label>
                <input
                  type="text"
                  value={socialForm.bioSlogan}
                  onChange={e => setSocialForm({ ...socialForm, bioSlogan: e.target.value })}
                  className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  placeholder="Morada Digital • 100% Digital • Imóveis selecionados em Contagem e Grande BH."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Meta Pixel ID (Facebook Ads)</label>
                  <input
                    type="text"
                    value={socialForm.metaPixelId}
                    onChange={e => setSocialForm({ ...socialForm, metaPixelId: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    placeholder="PIXEL-MD-882914"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Google Analytics 4 ID (GA4)</label>
                  <input
                    type="text"
                    value={socialForm.googleAnalyticsId}
                    onChange={e => setSocialForm({ ...socialForm, googleAnalyticsId: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    placeholder="G-MD94820194"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Google Tag Manager (GTM)</label>
                  <input
                    type="text"
                    value={socialForm.googleTagManagerId}
                    onChange={e => setSocialForm({ ...socialForm, googleTagManagerId: e.target.value })}
                    className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono"
                    placeholder="GTM-MD84920"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Redes Sociais & Tags</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: GERADOR DE COPIES COM IA */}
      {activeTab === 'ia_copies' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 max-w-2xl">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Gerador de Copies & Anúncios IA</span>
            </h3>
            <span className="text-xs text-slate-500">Crie textos persuasivos com a assinatura oficial da Morada Digital (Tel: 31 3357-3030 e WhatsApp)</span>
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
                  <option key={p.id} value={p.id}>[{p.code}] {p.title.slice(0, 40)}...</option>
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
      )}

      {/* MODAL: CADASTRAR NOVA CAMPANHA */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Cadastrar Nova Campanha de Tráfego</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Anúncio Casa Alto Padrão Arvoredo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canal / Rede</label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="meta_ads">Meta Ads (Instagram / Facebook)</option>
                    <option value="google_ads">Google Ads (Busca & Rede Display)</option>
                    <option value="portal_zap">ZAP Imóveis</option>
                    <option value="portal_vivareal">VivaReal</option>
                    <option value="whatsapp">Disparo WhatsApp / Lista VIP</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="youtube">YouTube Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="ativa">Ativa (Veiculando)</option>
                    <option value="pausada">Pausada</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orçamento (R$)</label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={e => setBudget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Investido (R$)</label>
                  <input
                    type="number"
                    value={spent}
                    onChange={e => setSpent(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leads</label>
                  <input
                    type="number"
                    value={leadsGenerated}
                    onChange={e => setLeadsGenerated(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline / Chamada do Anúncio</label>
                <input
                  type="text"
                  placeholder="Ex: More no melhor ponto do Bairro Arvoredo com vista definitiva."
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Público-Alvo / Segmentação</label>
                <input
                  type="text"
                  placeholder="Ex: Famílias de 30 a 55 anos, interessados em imóveis de alto padrão em Contagem/BH"
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
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
                  className="px-5 py-2 font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md"
                >
                  Gravar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CAMPANHA (TUDO) */}
      {isEditModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                <span>Editar Campanha de Marketing</span>
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveEditCampaign} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Campanha</label>
                <input
                  type="text"
                  required
                  value={editingCampaign.name}
                  onChange={e => setEditingCampaign({ ...editingCampaign, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Canal / Rede</label>
                  <select
                    value={editingCampaign.channel}
                    onChange={e => setEditingCampaign({ ...editingCampaign, channel: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="meta_ads">Meta Ads (Instagram / Facebook)</option>
                    <option value="google_ads">Google Ads</option>
                    <option value="portal_zap">ZAP Imóveis</option>
                    <option value="portal_vivareal">VivaReal</option>
                    <option value="whatsapp">WhatsApp / Lista VIP</option>
                    <option value="tiktok">TikTok Ads</option>
                    <option value="youtube">YouTube Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingCampaign.status}
                    onChange={e => setEditingCampaign({ ...editingCampaign, status: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  >
                    <option value="ativa">Ativa</option>
                    <option value="pausada">Pausada</option>
                    <option value="concluida">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orçamento (R$)</label>
                  <input
                    type="number"
                    value={editingCampaign.budget}
                    onChange={e => setEditingCampaign({ ...editingCampaign, budget: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gasto Atual (R$)</label>
                  <input
                    type="number"
                    value={editingCampaign.spent}
                    onChange={e => setEditingCampaign({ ...editingCampaign, spent: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Leads Gerados</label>
                  <input
                    type="number"
                    value={editingCampaign.leadsGenerated}
                    onChange={e => setEditingCampaign({ ...editingCampaign, leadsGenerated: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={editingCampaign.headline}
                  onChange={e => setEditingCampaign({ ...editingCampaign, headline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Público-Alvo</label>
                <input
                  type="text"
                  value={editingCampaign.targetAudience || ''}
                  onChange={e => setEditingCampaign({ ...editingCampaign, targetAudience: e.target.value })}
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
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
