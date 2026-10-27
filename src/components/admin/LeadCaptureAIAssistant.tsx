import React, { useState } from 'react';
import { 
  Sparkles, 
  UserPlus, 
  Building, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Phone, 
  PhoneCall,
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  Mic, 
  Lightbulb, 
  Flame, 
  RefreshCw, 
  DollarSign, 
  MapPin, 
  Layers,
  ChevronRight,
  Target,
  FileText,
  UserCheck
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  askCaptureAI, 
  parseLeadFromRawText, 
  generateOwnerListingPitch, 
  ParsedLeadData, 
  OwnerCapturePitch 
} from '../../services/aiLeadCaptureService';
import { MORADA_BRAND } from '../../data/mockDatabase';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const LeadCaptureAIAssistant: React.FC<{ onNavigateToLeads?: () => void }> = ({ onNavigateToLeads }) => {
  const { leads, addLead, currentUser, showToast } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'triagem' | 'angariacao' | 'compradores' | 'copiloto'>('triagem');

  // --- TAB 1: TRIAGEM INTELIGENTE STATE ---
  const [rawText, setRawText] = useState(`Oi boa tarde! Vi a placa no Bairro Arvoredo. Me chamo Thiago Souza e estou procurando uma casa com 4 quartos e piscina pra comprar até 1.8 milhão. Meu whats é (31) 99234-8899. Tenho urgência pra mudar ainda este semestre.`);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedLead, setParsedLead] = useState<ParsedLeadData | null>(null);

  // --- TAB 2: ANGARIAÇÃO DE PROPRIETÁRIO STATE ---
  const [ownerName, setOwnerName] = useState('Eduardo Fontes');
  const [ownerNeighborhood, setOwnerNeighborhood] = useState('Bairro Arvoredo');
  const [ownerPropertyType, setOwnerPropertyType] = useState('Casa em Condomínio');
  const [ownerSource, setOwnerSource] = useState<'placa_rua' | 'olx_particular' | 'indicacao' | 'rede_social'>('placa_rua');
  const [isGeneratingOwnerPitch, setIsGeneratingOwnerPitch] = useState(false);
  const [ownerPitch, setOwnerPitch] = useState<OwnerCapturePitch | null>(null);

  // --- TAB 3: SCRIPTS DE COMPRADORES STATE ---
  const [buyerStrategy, setBuyerStrategy] = useState<'abordagem_fria' | 'reativacao' | 'followup_sumido' | 'convite_vip'>('abordagem_fria');
  const [buyerLeadName, setBuyerLeadName] = useState('Mariana Castro');
  const [buyerBudget, setBuyerBudget] = useState('R$ 1.500.000');
  const [generatedBuyerScript, setGeneratedBuyerScript] = useState('');
  const [isGeneratingBuyerScript, setIsGeneratingBuyerScript] = useState(false);

  // --- TAB 4: CHAT COPILOTO STATE ---
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Olá, ${currentUser.name}! Sou o **Assistente de IA Especialista em Captação da Morada Digital** 🎯\n\nEstou configurado para te ajudar em todo o ciclo de captação de clientes:\n\n• **Captar Proprietários:** Como convencer donos de imóveis particulares (placas e OLX) a assinarem exclusividade com a Morada Digital.\n• **Qualificar Compradores:** Descobrir orçamento real, poder de compra e urgência sem assustar o cliente.\n• **Quebrar Objeções de Captação:** "Não quero corretor", "Já anunciei sozinho", "6% de comissão é muito".\n\nO que você deseja captar hoje?`,
      time: 'Agora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Copy status indicators
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string, label = 'Texto') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} copiado com sucesso!`, 'Copiado', 'crm');
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // 1. Triagem Handler
  const handleParseRawText = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    try {
      const result = await parseLeadFromRawText(rawText);
      setParsedLead(result);
      showToast('Dados do lead extraídos com sucesso pela IA!', 'Triagem Concluída', 'crm');
    } catch {
      showToast('Erro ao processar o texto.', 'Erro', 'info');
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveParsedLeadToKanban = () => {
    if (!parsedLead) return;
    addLead({
      name: parsedLead.name,
      email: parsedLead.email || 'contato@cliente.com.br',
      phone: parsedLead.phone,
      interestType: parsedLead.interestType,
      budgetMax: parsedLead.budgetMax,
      preferredNeighborhoods: parsedLead.preferredNeighborhoods,
      preferredPropertyTypes: parsedLead.preferredPropertyTypes as any,
      notes: `${parsedLead.notes} | Ação recomendada pela IA: ${parsedLead.suggestedFirstAction}`,
      origin: 'whatsapp_direto'
    });

    showToast(`Lead ${parsedLead.name} adicionado com sucesso ao Funil Comercial!`, 'Novo Lead Criado', 'crm');
    if (onNavigateToLeads) onNavigateToLeads();
  };

  // 2. Owner Pitch Handler
  const handleGenerateOwnerPitch = async () => {
    setIsGeneratingOwnerPitch(true);
    try {
      const pitch = await generateOwnerListingPitch({
        ownerName,
        neighborhood: ownerNeighborhood,
        propertyType: ownerPropertyType,
        source: ownerSource,
        objective: 'venda'
      });
      setOwnerPitch(pitch);
      showToast('Roteiro de captação de proprietário gerado!', 'Angariação IA', 'crm');
    } catch {
      showToast('Erro ao gerar roteiro.', 'Erro', 'info');
    } finally {
      setIsGeneratingOwnerPitch(false);
    }
  };

  // 3. Buyer Script Handler
  const handleGenerateBuyerScript = async () => {
    setIsGeneratingBuyerScript(true);
    const prompt = `Gere uma mensagem altamente persuasiva para envio no WhatsApp para captação do comprador "${buyerLeadName}".
Estratégia: ${buyerStrategy}
Orçamento estimado: ${buyerBudget}
Foco: Imóveis no Bairro Arvoredo e Contagem com a Morada Digital.

Inclua:
- Gancho personalizado
- Proposta de valor clara (imóveis verificados, chaves rápidas, suporte jurídico)
- Chamada para ação objetiva (agendar visita rápida ou call de 5 min)
- Assinatura com Fixo (31) 3357-3030 e WhatsApp (31) 98427-9865`;

    try {
      const result = await askCaptureAI(prompt, 'Scripts de Captação de Compradores');
      setGeneratedBuyerScript(result);
      showToast('Script de abordagem gerado com sucesso!', 'Captação de Comprador', 'crm');
    } catch {
      showToast('Erro ao gerar script.', 'Erro', 'info');
    } finally {
      setIsGeneratingBuyerScript(false);
    }
  };

  // 4. Chat Handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const response = await askCaptureAI(userText, `Corretor: ${currentUser.name}`);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Houve uma instabilidade momentânea. Por favor, tente novamente.',
          time: now
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0B2545] via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Captação 360° com Inteligência Artificial • Morada Digital</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Assistente de IA para Captação de Clientes & Imóveis
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Transforme conversas informais em cadastros completos, angarie imóveis de proprietários particulares e feche representação exclusiva com argumentos profissionais testados em Contagem e Grande BH.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/60 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 flex items-center justify-center text-indigo-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Leads Ativos na Base</span>
                <span className="text-lg font-bold text-white font-mono">{leads.length} Contatos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80">
          {[
            { id: 'triagem', label: '1. Triagem & Intake Rápido', icon: UserPlus, desc: 'Extrair lead de texto do WhatsApp' },
            { id: 'angariacao', label: '2. Captação de Proprietários', icon: Building, desc: 'Angariar imóveis particulares' },
            { id: 'compradores', label: '3. Scripts para Compradores', icon: Flame, desc: 'Abordagem fria e reativação' },
            { id: 'copiloto', label: '4. Copiloto de Captação (Chat)', icon: MessageSquare, desc: 'Tirar dúvidas e contornar objeções' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[200px] p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md scale-[1.01]'
                    : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                  <span className="text-xs font-bold leading-tight">{tab.label}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 truncate">
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TRIAGEM INTELIGENTE & INTAKE RÁPIDO                                */}
      {/* ========================================================================= */}
      {activeTab === 'triagem' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Input Box (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <span>Entrada de Conversa / Áudio Transcrito</span>
                </h3>
                <p className="text-[11px] text-slate-500">Cole a mensagem recebida de qualquer canal (WhatsApp, portal, direct)</p>
              </div>

              <button
                type="button"
                onClick={() => setRawText('Cliente: Marcos Vinicius. Telefone 31988776655. Busca apartamento com 3 quartos no Cabral ou Arvoredo, teto de 850 mil, tem financiamento Caixa aprovado.')}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold bg-indigo-50 px-2 py-1 rounded-md"
              >
                Preencher Exemplo
              </button>
            </div>

            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Ex: 'Oi, vi a placa no Arvoredo. Quero comprar casa de 4 quartos até 2M. Meu WhatsApp é (31) 98427-0000...'"
              className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-slate-800 font-sans text-xs leading-relaxed outline-none focus:border-indigo-500 focus:bg-white resize-y"
            />

            <button
              type="button"
              disabled={isParsing || !rawText.trim()}
              onClick={handleParseRawText}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analisando Texto com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Estruturar Lead Automaticamente com IA</span>
                </>
              )}
            </button>
          </div>

          {/* Extracted Output Card (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Ficha Estruturada de Captação</span>
              </h3>
              {parsedLead && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                  Pronto para Inserir
                </span>
              )}
            </div>

            {parsedLead ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Nome do Cliente</span>
                    <span className="text-sm font-bold text-slate-900 block">{parsedLead.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">WhatsApp / Telefone</span>
                    <span className="text-sm font-bold text-emerald-700 font-mono block">{parsedLead.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Objetivo</span>
                    <span className="text-xs font-bold text-indigo-700 uppercase block">
                      {parsedLead.interestType === 'venda' ? 'Comprar Imóvel' : 'Alugar'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Teto Orçamentário</span>
                    <span className="text-sm font-bold text-slate-900 font-mono block">
                      R$ {parsedLead.budgetMax.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Bairros de Interesse</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {parsedLead.preferredNeighborhoods.map((n, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          📍 {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Próxima Ação Recomendada pela IA:</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    {parsedLead.suggestedFirstAction}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSaveParsedLeadToKanban}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Inserir este Lead no Funil Kanban Agora</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Target className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-medium text-xs">Cole uma conversa ao lado e clique em estruturar para gerar a ficha cadastral.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CAPTAÇÃO DE PROPRIETÁRIOS & ANGARIAÇÃO                              */}
      {/* ========================================================================= */}
      {activeTab === 'angariacao' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Settings (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Dados do Imóvel a Angariar</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome do Proprietário</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Bairro / Localização</label>
              <input
                type="text"
                value={ownerNeighborhood}
                onChange={(e) => setOwnerNeighborhood(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipologia</label>
                <select
                  value={ownerPropertyType}
                  onChange={(e) => setOwnerPropertyType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                >
                  <option value="Casa em Condomínio">Casa em Condomínio</option>
                  <option value="Apartamento / Cobertura">Apartamento / Cobertura</option>
                  <option value="Lote / Terreno">Lote / Terreno</option>
                  <option value="Imóvel Comercial">Imóvel Comercial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Origem da Captação</label>
                <select
                  value={ownerSource}
                  onChange={(e) => setOwnerSource(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
                >
                  <option value="placa_rua">Placa na Rua</option>
                  <option value="olx_particular">Anúncio Particular OLX</option>
                  <option value="indicacao">Indicação de Cliente</option>
                  <option value="rede_social">Redes Sociais</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingOwnerPitch}
              onClick={handleGenerateOwnerPitch}
              className="w-full py-3 bg-[#0B2545] hover:bg-[#12335c] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isGeneratingOwnerPitch ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Abordagem de Captação...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar Script de Angariação com IA</span>
                </>
              )}
            </button>
          </div>

          {/* Pitch Result (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Roteiro de Abordagem para o Proprietário</span>
              </h3>
              {ownerPitch && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(ownerPitch.approachMessage, 'owner_msg', 'Mensagem WhatsApp')}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'owner_msg' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'owner_msg' ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              )}
            </div>

            {ownerPitch ? (
              <div className="space-y-4 animate-in fade-in">
                {/* WhatsApp Message */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1">Mensagem de Primeiro Contato (WhatsApp):</span>
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                    {ownerPitch.approachMessage}
                  </div>
                </div>

                {/* Audio Script (for voice note) */}
                <div className="bg-indigo-50/60 border border-indigo-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Roteiro para Áudio de 40 Segundos (Converte 3x mais):</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ownerPitch.audioScript, 'owner_audio', 'Roteiro de áudio')}
                      className="text-[10px] text-indigo-600 font-bold hover:underline"
                    >
                      Copiar Roteiro
                    </button>
                  </div>
                  <p className="text-indigo-950 italic text-[11px] leading-relaxed">
                    {ownerPitch.audioScript}
                  </p>
                </div>

                {/* Differential Arguments */}
                <div>
                  <span className="font-bold text-slate-800 block mb-1.5">Argumentos de Fechamento de Exclusividade:</span>
                  <div className="space-y-1.5">
                    {ownerPitch.bulletArguments.map((arg, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{arg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Building className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-medium text-xs">Preencha os dados do proprietário ao lado e gere o roteiro de captação.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SCRIPTS DE CAPTAÇÃO DE COMPRADORES                                  */}
      {/* ========================================================================= */}
      {activeTab === 'compradores' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-3 border-b border-slate-100">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Configurar Abordagem de Comprador</span>
            </h3>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Estratégia de Captação</label>
              <select
                value={buyerStrategy}
                onChange={(e) => setBuyerStrategy(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-bold"
              >
                <option value="abordagem_fria">Abordagem Fria (Lead Novo de Campanha)</option>
                <option value="reativacao">Reativação de Lead Antigo / Adormecido</option>
                <option value="followup_sumido">Follow-up com Cliente que Parou de Responder</option>
                <option value="convite_vip">Convite VIP para Lançamento Morada 2026</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nome do Comprador</label>
              <input
                type="text"
                value={buyerLeadName}
                onChange={(e) => setBuyerLeadName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Faixa de Orçamento Estimada</label>
              <input
                type="text"
                value={buyerBudget}
                onChange={(e) => setBuyerBudget(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-800 font-mono font-bold"
              />
            </div>

            <button
              type="button"
              disabled={isGeneratingBuyerScript}
              onClick={handleGenerateBuyerScript}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isGeneratingBuyerScript ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gerando Script Persuasivo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Gerar Script de Comprador com IA</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Script Formatado para WhatsApp</span>
              </h3>
              {generatedBuyerScript && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(generatedBuyerScript, 'buyer_script', 'Script')}
                  className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'buyer_script' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'buyer_script' ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>
              )}
            </div>

            {generatedBuyerScript ? (
              <div className="space-y-4 animate-in fade-in">
                <textarea
                  rows={12}
                  value={generatedBuyerScript}
                  onChange={(e) => setGeneratedBuyerScript(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-800 font-mono text-[11.5px] leading-relaxed outline-none focus:border-indigo-500 focus:bg-white resize-y"
                />

                <div className="flex justify-end gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(generatedBuyerScript)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar no WhatsApp Web</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Flame className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-medium text-xs">Selecione a estratégia ao lado e gere mensagens sob medida.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CHAT COM O COPILOTO DE CAPTAÇÃO                                    */}
      {/* ========================================================================= */}
      {activeTab === 'copiloto' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Chat em Tempo Real com o Copiloto de Captação</span>
              </h3>
              <p className="text-[11px] text-slate-500">Tire dúvidas sobre abordagens, simule ligações difíceis ou peça argumentos imediatos</p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>IA Online • Gemini 3.8 Flash</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-xs font-bold text-xs">
                    IA
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 space-y-1.5 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] block text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-3 items-center text-slate-400 text-xs italic">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                <span>O Copiloto está formulando a melhor estratégia de captação...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-400 font-bold">Sugestões Rápidas:</span>
            {[
              'O proprietário disse que 6% de comissão é muito caro.',
              'Como abordar alguém que colocou faixa de "Vende-se Particular"?',
              'Cliente sumiu depois que passei o preço do imóvel no Arvoredo.',
              'Roteiro para ligar para um médico investidor em Contagem.'
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputMessage(q)}
                className="bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChatMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua dúvida ou objeção de captação aqui..."
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={isChatLoading || !inputMessage.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
