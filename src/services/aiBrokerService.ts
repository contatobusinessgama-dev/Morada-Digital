import { GoogleGenAI } from '@google/genai';
import { Property, Lead, Visita } from '../types';
import { MORADA_BRAND } from '../data/mockDatabase';

// Instantiate Gemini SDK when key is present
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_PROMPT = `
Você é a IA Copiloto de Alta Performance da Morada Digital, uma proptech imobiliária 100% digital com base operacional na Rua Pinheiro, 264 - Arvoredo, Contagem - MG (CEP: 32113-230, WhatsApp: (31) 98427-9865, CRECI 104.900-J).
Seu objetivo é auxiliar e empoderar os corretores e gerentes de vendas em tempo real com:
1. Respostas persuasivas, empáticas e éticas para contorno de objeções de clientes.
2. Mensagens irresistíveis e humanizadas para envio rápido no WhatsApp (sem parecer robótico ou genérico).
3. Esclarecimento de dúvidas jurídicas imobiliárias práticas com base na Lei do Inquilinato (Lei nº 8.245/91), Código Civil (Arts. 417-420 sobre Arras/Sinal e Arts. 722-729 sobre Corretagem) e Lei do Distrato (Lei nº 13.786/18).
4. Análise de feedbacks de visitas e definição da "Próxima Melhor Ação" (Next Best Action) para acelerar o fechamento de propostas e contratos.
5. Sempre forneça respostas objetivas, diretas e prontas para uso pelos corretores no dia a dia.
`;

export async function askBrokerAI(prompt: string, context?: string): Promise<string> {
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
                text: `${SYSTEM_PROMPT}\n\nContexto Atual:\n${context || 'Nenhum'}\n\nSolicitação do Corretor:\n${prompt}`
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
    console.warn('Gemini API call failed or rate limited, using intelligent fallback:', error);
  }

  // Fallback intelligent responses when offline or testing without active API key
  return getSmartLocalFallback(prompt, context);
}

export async function generateWhatsAppPitch(lead: Lead, property?: Property): Promise<string> {
  const prompt = `Gere uma mensagem curta, elegante e altamente persuasiva para o corretor enviar no WhatsApp para o lead "${lead.name}".
Objetivo: Despertar interesse e convidá-lo para uma visita presencial ou tour guiado.
Interesse do lead: ${lead.interestType === 'venda' ? 'Compra de imóvel' : 'Locação'} no orçamento de até R$ ${(lead.budgetMax / 1000).toLocaleString('pt-BR')}k.
${property ? `Imóvel recomendado: [${property.code}] ${property.title} em ${property.neighborhood}, valor R$ ${(property.price / 1000).toLocaleString('pt-BR')}k.` : ''}
Use formatação de WhatsApp (negritos pontuais e quebras de linha fluidas). Não coloque placeholders vazios.`;

  return askBrokerAI(prompt, `Lead: ${lead.name}, Telefone: ${lead.phone}, Origem: ${lead.origin}`);
}

export async function handleBrokerObjection(objection: string, propertyCode?: string): Promise<string> {
  const prompt = `O cliente fez a seguinte objeção ao corretor: "${objection}".
Como o corretor deve responder com maestria, empatia e inteligência comercial para não perder o negócio?
Forneça:
1. Validação empática do ponto de vista do cliente.
2. Pergunta inteligente de reversão / reorientação de valor.
3. Sugestão exata do que falar ou mandar no WhatsApp.`;

  return askBrokerAI(prompt, propertyCode ? `Imóvel em pauta: ${propertyCode}` : undefined);
}

export async function analyzeVisitFollowUp(visita: Visita): Promise<string> {
  const prompt = `Analise a visita realizada ao imóvel ${visita.propertyCode} ("${visita.propertyTitle}") para o cliente ${visita.leadOrClientName}.
Feedback do cliente: ${visita.feedbackComment || 'Sem comentários registrados'}.
Nota dada: ${visita.feedbackRating || 4}/5.
Status: ${visita.status}.
Defina a "Próxima Melhor Ação" (Next Best Action) para o corretor fechar esse negócio nas próximas 24 a 48 horas.`;

  return askBrokerAI(prompt, `Visita: ${visita.code}, Corretor: ${visita.brokerName}`);
}

export async function consultLegalTopic(topic: string): Promise<string> {
  const prompt = `O corretor da Morada Digital tem a seguinte dúvida jurídica prática sobre contratos de compra, venda ou locação:
"${topic}".
Explique com clareza, citando a legislação brasileira aplicável (Lei 8.245/91, Código Civil ou Lei 13.786/18), como proceder com segurança jurídica para proteger a imobiliária e o cliente.`;

  return askBrokerAI(prompt, 'Morada Digital - Jurídico & Compliance');
}

// Smart Local Fallback
function getSmartLocalFallback(prompt: string, context?: string): string {
  const lower = prompt.toLowerCase();

  if (lower.includes('objeção') || lower.includes('caro') || lower.includes('desconto')) {
    return `💡 **Estratégia Recomendada pela IA Morada Digital:**

1. **Validação Empática:**
"Compreendo perfeitamente, [Nome do Cliente]! Quando se trata de um investimento desse porte, cada detalhe do valor precisa fazer sentido absoluto para você e sua família."

2. **Reversão com Foco em Valor & Custo de Oportunidade:**
"Se considerarmos que este imóvel conta com acabamentos de padrão superior, localização com valorização projetada acima de 14% ao ano e toda a segurança jurídica verificada pela Morada Digital, ele entrega um custo por m² real muito mais vantajoso que outras opções na região."

3. **CTA para WhatsApp:**
"Que tal formalizarmos uma proposta estruturada com sinal e princípio de pagamento para apresentarmos ao proprietário hoje mesmo? Qual condição de fluxo de pagamento ficaria ideal para você?"`;
  }

  if (lower.includes('whatsapp') || lower.includes('pitch') || lower.includes('mensagem')) {
    return `Olá, *[Nome do Cliente]*, tudo bem? Aqui é o [Seu Nome], especialista da *Morada Digital*.

Estava analisando o perfil de imóveis que você procura e separei uma oportunidade recém-disponibilizada que atende perfeitamente suas preferências:

✨ *Imóvel com excelente iluminação natural, localização nobre e condições flexíveis de negociação.*
📍 *Totalmente verificado e com due diligence jurídica completa da Morada Digital.*

Podemos agendar uma visita rápida nesta semana para você conhecer os detalhes pessoalmente? Tenho horários disponíveis na quinta às 15h ou sexta às 10h. 

Qual fica melhor para você? 🗝️`;
  }

  if (lower.includes('feedback') || lower.includes('visita')) {
    return `🎯 **Análise de Feedback & Next Best Action (IA Copiloto):**

- **Diagnóstico:** O cliente demonstrou alto interesse na planta e iluminação, com leve hesitação sobre prazo ou valor de condomínio.
- **Próximo Passo (Dentro de 24h):**
  1. Enviar mensagem de agradecimento reforçando os pontos altos que ele elogiou durante a visita.
  2. Apresentar o comparativo de mercado demonstrando que imóveis similares no bairro custam entre 8% e 12% a mais.
  3. Propor a elaboração de uma minuta de proposta sem compromisso para reservar a preferência da unidade por 48 horas.`;
  }

  if (lower.includes('lei') || lower.includes('jurídico') || lower.includes('contrato') || lower.includes('inquilinato')) {
    return `⚖️ **Orientação Jurídica Prática (Compliance Morada Digital):**

- **Fundamentação:** Em conformidade com a **Lei Federal nº 8.245/91 (Lei do Inquilinato)** e os **Arts. 417 a 420 do Código Civil (Arras e Sinal)**:
- **Locação:** A garantia locatícia deve ser única (Art. 37, parágrafo único: é vedada mais de uma garantia sob pena de nulidade e contravenção penal). O reajuste anual é vinculado ao índice oficial pactuado (IPCA ou IGP-M).
- **Venda:** O sinal dado vincula as partes (Arras penitenciais). Caso o comprador desista sem justo motivo, perde o sinal; caso o vendedor desista, deve devolvê-lo em dobro com juros e honorários.
- **Assinatura Eletrônica:** Válida e plenamente eficaz judicialmente nos termos da **Lei nº 14.063/2020** e MP nº 2.200-2/2001.`;
  }

  return `🤖 **IA Morada Digital - Resposta do Copiloto:**
Com base no histórico da nossa base de clientes e inventário de imóveis em Contagem/BH e SP, a recomendação para o corretor é manter a postura consultiva:
1. Destaque a segurança jurídica e a agilidade 100% digital da Morada Digital.
2. Agende a visita como um passo sem compromisso para validação do espaço.
3. Utilize o canal oficial do WhatsApp (31) 98427-9865 para formalizar termos de visita e minutas pré-aprovadas.`;
}
