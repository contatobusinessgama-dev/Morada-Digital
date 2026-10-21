import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BrainCircuit, 
  Volume2, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Send, 
  RefreshCw, 
  Lightbulb, 
  Compass, 
  Clock, 
  UserCheck, 
  ShieldCheck,
  TrendingUp,
  Flame,
  MessageCircle
} from 'lucide-react';
import { Lead } from '../../types';
import { useRealEstate } from '../../context/RealEstateContext';
import { askBrokerAI } from '../../services/aiBrokerService';

interface AIAdvisorProps {
  lead: Lead;
  onApplyAction?: (actionText: string) => void;
  onClose?: () => void;
}

interface AdvisorAnalysis {
  archetype: string;
  archetypeDescription: string;
  urgencyLevel: 'Alta' | 'Média' | 'Baixa';
  recommendedTone: string;
  toneGuidelines: string[];
  thingsToAvoid: string[];
  historySummary: string;
  nextSteps: Array<{
    step: number;
    title: string;
    description: string;
    timeline: string;
  }>;
  suggestedWhatsAppMessage: string;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ lead, onApplyAction, onClose }) => {
  const { addLeadInteraction, showToast } = useRealEstate();
  
  const [analysis, setAnalysis] = useState<AdvisorAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [appliedStep, setAppliedStep] = useState<number | null>(null);

  // Generate analysis on mount or lead change
  useEffect(() => {
    runAnalysis();
  }, [lead.id]);

  const runAnalysis = async () => {
    setIsLoading(true);
    setAppliedStep(null);

    const historyText = lead.interactions && lead.interactions.length > 0
      ? lead.interactions.map(i => `[${i.date} - ${i.type}] ${i.description} (por ${i.author})`).join('\n')
      : 'Sem interações prévias além do cadastro inicial.';

    const prompt = `
Atue como o AI Advisor da Morada Digital, utilizando a inteligência do Gemini (gemini-3.8-flash) para analisar este Lead do CRM imobiliário.

DADOS DO LEAD:
- Nome: ${lead.name}
- Telefone: ${lead.phone}
- Objetivo: ${lead.interestType === 'venda' ? 'Compra' : 'Locação'}
- Orçamento Teto: R$ ${(lead.budgetMax / 1000).toLocaleString('pt-BR')}k
- Bairros de Preferência: ${lead.preferredNeighborhoods.join(', ')}
- Tipos de Imóvel: ${lead.preferredPropertyTypes.join(', ')}
- Fase Atual no CRM: ${lead.stage}
- Temperatura: ${lead.score}
- Imóvel de Interesse: ${lead.propertyOfInterestTitle || 'Geral do portfólio'}
- Notas Registradas: ${lead.notes}

HISTÓRICO DE INTERAÇÕES:
${historyText}

Gere uma resposta estritamente estruturada em JSON (sem markdown fora do JSON) com as seguintes chaves:
{
  "archetype": "Nome do Perfil/Arquétipo de Comprador (Ex: Analítico e Cauteloso, Emocional e Familiar, Executivo Decidido, Investidor Focado em Yield)",
  "archetypeDescription": "Breve explicação psicológica de como esse lead toma decisão de compra/aluguel.",
  "urgencyLevel": "Alta | Média | Baixa",
  "recommendedTone": "Tom de voz recomendado para o corretor (Ex: Consultivo Técnico, Acolhedor Empático, Direto e Executivo)",
  "toneGuidelines": ["Dica 1 de abordagem", "Dica 2 de abordagem", "Dica 3 de abordagem"],
  "thingsToAvoid": ["Armadilha 1 a evitar", "Armadilha 2 a evitar"],
  "historySummary": "Resumo sintético e analítico do histórico de conversas, destacando o que já foi falado e o ponto central de interesse.",
  "nextSteps": [
    {
      "step": 1,
      "title": "Ação Imediata",
      "description": "Detalhe prático da ação no CRM",
      "timeline": "Ex: Hoje até 18h"
    },
    {
      "step": 2,
      "title": "Ação de Meio",
      "description": "Detalhe da visita ou simulação",
      "timeline": "Ex: Em 48 horas"
    },
    {
      "step": 3,
      "title": "Fechamento",
      "description": "Formalização de proposta ou minuta",
      "timeline": "Ex: Final de semana"
    }
  ],
  "suggestedWhatsAppMessage": "Mensagem pronta, empática e persuasiva no tom recomendado, pronta para envio no WhatsApp do cliente."
}
`;

    try {
      const responseText = await askBrokerAI(prompt, 'AI Advisor - Análise de Perfil de Lead');
      
      // Attempt parse json
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonContent = responseText.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(jsonContent);
        setAnalysis(parsed);
      } else {
        throw new Error('JSON not detected in response');
      }
    } catch (err) {
      // High-precision domain-specific fallback for Morada Digital
      setAnalysis(generateFallbackAnalysis(lead));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyNextStep = (stepObj: { step: number; title: string; description: string }) => {
    const actionNote = `[AI Advisor]: Sugestão aplicada "${stepObj.title}" - ${stepObj.description}`;
    addLeadInteraction(lead.id, actionNote, 'nota');
    setAppliedStep(stepObj.step);
    if (onApplyAction) onApplyAction(actionNote);
    showToast(`Próximo passo "${stepObj.title}" registrado no histórico do cliente!`, 'CRM Atualizado', 'success');
  };

  const handleCopyMessage = () => {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.suggestedWhatsAppMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
    showToast('Mensagem de WhatsApp copiada!', 'Copiado', 'success');
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl overflow-hidden flex flex-col font-sans">
      
      {/* Advisor Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-400 to-teal-400 flex items-center justify-center text-white shadow-md">
            <BrainCircuit className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-serif">AI Advisor Morada Digital</h3>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-bold">
                gemini-3.8-flash
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Análise comportamental, tom de voz ideal e recomendação de próximos passos para <strong>{lead.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runAnalysis}
            disabled={isLoading}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Reanalisar Lead com Gemini"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-teal-400' : ''}`} />
            <span className="hidden sm:inline">Reanalisar</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50/50">
        
        {isLoading && !analysis ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">O Gemini está analisando o perfil psicológico e o histórico deste lead...</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Avaliando histórico de interações, tom de voz de maior conversão e próximos passos no funil.
            </p>
          </div>
        ) : analysis ? (
          <>
            {/* 1. Psychological Profile & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Perfil Psicológico & Decisório</span>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {analysis.archetype}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {analysis.archetypeDescription}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Nível de Prontidão / Urgência
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className={`w-5 h-5 ${
                      analysis.urgencyLevel === 'Alta' ? 'text-rose-500 fill-rose-500' : 'text-amber-500'
                    }`} />
                    <span className="text-xl font-bold font-serif text-slate-900">
                      {analysis.urgencyLevel}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  Orçamento: <strong>R$ {(lead.budgetMax / 1000).toLocaleString('pt-BR')}k</strong>
                </div>
              </div>

            </div>

            {/* 2. Recommended Tone of Voice */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Tom de Voz Ideal para o Corretor:
                  </span>
                  <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl">
                    {analysis.recommendedTone}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Guidelines */}
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/80 space-y-2">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>O que fazer (Boas Práticas de Abordagem):</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px]">
                    {analysis.toneGuidelines.map((g, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What to avoid */}
                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/80 space-y-2">
                  <div className="font-bold text-rose-900 flex items-center gap-1.5 text-xs">
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>O que evitar com esse cliente:</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[11px]">
                    {analysis.thingsToAvoid.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Conversation & Contact History Summary */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Resumo Analítico do Histórico no CRM</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-medium">
                {analysis.historySummary}
              </p>
            </div>

            {/* 4. Proposed Next Steps in CRM */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Próximos Passos Recomendados (Next Best Actions)</span>
                </div>
                <span className="text-[11px] text-slate-500">Clique para aplicar diretamente no CRM</span>
              </div>

              <div className="space-y-3">
                {analysis.nextSteps.map(stepObj => {
                  const isApplied = appliedStep === stepObj.step;

                  return (
                    <div
                      key={stepObj.step}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isApplied 
                          ? 'bg-emerald-50 border-emerald-300' 
                          : 'bg-slate-50/80 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          isApplied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                        }`}>
                          {isApplied ? '✓' : stepObj.step}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-xs">{stepObj.title}</h4>
                            <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md">
                              {stepObj.timeline}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {stepObj.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleApplyNextStep(stepObj)}
                        disabled={isApplied}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                          isApplied
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isApplied ? 'Registrado no CRM' : 'Aplicar Passo no CRM'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Pre-formulated WhatsApp Message in the Ideal Tone */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    Mensagem de WhatsApp Formulada no Tom Ideal
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMessage}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMessage ? 'Copiado!' : 'Copiar Texto'}</span>
                  </button>

                  <a
                    href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(analysis.suggestedWhatsAppMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Disparar no WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 text-xs text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                {analysis.suggestedWhatsAppMessage}
              </div>
            </div>

          </>
        ) : null}

      </div>

    </div>
  );
};

// Fallback logic when offline
function generateFallbackAnalysis(lead: Lead): AdvisorAnalysis {
  const isHighBudget = lead.budgetMax >= 4000000;
  const isRental = lead.interestType === 'locacao';

  if (isHighBudget) {
    return {
      archetype: 'Decisor Analítico & Alto Padrão',
      archetypeDescription: 'Cliente criterioso e habituado a serviços premium. Valoriza privacidade, valorização patrimonial, solidez jurídica e discrição absoluta. Não responde bem a táticas agressivas de escassez artificial.',
      urgencyLevel: 'Alta',
      recommendedTone: 'Consultivo, Seguro & Executivo',
      toneGuidelines: [
        'Apresente números concretos de valorização da região e memorial técnico do imóvel.',
        'Destaque a segurança jurídica e a due diligence realizada pela Morada Digital.',
        'Respeite o tempo do cliente com respostas sucintas e horários precisos para visita.'
      ],
      thingsToAvoid: [
        'Evite linguagem apelativa como "oportunidade imperdível de última hora".',
        'Não envie áudios longos sem autorização prévia; prefira mensagens estruturadas.'
      ],
      historySummary: `Cliente com orçamento de R$ ${(lead.budgetMax / 1000000).toFixed(1)}M com foco em imóveis exclusivos nos bairros ${lead.preferredNeighborhoods.join(', ')}. Teve interações registradas no CRM buscando detalhes de vagas, segurança e terraço.`,
      nextSteps: [
        {
          step: 1,
          title: 'Envio de Dossiê Executivo',
          description: 'Disponibilizar apresentação em PDF com plantas detalhadas e certidões jurídicas prévias.',
          timeline: 'Hoje até às 17h'
        },
        {
          step: 2,
          title: 'Agendamento de Visita Privativa',
          description: 'Oferecer tour com acompanhamento direto do corretor sênior em horário de menor fluxo.',
          timeline: 'Próximos 2 dias'
        },
        {
          step: 3,
          title: 'Estruturação de Minuta de Proposta',
          description: 'Apresentar condições de sinal e princípio de pagamento (Arras) protegidas em contrato.',
          timeline: 'Após a visita'
        }
      ],
      suggestedWhatsAppMessage: `Olá, *${lead.name.split(' ')[0]}*, tudo bem? Aqui é o especialista da *Morada Digital*.

Analisei com atenção os parâmetros que você busca para o seu próximo imóvel e selecionei uma oportunidade exclusiva no nosso portfólio que se alinha com precisão ao seu perfil.

✨ *Imóvel com planta diferenciada, alto nível de privacidade e documentação jurídica 100% verificada.*

Tenho disponibilidade para agendarmos uma visita privativa nesta semana. Qual período (manhã ou tarde) melhor se encaixa na sua agenda?`
    };
  }

  return {
    archetype: isRental ? 'Pragmático Ágil' : 'Familiar Focado em Bem-Estar',
    archetypeDescription: isRental 
      ? 'Busca rapidez na locação, facilidade na análise de crédito e garantia sem burocracia (Seguro Fiança/Título).'
      : 'Busca estabilidade, conforto para a família e equilíbrio entre lazer, localização e custo de condomínio.',
    urgencyLevel: 'Média',
    recommendedTone: 'Acolhedor, Transparente & Prático',
    toneGuidelines: [
      'Seja empático e tire dúvidas sobre os custos totais (aluguel + condomínio + IPTU).',
      'Ressalte a agilidade 100% digital da Morada Digital, sem necessidade de ir a cartório.',
      'Ofereça mais de uma opção de horário para agendamento de visita.'
    ],
    thingsToAvoid: [
      'Não deixe perguntas sobre valores de taxas sem resposta clara e transparente.',
      'Não demore mais de 30 minutos para responder dúvidas no WhatsApp.'
    ],
    historySummary: `Interessado em ${isRental ? 'locação' : 'compra'} com teto de até R$ ${(lead.budgetMax / 1000).toLocaleString('pt-BR')}k. Demonstrou interesse ativo e está na fase "${lead.stage.replace('_', ' ')}".`,
    nextSteps: [
      {
        step: 1,
        title: 'Confirmação de Perfil e Filtros',
        description: 'Validar número de dormitórios e preferência de insolação pelo WhatsApp.',
        timeline: 'Hoje'
      },
      {
        step: 2,
        title: 'Agendamento de Visita com Chave na Portaria',
        description: 'Reservar horário e emitir o Termo de Visita Digital da Morada Digital.',
        timeline: 'Amanhã'
      },
      {
        step: 3,
        title: 'Acompanhamento Pós-Visita',
        description: 'Coletar feedback no CRM e estruturar minuta de proposta formal.',
        timeline: 'Dentro de 24h pós-visita'
      }
    ],
    suggestedWhatsAppMessage: `Olá, *${lead.name.split(' ')[0]}*, tudo bem? Sou o corretor responsável pelo seu atendimento na *Morada Digital*.

Separei uma opção excelente dentro da sua faixa de valor que conta com ótima localização e condomínio completo.

Você gostaria de dar uma olhada nas fotos e já combinarmos uma visita rápida para conhecer o espaço? Fico à sua total disposição! 🗝️`
  };
}
