import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  MapPin, 
  RotateCcw, 
  MessageCircle, 
  ChevronDown, 
  Compass, 
  Building2,
  ExternalLink
} from 'lucide-react';
import { MORADA_BRAND } from '../../data/mockDatabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  hasMapsGrounding?: boolean;
  groundingSources?: Array<{ title?: string; uri?: string }>;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: `Olá! Sou a **Sophia**, Corretora Digital e Concierge da **Morada Digital** em Contagem e Grande BH.\n\nEstou integrada ao **Google Maps** para te ajudar a conhecer os bairros (como nosso Bairro Arvoredo, Cabral, Eldorado e região), distâncias, comércios locais e tirar dúvidas sobre aluguel sem fiador ou compra.\n\nComo posso te ajudar hoje?`,
    timestamp: 'Agora'
  }
];

const SUGGESTIONS = [
  'Onde fica a sede no Bairro Arvoredo?',
  'Quais comodidades têm perto do Shopping Contagem?',
  'Como funciona o Aluguel Sem Fiador da Morada?',
  'Principais vias de acesso em Contagem'
];

export const GeminiChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: newHistory.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Falha na comunicação com o assistente.');
      }

      const data = await response.json();
      
      const hasGrounding = Boolean(data.groundingMetadata?.groundingChunks?.length || data.groundingMetadata?.webSearchQueries?.length);

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Estou à disposição para responder qualquer dúvida sobre nossos imóveis e bairros em Contagem!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        hasMapsGrounding: hasGrounding,
        groundingSources: data.groundingMetadata?.groundingChunks?.map((c: any) => ({
          title: c.web?.title || 'Google Maps',
          uri: c.web?.uri
        })).filter((c: any) => c.uri)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Tive uma breve oscilação de rede ao consultar as informações. Você pode tentar novamente ou falar diretamente com nosso plantão de corretores no WhatsApp: **(31) 98427-9865**.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

  return (
    <>
      {/* Floating Chat Launcher Button (Desktop & Mobile) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <div className="hidden sm:flex items-center gap-2 mb-2 bg-slate-900/90 text-white text-[11px] font-semibold py-1 px-3 rounded-full shadow-lg border border-slate-700/80 animate-bounce duration-1000">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sophia IA • Tire dúvidas com Google Maps</span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl transition-all duration-300 cursor-pointer border ${
            isOpen 
              ? 'bg-slate-900 text-white border-slate-700' 
              : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white border-indigo-400/30 hover:scale-105 shadow-indigo-600/30'
          }`}
          aria-label={isOpen ? "Fechar chat com corretora IA" : "Abrir chat com corretora IA"}
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-indigo-700 animate-pulse" />
          </div>
          <span className="font-bold text-xs hidden sm:inline">
            {isOpen ? 'Fechar Assistente' : 'Corretora IA & Maps'}
          </span>
        </button>
      </div>

      {/* Expandable Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 lg:bottom-20 right-2 sm:right-6 z-50 w-[95vw] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#07172C] via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-white">Sophia | Morada Digital</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-bold">
                    IA
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-teal-400" />
                  <span>Google Maps Grounding Ativo</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="bg-slate-50 border-b border-slate-100 px-3.5 py-1.5 text-[10.5px] text-slate-600 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500 truncate">
              <Compass className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>Especialista em Bairros de Contagem & BH</span>
            </span>
            <a
              href={`https://wa.me/${MORADA_BRAND.whatsappClean}?text=Ol%C3%A1%2C%20estava%20conversando%20com%20a%20Sophia%20IA%20e%20gostaria%20de%20atendimento%20humano`}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 shrink-0"
            >
              <span>WhatsApp</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 text-xs bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  {/* Message Content */}
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.content}
                  </div>

                  {/* Google Maps Grounding Badge */}
                  {msg.hasMapsGrounding && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-teal-700 font-bold">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      <span>Informações checadas com Google Maps</span>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-3 shadow-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse delay-150" />
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse delay-300" />
                  <span className="text-[11px] text-slate-500 font-medium ml-1">Sophia consultando dados...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(sug)}
                disabled={isLoading}
                className="shrink-0 text-[10.5px] bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200/80 transition-colors cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre bairros, rotas ou imóveis..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:bg-white text-slate-800 placeholder:text-slate-400 font-medium transition-all"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white disabled:text-slate-400 transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
