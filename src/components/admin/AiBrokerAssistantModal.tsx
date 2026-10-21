import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Flame, 
  Scale, 
  Building, 
  RefreshCw,
  Lightbulb,
  X
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { 
  askBrokerAI, 
  generateWhatsAppPitch, 
  handleBrokerObjection, 
  consultLegalTopic 
} from '../../services/aiBrokerService';
import { MORADA_BRAND } from '../../data/mockDatabase';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiBrokerAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { leads, properties, currentUser, showToast } = useRealEstate();

  const [activeTab, setActiveTab] = useState<'chat' | 'objecoes' | 'whatsapp' | 'juridico'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Olá, ${currentUser.name}! Sou a **IA Copiloto da Morada Digital** ⚡\n\nEstou aqui para acelerar suas vendas e atendimentos. Em que posso te ajudar agora?\n\n• Contornar uma objeção de cliente\n• Criar uma mensagem persuasiva de WhatsApp\n• Tirar dúvidas jurídicas sobre a Lei do Inquilinato ou contratos\n• Analisar uma proposta ou feedback de visita`,
      time: 'Agora'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Quick Objections
  const [selectedObjection, setSelectedObjection] = useState('O imóvel está muito caro em comparação com outros.');
  const [objectionResponse, setObjectionResponse] = useState('');

  // Quick WhatsApp Generator
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [generatedPitch, setGeneratedPitch] = useState('');

  // Quick Legal topic
  const [legalTopic, setLegalTopic] = useState('Como funciona a multa de rescisão proporcional após 12 meses na Lei do Inquilinato?');
  const [legalResponse, setLegalResponse] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askBrokerAI(userText, `Corretor: ${currentUser.name}, Papel: ${currentUser.role}`);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: response, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: 'Desculpe, ocorreu uma instabilidade momentânea. Tente novamente.', 
          time: now 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateObjection = async () => {
    setIsLoading(true);
    const result = await handleBrokerObjection(selectedObjection);
    setObjectionResponse(result);
    setIsLoading(false);
  };

  const handleGeneratePitch = async () => {
    setIsLoading(true);
    const targetLead = leads.find(l => l.id === selectedLeadId) || leads[0];
    const targetProp = properties.find(p => p.id === selectedPropId);
    const result = await generateWhatsAppPitch(targetLead, targetProp);
    setGeneratedPitch(result);
    setIsLoading(false);
  };

  const handleConsultLegal = async () => {
    setIsLoading(true);
    const result = await consultLegalTopic(legalTopic);
    setLegalResponse(result);
    setIsLoading(false);
  };

  const copyToClipboard = (text: string, index?: number) => {
    navigator.clipboard.writeText(text);
    if (index !== undefined) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2500);
    }
    showToast('Texto copiado para a área de transferência!', 'Copiado', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[650px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-400 to-teal-400 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base font-serif">IA Copiloto Morada Digital</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Gemini 3.8 Online
                </span>
              </div>
              <span className="text-xs text-slate-300">
                Assistência estratégica, argumentos de vendas e suporte jurídico para corretores
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 py-2 gap-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat Livre com a IA</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('objecoes');
              if (!objectionResponse) handleGenerateObjection();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'objecoes'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Quebrar Objeções</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('whatsapp');
              if (!generatedPitch) handleGeneratePitch();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Criador WhatsApp</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('juridico');
              if (!legalResponse) handleConsultLegal();
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'juridico'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>Consultor Jurídico</span>
          </button>
        </div>

        {/* Tab 1: CHAT LIVRE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50/50">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 shadow-xs rounded-tl-none space-y-2'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100/30 text-[10px] opacity-70">
                      <span>{msg.time}</span>
                      {msg.sender === 'ai' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, idx)}
                          className="hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A IA da Morada Digital está formulando a melhor estratégia...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ex: Como respondo um cliente que quer 15% de desconto à vista?"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold p-2.5 rounded-xl transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: QUEBRAR OBJEÇÕES */}
        {activeTab === 'objecoes' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Selecione ou digite a objeção recebida do cliente:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {[
                  'O imóvel está muito caro em comparação com outros.',
                  'Vou esperar as taxas de juros caírem para comprar.',
                  'Gostei, mas quero pensar mais com calma.',
                  'O valor do condomínio e IPTU é elevado demais.',
                  'Só fecho se o proprietário der 10% de desconto imediato.',
                  'Quero colocar outro imóvel na permuta integral.'
                ].map(obj => (
                  <button
                    key={obj}
                    type="button"
                    onClick={() => {
                      setSelectedObjection(obj);
                    }}
                    className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      selectedObjection === obj
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    "{obj}"
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedObjection}
                  onChange={e => setSelectedObjection(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleGenerateObjection}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gerar Resposta</span>
                </button>
              </div>
            </div>

            {/* Generated Response Box */}
            {objectionResponse && (
              <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-indigo-700 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Resposta Estruturada da IA para o Corretor
                  </span>
                  <button
                    onClick={() => copyToClipboard(objectionResponse)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Argumentação</span>
                  </button>
                </div>

                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {objectionResponse}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: CRIADOR WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Cliente / Lead Alvo</label>
                <select
                  value={selectedLeadId}
                  onChange={e => setSelectedLeadId(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.interestType.toUpperCase()} - Até R$ {(l.budgetMax / 1000).toLocaleString('pt-BR')}k)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Imóvel Sugerido</label>
                <select
                  value={selectedPropId}
                  onChange={e => setSelectedPropId(e.target.value)}
                  className="w-full bg-white border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title.slice(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePitch}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm shadow-emerald-600/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gerar Mensagem Personalizada de WhatsApp</span>
            </button>

            {generatedPitch && (
              <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    Texto Pronto para Enviar no WhatsApp
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedPitch)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>

                    {leads.find(l => l.id === selectedLeadId) && (
                      <a
                        href={`https://wa.me/55${(leads.find(l => l.id === selectedLeadId)?.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(generatedPitch)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-xs"
                      >
                        <Send className="w-3 h-3" />
                        <span>Abrir no WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                  {generatedPitch}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: CONSULTOR JURÍDICO */}
        {activeTab === 'juridico' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-50/50">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Dúvidas jurídicas frequentes dos corretores:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                {[
                  'Como funciona a multa de rescisão proporcional após 12 meses na Lei do Inquilinato?',
                  'O que acontece com o sinal/arras se o comprador desistir da compra?',
                  'A imobiliária pode exigir fiador e caução ao mesmo tempo?',
                  'A assinatura eletrônica por ZapSign/DocuSign tem validade jurídica em juízo?',
                  'Como garantir o recebimento da comissão de 6% nos termos do Código Civil?'
                ].map(top => (
                  <button
                    key={top}
                    type="button"
                    onClick={() => setLegalTopic(top)}
                    className={`text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      legalTopic === top
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {top}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={legalTopic}
                  onChange={e => setLegalTopic(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleConsultLegal}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Consultar Parecer</span>
                </button>
              </div>
            </div>

            {legalResponse && (
              <div className="bg-white rounded-2xl p-5 border border-indigo-200 shadow-sm space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Parecer Jurídico Fundamentado para o Corretor
                  </span>
                  <button
                    onClick={() => copyToClipboard(legalResponse)}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Parecer</span>
                  </button>
                </div>

                <div className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {legalResponse}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
