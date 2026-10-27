import { GoogleGenAI } from '@google/genai';
import { Property } from '../types';
import { MORADA_BRAND } from '../data/mockDatabase';

export interface DailySocialPost {
  id: string;
  dayOfWeek: string;
  themeTitle: string;
  targetNetwork: 'instagram' | 'whatsapp' | 'facebook' | 'stories';
  format: 'feed_quadrado' | 'story_vertical';
  headline: string;
  subheadline: string;
  bullets: string[];
  caption: string;
  imageUrl: string;
  propertyCode?: string;
  landlinePhone: string;
  whatsappPhone: string;
  address: string;
  creci: string;
  directorName: string;
  directorCreci: string;
  createdAt: string;
}

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Daily calendar themes
export const DAILY_MARKETING_THEMES: Record<number, { day: string; theme: string; focus: string }> = {
  1: { day: 'Segunda-feira', theme: 'Oportunidade da Semana & Lançamentos', focus: 'Começar a semana apresentando imóveis com alto potencial e condições especiais' },
  2: { day: 'Terça-feira', theme: 'Dica Imobiliária & Bairro Arvoredo', focus: 'Educar o cliente sobre valorização imobiliária, infraestrutura e qualidade de vida em Contagem/MG' },
  3: { day: 'Quarta-feira', theme: 'Imóvel Exclusivo de Alto Padrão', focus: 'Foco em acabamento superior, piscina, varanda gourmet e suítes completas' },
  4: { day: 'Quinta-feira', theme: 'Locação Sem Burocracia & Investimento', focus: 'Aluguel rápido com garantia digital e retorno seguro para investidores' },
  5: { day: 'Sexta-feira', theme: 'Casa dos Sonhos para o Fim de Semana', focus: 'Conexão emocional com a tranquilidade do lar, área de lazer e lazer em família' },
  6: { day: 'Sábado', theme: 'Plantão de Visitas Aberto', focus: 'Convidar para visitar imóveis hoje com a equipe credenciada e chave rápida' },
  0: { day: 'Domingo', theme: 'Lifestyle, Família & Planejamento', focus: 'Reflexão sobre a paz de encontrar o lugar onde você pertence' }
};

export async function generateDailySocialPost(params: {
  dayIndex?: number;
  property?: Property;
  network?: 'instagram' | 'whatsapp' | 'facebook' | 'stories';
  customTopic?: string;
  tone?: 'alto_padrao' | 'comercial' | 'educativo' | 'urgencia';
}): Promise<DailySocialPost> {
  const currentDayIndex = params.dayIndex !== undefined ? params.dayIndex : new Date().getDay();
  const themeInfo = DAILY_MARKETING_THEMES[currentDayIndex] || DAILY_MARKETING_THEMES[1];
  const network = params.network || 'instagram';
  const format = network === 'stories' ? 'story_vertical' : 'feed_quadrado';
  const prop = params.property;

  const defaultImage = prop?.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85';

  const prompt = `Você é o diretor de Marketing Digital da Morada Digital (imobiliária 100% digital com base na Rua Pinheiro, 264 - Arvoredo, Contagem - MG).
Crie um post diário COMPLETO para redes sociais (${network.toUpperCase()}).

REQUISITOS OBRIGATÓRIOS:
1. Dia da semana: ${themeInfo.day}
2. Tema editorial do dia: ${params.customTopic || themeInfo.theme}
3. Foco editorial: ${themeInfo.focus}
4. Tom de voz: ${params.tone || 'alto_padrao'}
${prop ? `5. Imóvel em destaque: [${prop.code}] ${prop.title} - ${prop.neighborhood}, ${prop.city}. Preço: R$ ${prop.price.toLocaleString('pt-BR')}. Destaques: ${prop.features.slice(0, 4).join(', ')}` : '5. Imóvel: Destaque institucional da Morada Digital em Contagem e Grande BH'}

OBRIGATÓRIO INCLUIR NA ASSINATURA E NO CARD:
- Marca: Morada Digital - A paz de encontrar o lugar onde você pertence.
- Telefone Fixo Principal: (31) 3357-3030
- WhatsApp Plantão: (31) 98427-9865
- Sede: Rua Pinheiro, 264 - Arvoredo, Contagem - MG (CEP: 32113-230)
- CRECI Jurídico: CRECI nº 104.900-J/MG
- Responsável: Daniel Gama - Diretor e Administrador (CRECI 68.165-F/MG)

Retorne EXATAMENTE no formato JSON com as seguintes chaves:
{
  "headline": "Título curto, forte e chamativo para o card visual (máx 8 palavras)",
  "subheadline": "Subtítulo do card visual destacando benefício principal (máx 12 palavras)",
  "bullets": ["Destaque 1 curto com emoji", "Destaque 2 curto com emoji", "Destaque 3 curto com emoji"],
  "caption": "Legenda completa do post com gancho irresistível, espaçamento com emojis elegantes, chamada para ação, e ao final a assinatura completa com Morada Digital, Telefone Fixo (31) 3357-3030, WhatsApp (31) 98427-9865, endereço e CRECI, além de hashtags estratégicas."
}`;

  try {
    const ai = getGenAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        config: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return {
          id: `post-${Date.now()}`,
          dayOfWeek: themeInfo.day,
          themeTitle: params.customTopic || themeInfo.theme,
          targetNetwork: network,
          format,
          headline: parsed.headline || 'Seu Novo Lar em Contagem',
          subheadline: parsed.subheadline || 'Tranquilidade, segurança e alto padrão',
          bullets: Array.isArray(parsed.bullets) && parsed.bullets.length > 0 ? parsed.bullets : [
            '🏊 Área de lazer privativa',
            '📍 Localização nobre no Arvoredo',
            '🗝️ Chave e vistoria digital rápida'
          ],
          caption: parsed.caption || buildFallbackCaption(themeInfo.day, prop),
          imageUrl: defaultImage,
          propertyCode: prop?.code,
          landlinePhone: '(31) 3357-3030',
          whatsappPhone: '(31) 98427-9865',
          address: MORADA_BRAND.address,
          creci: MORADA_BRAND.creci,
          directorName: 'Daniel Gama',
          directorCreci: 'CRECI 68.165-F/MG',
          createdAt: new Date().toLocaleDateString('pt-BR')
        };
      }
    }
  } catch (err) {
    console.warn('Gemini generateDailySocialPost fallback triggered:', err);
  }

  // Fallback high quality template
  return generateLocalTemplatePost(themeInfo.day, themeInfo.theme, network, format, prop, defaultImage);
}

function buildFallbackCaption(day: string, prop?: Property): string {
  if (prop) {
    return `✨ *${prop.title}* | Oportunidade Morada Digital 🗝️
    
Imagine viver em um imóvel que une conforto supremo, acabamento de alto padrão e a tranquilidade que a sua família merece no coração de ${prop.neighborhood}, ${prop.city}.

Principais Destaques:
• 📐 ${prop.totalArea}m² de área construída com aproveitamento perfeito
• 🛏️ ${prop.bedrooms} Quartos (${prop.suites} Suítes com marcenaria planejada)
• 🚗 ${prop.parkingSpots} Vagas de garagem
• 🌿 Espaço gourmet e lazer privativo para momentos inesquecíveis

💰 *Valor de Venda:* R$ ${prop.price.toLocaleString('pt-BR')}
Código de Referência: *${prop.code}*

Agende sua visita exclusiva hoje mesmo com um dos nossos consultores credenciados:

━━━━━━━━━━━━━━━━━━━━━
🏢 *MORADA DIGITAL*
_A paz de encontrar o lugar onde você pertence._

📞 *Telefone Fixo:* (31) 3357-3030
💬 *WhatsApp Plantão:* (31) 98427-9865
📍 *Sede Operacional:* ${MORADA_BRAND.address} • CEP: ${MORADA_BRAND.cep}
🛡️ *${MORADA_BRAND.creci}*
👨‍💼 *Diretor Geral:* Daniel Gama (CRECI 68.165-F/MG)
━━━━━━━━━━━━━━━━━━━━━

#MoradaDigital #ImoveisContagem #BairroArvoredo #ImoveisDeLuxo #CasaComPiscina #DanielGama #ContagemMG #VendaDeImoveis #CRECI`;
  }

  return `🌿 *A PAZ DE ENCONTRAR O LUGAR ONDE VOCÊ PERTENCE* 🗝️
  
Na Morada Digital, transformamos a busca pelo seu imóvel ideal em uma experiência ágil, transparente e 100% segura.

Seja para comprar, vender ou alugar em Contagem e Grande BH, conte com assessoria jurídica especializada, vistorias digitais com chaves rápidas e atendimento humanizado do início à entrega das chaves.

Quer avaliar seu imóvel ou encontrar as melhores opções no Bairro Arvoredo e região? Converse diretamente conosco:

━━━━━━━━━━━━━━━━━━━━━
🏢 *MORADA DIGITAL*
_100% Digital com Base Operacional em Contagem_

📞 *Telefone Fixo:* (31) 3357-3030
💬 *WhatsApp Plantão:* (31) 98427-9865
📍 *Sede Operacional:* ${MORADA_BRAND.address} • CEP: ${MORADA_BRAND.cep}
🛡️ *${MORADA_BRAND.creci}*
👨‍💼 *Diretor Geral:* Daniel Gama (CRECI 68.165-F/MG)
━━━━━━━━━━━━━━━━━━━━━

#MoradaDigital #ImoveisContagem #BairroArvoredo #ImobiliariaDigital #DanielGama #AluguelSemFiador #CompraDeImoveis #Contagem`;
}

function generateLocalTemplatePost(
  day: string,
  theme: string,
  network: 'instagram' | 'whatsapp' | 'facebook' | 'stories',
  format: 'feed_quadrado' | 'story_vertical',
  prop?: Property,
  imageUrl?: string
): DailySocialPost {
  const headline = prop ? `${prop.type === 'casa_condominio' ? 'Casa de Alto Padrão' : 'Imóvel Selecionado'} no Arvoredo` : 'Encontre Seu Novo Lar em Contagem';
  const subheadline = prop ? `Exclusividade Morada Digital • Cód. ${prop.code}` : 'Atendimento 100% Digital com Base no Bairro Arvoredo';
  const bullets = prop ? [
    `📐 ${prop.totalArea}m² com living integrado`,
    `🏊 Varanda gourmet e piscina com cascata`,
    `🚗 ${prop.parkingSpots} vagas com portaria e segurança`
  ] : [
    '✨ Vistorias e contratos 100% digitais',
    '📍 Base física: Rua Pinheiro, 264 - Arvoredo',
    '⚡ Plantão ágil no Fixo e WhatsApp'
  ];

  return {
    id: `post-${Date.now()}`,
    dayOfWeek: day,
    themeTitle: theme,
    targetNetwork: network,
    format,
    headline,
    subheadline,
    bullets,
    caption: buildFallbackCaption(day, prop),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85',
    propertyCode: prop?.code,
    landlinePhone: '(31) 3357-3030',
    whatsappPhone: '(31) 98427-9865',
    address: MORADA_BRAND.address,
    creci: MORADA_BRAND.creci,
    directorName: 'Daniel Gama',
    directorCreci: 'CRECI 68.165-F/MG',
    createdAt: new Date().toLocaleDateString('pt-BR')
  };
}
