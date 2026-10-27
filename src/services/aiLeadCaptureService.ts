import { GoogleGenAI } from '@google/genai';
import { Lead, LeadOrigin, Property } from '../types';
import { MORADA_BRAND } from '../data/mockDatabase';

export interface ParsedLeadData {
  name: string;
  phone: string;
  email?: string;
  interestType: 'venda' | 'locacao';
  budgetMax: number;
  preferredNeighborhoods: string[];
  preferredPropertyTypes: string[];
  urgency: 'alta' | 'media' | 'baixa';
  notes: string;
  suggestedFirstAction: string;
}

export interface OwnerCapturePitch {
  pitchTitle: string;
  approachMessage: string;
  audioScript: string;
  bulletArguments: string[];
  exclusivityClosing: string;
}

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_CAPTURE_PROMPT = `
Você é o Especialista Chefe em Captação de Clientes e Angariação Imobiliária da Morada Digital (Contagem e Grande BH - MG).
Sede Operacional: Rua Pinheiro, 264 - Arvoredo, Contagem - MG.
Telefone Fixo: (31) 3357-3030 | WhatsApp: (31) 98427-9865 | CRECI 104.900-J/MG.
Diretoria: Daniel Gama (CRECI 68.165-F/MG).

Sua missão é auxiliar corretores a:
1. Captar novos compradores e investidores com abordagens persuasivas e humanizadas.
2. Angariar imóveis de proprietários que tentam vender ou alugar sozinhos (placas, OLX, redes).
3. Superar objeções comuns de captação (comissão, exclusividade, desconfiança).
4. Estruturar cadastros rápidos de leads a partir de conversas soltas no WhatsApp.
`;

export async function askCaptureAI(prompt: string, context?: string): Promise<string> {
  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_CAPTURE_PROMPT}\n\nContexto Atual:\n${context || 'Geral'}\n\nPergunta do Corretor:\n${prompt}`
              }
            ]
          }
        ],
        config: {
          temperature: 0.6,
          maxOutputTokens: 1200
        }
      });

      if (response.text) {
        return response.text.trim();
      }
    }
  } catch (error) {
    console.warn('Gemini Capture AI fallback triggered:', error);
  }

  return getCaptureSmartFallback(prompt);
}

/**
 * Parses unformatted WhatsApp chats or notes into a structured Lead object
 */
export async function parseLeadFromRawText(rawText: string): Promise<ParsedLeadData> {
  const prompt = `Analise o seguinte texto bruto (conversa de WhatsApp ou anotação do corretor) e extraia os dados estruturados de um lead imobiliário:
"${rawText}"

Retorne RIGOROSAMENTE no formato JSON:
{
  "name": "Nome da pessoa ou 'Cliente Interessado'",
  "phone": "Telefone com DDD ou '(31) 9'",
  "email": "Email se houver ou ''",
  "interestType": "venda ou locacao",
  "budgetMax": 0 (número inteiro em Reais, ex: 1500000),
  "preferredNeighborhoods": ["Bairros citados, ex: Arvoredo, Cabral"],
  "preferredPropertyTypes": ["casa, apartamento, etc"],
  "urgency": "alta, media ou baixa",
  "notes": "Resumo objetivo do perfil e do que procura",
  "suggestedFirstAction": "Próxima ação recomendada para o corretor"
}`;

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          name: parsed.name || 'Novo Lead',
          phone: parsed.phone || '(31) 98427-9865',
          email: parsed.email || '',
          interestType: parsed.interestType === 'locacao' ? 'locacao' : 'venda',
          budgetMax: Number(parsed.budgetMax) || 1200000,
          preferredNeighborhoods: Array.isArray(parsed.preferredNeighborhoods) ? parsed.preferredNeighborhoods : ['Arvoredo'],
          preferredPropertyTypes: Array.isArray(parsed.preferredPropertyTypes) ? parsed.preferredPropertyTypes : ['casa_condominio'],
          urgency: parsed.urgency || 'alta',
          notes: parsed.notes || 'Captação automatizada via IA Morada Digital.',
          suggestedFirstAction: parsed.suggestedFirstAction || 'Ligar ou enviar mensagem via WhatsApp apresentando opções selecionadas.'
        };
      }
    }
  } catch (err) {
    console.warn('Gemini parse lead fallback:', err);
  }

  // Smart heuristic extraction fallback
  const phoneMatch = rawText.match(/\(?\d{2}\)?\s*9?\d{4}[-\s]?\d{4}/);
  const emailMatch = rawText.match(/[\w.-]+@[\w.-]+\.\w+/);
  const isLocacao = rawText.toLowerCase().includes('alug') || rawText.toLowerCase().includes('locaç');

  return {
    name: 'Lead Identificado pela IA',
    phone: phoneMatch ? phoneMatch[0] : '(31) 98427-9865',
    email: emailMatch ? emailMatch[0] : '',
    interestType: isLocacao ? 'locacao' : 'venda',
    budgetMax: isLocacao ? 5000 : 1500000,
    preferredNeighborhoods: ['Bairro Arvoredo', 'Contagem'],
    preferredPropertyTypes: ['casa_condominio'],
    urgency: 'alta',
    notes: `Extraído de mensagem: ${rawText.slice(0, 150)}...`,
    suggestedFirstAction: 'Iniciar primeiro contato pelo WhatsApp oferecendo opções do Bairro Arvoredo.'
  };
}

/**
 * Generates an owner capture pitch (angariação de imóvel particular)
 */
export async function generateOwnerListingPitch(params: {
  ownerName: string;
  neighborhood: string;
  propertyType: string;
  source: 'placa_rua' | 'olx_particular' | 'indicacao' | 'rede_social';
  objective: 'venda' | 'locacao';
}): Promise<OwnerCapturePitch> {
  const prompt = `Gere uma estratégia completa de captação/angariação para o corretor abordar o proprietário "${params.ownerName}" que está tentando negociar um(a) ${params.propertyType} em ${params.neighborhood} (origem: ${params.source}).

Destaques da Morada Digital a enfatizar:
- Plataforma 100% Digital com Base Operacional em Contagem (Rua Pinheiro, 264 - Arvoredo)
- Telefone Fixo (31) 3357-3030 e WhatsApp (31) 98427-9865 com atendimento ágil
- Anúncio em todos os grandes portais (ZAP, VivaReal, OLX) com até 15 fotos profissionais
- Filtragem prévia e qualificação de clientes (evita curiosos entrando na casa do proprietário)
- Segurança jurídica completa e termo de visita digital
- CRECI 104.900-J

Retorne no formato JSON:
{
  "pitchTitle": "Título da Abordagem",
  "approachMessage": "Mensagem elegante e persuasiva pronta para enviar no WhatsApp",
  "audioScript": "Roteiro do que falar caso o corretor prefira mandar um áudio de 40 segundos",
  "bulletArguments": ["Argumento 1", "Argumento 2", "Argumento 3"],
  "exclusivityClosing": "Frase de fechamento para propor representação e exclusividade"
}`;

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.6,
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
    }
  } catch (err) {
    console.warn('Gemini owner pitch fallback:', err);
  }

  return {
    pitchTitle: `Captação de ${params.propertyType} em ${params.neighborhood}`,
    approachMessage: `Olá, ${params.ownerName}, tudo bem? Sou o [Seu Nome], consultor da Morada Digital aqui em Contagem.
    
Vi o anúncio do seu imóvel em ${params.neighborhood} e temos atualmente compradores qualificados buscando exatamente esse perfil de espaço na nossa base.

Gostaria de lhe fazer uma visita rápida de 15 minutos para conhecer a unidade e apresentar como podemos acelerar a venda sem que você perca tempo com curiosos, com toda a assessoria jurídica e divulgação nos principais portais.

Podemos conversar amanhã às 10h ou 15h? Um abraço!`,
    audioScript: `"Oi, ${params.ownerName}! Aqui é o [Seu Nome] da Morada Digital. Vi que você está vendendo seu imóvel no ${params.neighborhood}. Eu atendo clientes com crédito pré-aprovado aqui na região procurando exatamente essa tipologia. Queria dar uma passada rápida aí só para alinhar os detalhes e ver se encaixa no perfil dos nossos clientes. Qual o melhor dia para você?"`,
    bulletArguments: [
      'Filtragem rigorosa de compradores com due diligence financeira prévia',
      'Divulgação massiva patrocinada no ZAP, VivaReal e Meta Ads',
      'Base operacional física na Rua Pinheiro, 264 - Arvoredo para chaves e vistorias'
    ],
    exclusivityClosing: 'Deixe a gestão de visitas e a segurança jurídica com a Morada Digital enquanto você foca na sua rotina.'
  };
}

function getCaptureSmartFallback(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('comissão') || lower.includes('6%') || lower.includes('porcentagem')) {
    return `💡 **Como Defender os Honorários de Captação (6% Padrão CRECI):**
    
1. **Valide a preocupação do proprietário:**
"Entendo perfeitamente, [Nome do Proprietário]! O valor da comissão representa um montante relevante do seu patrimônio."

2. **Demonstre o Retorno sobre o Investimento:**
"A Morada Digital não cobra para anunciar. Nós investimos do nosso próprio bolso em fotografia profissional, anúncios patrocinados no ZAP e VivaReal, e checagem jurídica de cada interessado. Além disso, corretores negociam sem o apego emocional, conseguindo fechar propostas entre 8% e 15% mais altas do que negociações diretas entre particulares."

3. **Fechamento de Parceria:**
"Nosso honorário só é pago quando o dinheiro da venda estiver 100% creditado na sua conta bancária. Você topa trabalharmos juntos nessa condição?"`;
  }

  if (lower.includes('olx') || lower.includes('placa') || lower.includes('particular')) {
    return `🎯 **Roteiro de Abordagem para Proprietário com Placa / OLX:**

• **Passo 1:** Nunca ligue dizendo "quero cadastrar seu imóvel". Ligue demonstrando interesse real:
"Olá! Sou da Morada Digital aqui do Arvoredo. Vi a placa no seu imóvel e tenho uma família em atendimento que busca exatamente 4 quartos nessa região."

• **Passo 2:** Agende uma avaliação presencial:
"Posso dar um pulo aí hoje às 16h para ver a planta e fotos internas antes de indicar aos clientes?"

• **Passo 3:** Na visita presencial, entregue valor e apresente o catálogo da Morada Digital com suporte pelo Fixo (31) 3357-3030 e WhatsApp.`;
  }

  return `🤖 **Assistente de Captação Morada Digital:**
Para captar clientes com consistência hoje em Contagem/MG:
1. **Velocidade de Primeiro Atendimento (SLA < 5 minutos):** Leads atendidos em menos de 5 minutos convertem 8x mais.
2. **Contato Multicanal:** Utilize WhatsApp humanizado + ligação pelo Fixo (31) 3357-3030.
3. **Foco na Dor:** Descubra o motivo da mudança (família crescendo, proximidade do trabalho, busca por segurança no Arvoredo).
4. **Chamada para Ação:** Nunca termine uma mensagem sem uma pergunta fechada de agendamento de visita.`;
}
