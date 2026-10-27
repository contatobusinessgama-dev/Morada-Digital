import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Phone, 
  Building, 
  Key, 
  FileCheck, 
  Flame, 
  Award, 
  Play, 
  ChevronRight, 
  ShieldCheck, 
  Lightbulb, 
  MessageSquare, 
  Check, 
  Copy,
  Star,
  Users,
  Clock,
  Send,
  RefreshCw,
  X
} from 'lucide-react';
import { useRealEstate } from '../../context/RealEstateContext';
import { askBrokerAI } from '../../services/aiBrokerService';
import { MORADA_BRAND } from '../../data/mockDatabase';

interface TrainingCard {
  id: string;
  stepNumber: number;
  category: 'onboarding' | 'captacao' | 'atendimento' | 'visitas' | 'negociacao' | 'marketing';
  title: string;
  subtitle: string;
  badge: string;
  whatToDo: string;
  howToDoSteps: string[];
  whyItMatters: string;
  goldenRule: string;
  aiPromptExample: string;
  practicalChecklist: string[];
}

export const TRAINING_CARDS: TrainingCard[] = [
  {
    id: 'card-1',
    stepNumber: 1,
    category: 'onboarding',
    title: 'Primeiro Dia & Postura de Alta Performance',
    subtitle: 'Como iniciar com autoridade profissional e credenciamento oficial',
    badge: 'Fundamentos',
    whatToDo: 'Configurar sua presença profissional oficial na Morada Digital: WhatsApp Business com foto executiva, assinatura corporativa com número do CRECI, conhecimento da base de imóveis e endereço operacional na Rua Pinheiro, 264 - Arvoredo.',
    howToDoSteps: [
      '1. Suba sua foto real de perfil no sistema (usando a ferramenta de corte e otimização).',
      '2. Salve no seu WhatsApp os telefones oficiais da imobiliária: Fixo (31) 3357-3030 e WhatsApp (31) 98427-9865.',
      '3. Estude detalhadamente os imóveis de destaque no Bairro Arvoredo e bairros vizinhos de Contagem/BH.',
      '4. Memorize o CRECI Jurídico (104.900-J) e o nome do Diretor Geral Daniel Gama (CRECI 68.165-F).'
    ],
    whyItMatters: '92% da decisão de um cliente de alto padrão começa pela confiança visual e técnica transmitida pelo corretor nos primeiros 30 segundos. Quem se posiciona como especialista não disputa preço de comissão.',
    goldenRule: 'Nunca se apresente como "apenas um corretor". Apresente-se como Consultor Imobiliário de Negócios e Patrimônio da Morada Digital.',
    aiPromptExample: 'Como me apresentar de forma executiva e elegante para um cliente médico ou empresário no WhatsApp?',
    practicalChecklist: [
      'Foto profissional em alta resolução configurada no sistema',
      'Cartão de visitas digital e link do WhatsApp configurados',
      'CRECI e CPF validados junto à diretoria',
      'Conhecimento das 4 suítes e área de lazer do imóvel MD-1001'
    ]
  },
  {
    id: 'card-2',
    stepNumber: 2,
    category: 'captacao',
    title: 'Captação Ativa & Angariação de Imóveis Exclusivos',
    subtitle: 'Como abordar proprietários particulares e garantir 6% de honorários',
    badge: 'Captação & Carteira',
    whatToDo: 'Mapear casas e apartamentos anunciados por particulares no Bairro Arvoredo e Contagem (placas, OLX, redes sociais) e convertê-los em captações exclusivas com até 15 fotos e divulgação nos portais ZAP e VivaReal.',
    howToDoSteps: [
      '1. Ligue ou envie WhatsApp demonstrando que você já possui perfil de compradores na base da Morada Digital.',
      '2. Agende uma visita presencial de avaliação técnica de 15 minutos (nunca tente fechar o contrato pelo telefone).',
      '3. Na visita, destaque a segurança jurídica (filtragem prévia de quem entra na casa dele) e os anúncios patrocinados.',
      '4. Apresente o modelo de exclusividade de venda explicando que a Morada Digital investe do próprio bolso no anúncio.'
    ],
    whyItMatters: 'Quem domina as captações exclusivas é dono do mercado. Um corretor com 5 bons imóveis exclusivos atrai dezenas de compradores todos os meses sem precisar gastar dinheiro próprio.',
    goldenRule: 'Não peça para "cadastrar" o imóvel. Peça para "apresentar o plano de aceleração de vendas da Morada Digital para o patrimônio dele".',
    aiPromptExample: 'O que responder quando o proprietário disser que já anunciou sozinho e não quer imobiliária?',
    practicalChecklist: [
      'Caderno de captação ou aplicativo aberto',
      'Termo de autorização de venda e exclusividade impresso/digital',
      'Fotos nítidas de todos os cômodos (iluminação natural diurna)',
      'Documento do imóvel verificado (matrícula e IPTU)'
    ]
  },
  {
    id: 'card-3',
    stepNumber: 3,
    category: 'atendimento',
    title: 'Atendimento Imediato & SLA < 5 Minutos no WhatsApp',
    subtitle: 'A regra de ouro da velocidade e o método F.O.R.D. de qualificação',
    badge: 'Conversão de Leads',
    whatToDo: 'Responder todo lead novo que entrar no CRM em menos de 5 minutos, utilizando mensagens personalizadas e áudios empáticos de até 40 segundos, descobrindo o real motivo da mudança.',
    howToDoSteps: [
      '1. Recebeu o lead no painel? Abra o WhatsApp imediatamente e chame pelo primeiro nome.',
      '2. Confirme o interesse no imóvel de referência citando o código (ex: MD-1001 no Arvoredo).',
      '3. Aplique a técnica F.O.R.D.: Família (quantas pessoas vão morar?), Ocupação (onde trabalham?), Recreação (gostam de piscina/churrasqueira?), Dinheiro (financiamento ou à vista?).',
      '4. Nunca encerre uma mensagem com "qualquer dúvida estou à disposição". Sempre encerre com pergunta de fechamento de visita.'
    ],
    whyItMatters: 'Estudos imobiliários comprovam: atender um lead em até 5 minutos aumenta as chances de fechamento em 800% em relação ao atendimento feito após 30 minutos.',
    goldenRule: 'Velocidade gera percepção de exclusividade e respeito pelo tempo do cliente.',
    aiPromptExample: 'Gere uma mensagem calorosa e rápida de primeiro contato para um comprador que acabou de preencher o formulário do site.',
    practicalChecklist: [
      'Notificações de novos leads ativas no celular',
      'SLA de resposta cronometrado abaixo de 5 minutos',
      'Registro da interação anotado no histórico do lead no CRM',
      'Pergunta de agendamento de visita enviada'
    ]
  },
  {
    id: 'card-4',
    stepNumber: 4,
    category: 'visitas',
    title: 'Condução de Visitas Presenciais & Encantamento',
    subtitle: 'Como transformar uma visita comum em uma experiência de compra inesquecível',
    badge: 'Experiência & Vendas',
    whatToDo: 'Preparar o imóvel com antecedência na sede da Morada Digital, pegar a chave na portaria/sede, chegar 15 minutos antes, climatizar o espaço e coletar a assinatura do Termo de Visita Digital.',
    howToDoSteps: [
      '1. Chegue 15 minutos antes: abra todas as janelas e cortinas para valorizar a luz natural e ligue as luzes de destaque.',
      '2. Receba o cliente no portão com um sorriso e postura acolhedora; deixe o cliente entrar primeiro em cada ambiente.',
      '3. Permaneça em silêncio quando o cliente estiver apreciando a vista ou o espaço gourmet (deixe-o se imaginar morando ali).',
      '4. Ao final da visita, colete a assinatura do Termo Digital de Visita e pergunte: "De 0 a 10, o quanto essa casa atende os planos da sua família?".'
    ],
    whyItMatters: 'O cliente não compra tijolo, cimento e metragem quadrada. Ele compra a sensação de paz, orgulho e bem-estar que sente ao caminhar pela residência.',
    goldenRule: 'Menos discurso e mais perguntas que façam o cliente verbalizar o que ele mais gostou.',
    aiPromptExample: 'Como contornar a objeção se o cliente disser na visita que a suíte é menor do que ele imaginava?',
    practicalChecklist: [
      'Chave retirada e conferida na portaria/sede',
      'Termo de visita digital aberto no celular',
      'Imóvel aberto, iluminado e perfumado 15 minutos antes',
      'Roteiro mental dos pontos altos do Bairro Arvoredo'
    ]
  },
  {
    id: 'card-5',
    stepNumber: 5,
    category: 'negociacao',
    title: 'Negociação, Arras/Sinal & Fechamento Jurídico',
    subtitle: 'Como formalizar propostas vencedoras e blindar a comissão da agência',
    badge: 'Fechamento & Contratos',
    whatToDo: 'Transformar o interesse verbal em uma Proposta Formal escrita com Sinal e Princípio de Pagamento (Arras - Arts. 417-420 CC), alinhando prazos, certidões negativas e honorários da imobiliária.',
    howToDoSteps: [
      '1. Nunca aceite contraproposta "de boca". Exija que o comprador formalize o valor e a forma de pagamento por escrito no painel.',
      '2. Explique que o sinal (arras) é a garantia jurídica de que o proprietário tirará o imóvel do mercado para ele.',
      '3. Acompanhe a emissão da minuta contratual no módulo "Contratos" da Morada Digital.',
      '4. Garanta que a comissão de 6% conste expressamente discriminada no contrato conforme o Código Civil brasileiro.'
    ],
    whyItMatters: 'Proposta verbal evapora em 24 horas; proposta por escrito com sinal concretiza o negócio e protege o corretor de compradores ou vendedores que tentam fechar "por fora".',
    goldenRule: 'Quem tem pressa de fechar sem sinal perde a venda e a comissão. A segurança jurídica é o maior diferencial da Morada Digital.',
    aiPromptExample: 'Como explicar para o comprador a importância de dar um sinal de 10% para reservar o imóvel?',
    practicalChecklist: [
      'Proposta lançada no módulo Propostas do CRM',
      'Comprovante de sinal ou fluxo de pagamento anexado',
      'Certidões e matrícula atualizada solicitadas',
      'Honorários e split de corretor/captador confirmados'
    ]
  },
  {
    id: 'card-6',
    stepNumber: 6,
    category: 'marketing',
    title: 'Marketing Pessoal & Publicação Diária com a IA',
    subtitle: 'Como atrair clientes todos os dias sem gastar fortunas em anúncios',
    badge: 'Marketing & Autoridade',
    whatToDo: 'Utilizar diariamente a ferramenta de IA da Morada Digital para gerar postagens elegantes com a logo e os telefones oficiais (Fixo: 31 3357-3030 e WhatsApp: 31 98427-9865) e divulgar nos seus status e redes sociais.',
    howToDoSteps: [
      '1. Acesse o módulo "Marketing" e abra a aba "Post Diário com IA".',
      '2. Selecione o dia da semana ou o imóvel que deseja destacar hoje.',
      '3. Clique em "Baixar Card em Alta Resolução (PNG)" e "Copiar Legenda".',
      '4. Publique no WhatsApp Status, Stories do Instagram e grupos de corretores e investidores de Contagem/BH.'
    ],
    whyItMatters: 'Quem é visto é lembrado. Um corretor consistente que posta diariamente vira a primeira lembrança de amigos, familiares e clientes no momento em que decidem comprar, vender ou alugar.',
    goldenRule: 'A constância supera o talento. 1 post profissional por dia gera contatos qualificados todas as semanas.',
    aiPromptExample: 'Gere um criativo e uma copy irresistível para postar no WhatsApp Status sobre as vantagens de morar no Bairro Arvoredo.',
    practicalChecklist: [
      'Card diário gerado com logo e telefones oficiais',
      'Post publicado no WhatsApp Status às 8h30 ou 18h00',
      'Legenda com hashtags estratégicas compartilhada',
      'Respostas aos comentários em menos de 10 minutos'
    ]
  }
];

// ============================================================================
// DADOS OFICIAIS: APOSTILA DEFINITIVA (MÓDULOS 1 A 5 + INTRODUÇÃO)
// ============================================================================
export interface ApostilaModuleData {
  id: number;
  code: string;
  title: string;
  tagline: string;
  iconName: string;
  sections: {
    subtitle: string;
    whatToDo?: string;
    whyWhatToDo?: string;
    whatNotToDo?: string;
    whyWhatNotToDo?: string;
    scriptTitle?: string;
    scriptContent?: string;
    bulletPoints?: { label: string; text: string }[];
    notes?: string;
  }[];
}

export const APOSTILA_MODULES: ApostilaModuleData[] = [
  {
    id: 0,
    code: 'INTRO',
    title: 'Introdução: O Novo Modelo de Negócio Imobiliário',
    tagline: 'Agilidade, inteligência digital, blindagem jurídica e excelência operacional',
    iconName: 'Building',
    sections: [
      {
        subtitle: 'Visão Geral & Filosofia da Morada Digital',
        whatToDo: 'Operar no mercado imobiliário moderno com foco total em agilidade de resposta, inteligência digital, blindagem jurídica contratual rigorosa e excelência no relacionamento com o cliente.',
        whyWhatToDo: 'O mercado imobiliário tradicional baseado em estruturas pesadas e burocracia lenta está sendo substituído por modelos ágeis, digitais e altamente consultivos.',
        bulletPoints: [
          { label: 'Planejamento Enxuto', text: 'Operação com baixo custo fixo e alta margem de rentabilidade desde o dia 1.' },
          { label: 'Estratégias de Captação Ativa', text: 'Estoque qualificado e exclusivo com captação direta e ronda de campo.' },
          { label: 'Atendimento por CRM & SLA', text: 'Resposta a leads em menos de 5 minutos utilizando o funil BANT.' },
          { label: 'Segurança Jurídica', text: 'Due diligence completa, certidões negativas e cláusulas contratuais blindadas.' },
          { label: 'Escala & Alavancagem', text: 'Tráfego hiperlocal por raio de km no Meta Ads e parcerias estratégicas (co-brokerage).' }
        ],
        notes: 'Este manual foi estruturado para ser a apostila definitiva de uma imobiliária de alto desempenho sob a liderança do Diretor Geral Daniel Gama (CRECI 68.165-F / Imobiliária CRECI 104.900-J).'
      }
    ]
  },
  {
    id: 1,
    code: 'MÓDULO 1',
    title: 'Estruturação e Planejamento da Imobiliária',
    tagline: 'Modelo operacional digital/itinerante e blindagem fiscal/jurídica',
    iconName: 'Target',
    sections: [
      {
        subtitle: '1.1. Modelo Operacional (Digital e Itinerante)',
        whatToDo: 'Estruturar o negócio com foco em atendimento remoto, itinerante e digital, eliminando os custos fixos de um ponto comercial tradicional.',
        whyWhatToDo: 'O cliente moderno busca imóveis na internet (portais e redes sociais). Reduzir custos fixos no início garante fôlego de caixa, maior margem de lucro e liberdade para atender diretamente no local do cliente.',
        whatNotToDo: 'Alugar um escritório físico caro antes de ter faturamento recorrente consolidado.',
        whyWhatNotToDo: 'O peso de aluguel, condomínio, IPTU e mobília asfixia o caixa nos primeiros meses, gerando estresse e forçando fechamentos precipitados por desespero financeiro.'
      },
      {
        subtitle: '1.2. Regularização e Fiscal (ME e Simples Nacional)',
        whatToDo: 'Formalizar adequadamente a empresa (como Microempresa sob o Simples Nacional) e manter a regularidade junto ao CRECI regional.',
        whyWhatToDo: 'Garante respaldo legal para fechar parcerias de co-brokerage, emitir notas fiscais sem bitributação abusiva e transmite total seriedade aos clientes.',
        whatNotToDo: 'Misturar finanças pessoais com as contas da empresa.',
        whyWhatNotToDo: 'Dificulta a contabilidade, impede a visão real da lucratividade e gera riscos fiscais desnecessários.'
      }
    ]
  },
  {
    id: 2,
    code: 'MÓDULO 2',
    title: 'Captação de Imóveis (O Combustível da Imobiliária)',
    tagline: 'Como gerar estoque exclusivo, varredura de particulares e ronda comercial',
    iconName: 'Key',
    sections: [
      {
        subtitle: '2.1. Como Captar e Gerar Estoque de Qualidade',
        bulletPoints: [
          { 
            label: 'Varredura em Anúncios Particulares (OLX, Facebook, Portais)', 
            text: 'Identifique proprietários que anunciam por conta própria e sofrem com curiosos, especuladores e insegurança jurídica.' 
          },
          { 
            label: 'Ronda Comercial de Campo', 
            text: 'Visite condomínios no Bairro Arvoredo e região de Contagem, converse com síndicos e porteiros (estabelecendo parcerias de indicação éticas). Eles sabem quem está mudando de cidade ou querendo vender antes de todo mundo.' 
          }
        ],
        scriptTitle: 'Script de Abordagem ao Proprietário via WhatsApp (Anúncio Direto)',
        scriptContent: `Olá, [Nome do Proprietário], tudo bem? Vi seu anúncio do imóvel no bairro [Nome do Bairro]. Sou especialista no mercado da região e atendo clientes qualificados buscando imóveis exatamente com o perfil do seu. Como você está anunciando direto, gostaria de entender se você aceita parceria com imobiliária para acelerar essa venda com total segurança jurídica, sem custo fixo para você. Podemos conversar 5 minutinhos?`
      },
      {
        subtitle: '2.2. Técnicas de Exclusividade e Modelo de Contrato',
        whatToDo: 'Argumentos para Exclusividade: Explique ao proprietário que um imóvel pulverizado em várias imobiliárias passa uma imagem de desespero ou desorganização, gerando propostas abaixo do valor. A exclusividade garante foco total de marketing e verba direcionada do próprio bolso da imobiliária.',
        scriptTitle: 'Modelo Prático: Cláusula de Exclusividade (90 Dias)',
        scriptContent: `CLÁUSULA DE EXCLUSIVIDADE: O PROPRIETÁRIO confere à IMOBILIÁRIA exclusividade na comercialização do imóvel objeto deste instrumento pelo prazo de 90 (noventa) dias, contados a partir da assinatura. Durante este período, caso o imóvel seja vendido ou locado por intermédio de terceiros ou diretamente pelo PROPRIETÁRIO, será devida à IMOBILIÁRIA a comissão integral estipulada neste contrato, em virtude dos investimentos em marketing, tráfego pago e diligência despendidos.`
      },
      {
        subtitle: '2.3. O Que Não Fazer na Captação',
        whatNotToDo: 'Aceitar captar imóveis com preços irreais só para agradar o proprietário e inflar o portfólio.',
        whyWhatNotToDo: 'Imóveis supervalorizados viram "enfeite" no site, queimam a reputação da marca e nunca geram propostas, desperdiçando tempo e verba de anúncios.'
      }
    ]
  },
  {
    id: 3,
    code: 'MÓDULO 3',
    title: 'Atendimento Comercial, CRM e Qualificação de Leads',
    tagline: 'Scripts de WhatsApp, agendamento de visitas e qualificação BANT',
    iconName: 'MessageSquare',
    sections: [
      {
        subtitle: '3.1. Scripts de Atendimento e Automação via WhatsApp',
        scriptTitle: 'Script 1: Resposta Inicial (Lead perguntando preço)',
        scriptContent: `Olá! Obrigado pelo contato. O valor do imóvel é R$ [Valor]. Para eu te enviar o vídeo completo e a localização exata, me conta rapidinho: você está buscando para moradia ou investimento? Pretende financiar ou usar recursos próprios?`
      },
      {
        subtitle: '3.1.2. Script de Agendamento de Visita',
        scriptTitle: 'Script 2: Fechamento de Visita Presencial com Alternativa Dupla',
        scriptContent: `Perfeito, [Nome do Cliente]. Esse imóvel atende perfeitamente ao que você procura. Tenho disponibilidade para fazermos uma visita presencial nesta [Dia da semana] às [Horário] ou na [Outro Dia] às [Horário]. Qual fica melhor para você?`
      },
      {
        subtitle: '3.2. O Que Fazer e O Que Não Fazer no Atendimento',
        whatToDo: 'Responda aos leads em tempo recorde (até 5 minutos) utilizando funis de triagem e qualificação (BANT: Orçamento / Budget, Autoridade / Decisor, Necessidade / Need e Prazo / Timing).',
        whyWhatToDo: 'Quem responde primeiro e com inteligência ganha a atenção do cliente no mercado imobiliário moderno.',
        whatNotToDo: 'Enviar o endereço exato ou o preço por mensagem fria sem qualificar o contato.',
        whyWhatNotToDo: 'O cliente que só quer "saber o preço" some e você perde totalmente o controle da negociação.'
      }
    ]
  },
  {
    id: 4,
    code: 'MÓDULO 4',
    title: 'Jurídico Imobiliário, Compliance e Contratos',
    tagline: 'Checklist de certidões, cláusulas de arras e segurança na locação',
    iconName: 'ShieldCheck',
    sections: [
      {
        subtitle: '4.1. Check-list de Documentação Obrigatória (Venda)',
        bulletPoints: [
          {
            label: '1. Certidão de Matrícula Atualizada com Inteiro Teor e Ônus Reais',
            text: 'Emitida há menos de 30 dias pelo Cartório de Registro de Imóveis competente.'
          },
          {
            label: '2. Certidões Negativas de Débitos (CNDs)',
            text: 'Certidões negativas Federais, Estaduais e Municipais do Vendedor e do imóvel.'
          },
          {
            label: '3. Certidão de Distribuição Cível e Trabalhista',
            text: 'Indispensável para evitar a Fraude à Execução, que pode anular a venda caso o vendedor possua dívidas ocultas.'
          },
          {
            label: '4. Certidão Negativa de Débitos Condominiais',
            text: 'Declaração formal assinada pelo síndico ou pela administradora com ata de eleição do síndico.'
          }
        ]
      },
      {
        subtitle: '4.2. Cláusulas Contratuais Indispensáveis',
        scriptTitle: 'Cláusula Penal por Desistência (Sinal / Arras)',
        scriptContent: `Caso o COMPRADOR desista da compra por motivo injustificado, perderá o valor dado como sinal e arras em favor do VENDEDOR. Caso o VENDEDOR desista da venda, deverá devolver o valor do sinal em dobro ao COMPRADOR, acrescido de correção monetária e multa de 10% sobre o valor total do negócio.`
      },
      {
        subtitle: '4.2.2. Cláusula de Imissão na Posse',
        scriptTitle: 'Cláusula de Transmissão da Posse Definitiva',
        scriptContent: `A posse definitiva do imóvel será transmitida ao COMPRADOR somente após a quitação total do preço ajustado e a lavratura da Escritura Pública de Compra e Venda no Cartório de Notas.`
      },
      {
        subtitle: '4.3. Regras de Locação (Lei do Inquilinato - 8.245/91)',
        whatToDo: 'Exigir garantia locatícia sólida (caução de até 3 aluguéis, fiador idôneo ou seguro-fiança) e anexar obrigatoriamente um laudo de vistoria inicial com fotografias detalhadas.',
        whyWhatToDo: 'Sem vistoria de entrada e saída, torna-se juridicamente impossível cobrar judicialmente o inquilino por danos causados ao imóvel.'
      }
    ]
  },
  {
    id: 5,
    code: 'MÓDULO 5',
    title: 'Fontes de Receita, Alavancagem e Pós-Venda',
    tagline: 'Comissões de 6% a 8%, primeiro aluguel, taxa 8-12%, PTAM e escala diária',
    iconName: 'Flame',
    sections: [
      {
        subtitle: '5.1. Principais Atividades Geradoras de Receita',
        bulletPoints: [
          {
            label: 'Comissão de Venda (6% a 8%)',
            text: 'Padrão de mercado entre 6% e 8%, podendo ser dividida em parcerias (co-brokerage 50/50) para acelerar a liquidez patrimonial.'
          },
          {
            label: 'Taxa de Primeiro Aluguel (100%)',
            text: 'Cobrada integralmente no fechamento da locação para remunerar a captação, conferência de cadastro, vistorias e elaboração contratual.'
          },
          {
            label: 'Taxa de Administração Mensal (8% a 12%)',
            text: 'Percentual retido mensalmente sobre o aluguel recebido para gestão contábil, repasse ao proprietário e suporte contínuo.'
          },
          {
            label: 'Avaliações Mercadológicas (PTAM)',
            text: 'Emissão de pareceres técnicos de avaliação mercadológica (PTAM) para instituições financeiras, inventários ou processos judiciais.'
          }
        ]
      },
      {
        subtitle: '5.2. Alavancagem e Escala Diária',
        bulletPoints: [
          {
            label: 'Tráfego Pago Hiperlocal no Meta Ads',
            text: 'Anúncios segmentados por raio de quilometragem específico (ex: 3 km a 7 km) ao redor dos imóveis em captação exclusiva no Bairro Arvoredo/Contagem, direcionando leads qualificados diretamente para o WhatsApp CRM com os telefones (31) 3357-3030 e (31) 98427-9865.'
          },
          {
            label: 'Parcerias Estratégicas (Co-brokerage 50/50)',
            text: 'Não retenha estoque sozinho. Dividir a comissão e fechar vendas rápidas é muito mais lucrativo do que manter imóveis parados por meses sem liquidez.'
          }
        ]
      },
      {
        subtitle: '5.3. O Pós-Venda que Gera Indicações',
        whatToDo: 'Enviar um presente simbólico e útil no dia da entrega das chaves e manter contato periódico de relacionamento (datas comemorativas, 6 meses, 1 ano).',
        whyWhatToDo: 'Clientes felizes são a maior fonte de captação orgânica (boca a boca) do mercado imobiliário.',
        whatNotToDo: 'Sumir após receber a comissão.',
        whyWhatNotToDo: 'O pós-venda é onde nascem as futuras revendas e as indicações para amigos e familiares.'
      }
    ]
  }
];

export const BrokerTrainingAcademy: React.FC = () => {
  const { showToast, currentUser } = useRealEstate();

  const [activeMainTab, setActiveMainTab] = useState<'apostila' | 'cartoes' | 'simulador'>('apostila');
  const [selectedApostilaModule, setSelectedApostilaModule] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [selectedCard, setSelectedCard] = useState<TrainingCard | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('todos');
  
  // Interactive AI Roleplay Simulator State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simScenario, setSimScenario] = useState<'objecao_preco' | 'recusa_comissao' | 'termo_visita' | 'cliente_sumido'>('objecao_preco');
  const [userBrokerMessage, setUserBrokerMessage] = useState('');
  const [aiClientResponse, setAiClientResponse] = useState<string | null>(null);
  const [aiScoreFeedback, setAiScoreFeedback] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopyText = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`${label} copiado com sucesso!`, 'Copiado', 'crm');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const filteredCards = TRAINING_CARDS.filter(c => filterCategory === 'todos' || c.category === filterCategory);

  const handleSimulateRoleplay = async () => {
    if (!userBrokerMessage.trim()) return;
    setIsSimulating(true);

    const scenarioDescriptions: Record<string, string> = {
      objecao_preco: 'O cliente disse: "Achei essa casa no Arvoredo maravilhosa, mas 1.8 milhão está muito fora da realidade da região, só pago 1.5M à vista."',
      recusa_comissao: 'O proprietário disse: "Não aceito pagar 6% de comissão. Se você quiser trazer comprador, meu teto de comissão é 2% e sem exclusividade."',
      termo_visita: 'O cliente disse na porta do imóvel: "Não vou assinar nenhum Termo de Visita nem passar meu CPF, não gosto de burocracia."',
      cliente_sumido: 'O cliente visitou o imóvel, elogiou muito a piscina, mas há 4 dias não responde suas mensagens no WhatsApp.'
    };

    const prompt = `Você é um treinador sênior de corretores da Morada Digital e também está encenando o cliente.
Cenário atual do treinamento de novato:
"${scenarioDescriptions[simScenario]}"

O corretor novato respondeu o seguinte:
"${userBrokerMessage}"

Sua tarefa:
1. **Reação do Cliente:** Responda como o cliente reagiria à resposta do corretor (de forma realista).
2. **Avaliação do Treinador (Nota de 0 a 10):**
   - O que o novato fez de certo.
   - O que ele pode melhorar para fechar o negócio.
   - A resposta perfeita recomendada pela metodologia Morada Digital.`;

    try {
      const result = await askBrokerAI(prompt, 'Treinamento de Corretores Novatos');
      setAiClientResponse(result);
      showToast('Simulação avaliada pela IA com feedback detalhado!', 'Treinamento Concluído', 'crm');
    } catch {
      showToast('Erro ao processar simulação. Tente novamente.', 'Erro', 'info');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-[#0B2545] text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Academia Morada Digital • Formação Oficial de Corretores de Ponta</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Apostila Definitiva & Cartões de Treinamento com IA
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              O Guia Completo e Prático de Gestão, Operação e Alavancagem Imobiliária (Módulos 1 ao 5) com scripts prontos, cláusulas jurídicas e simulador interativo de negociação com IA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Simulador de Roleplay com IA</span>
            </button>
          </div>
        </div>

        {/* Primary Academy Mode Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveMainTab('apostila')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'apostila'
                ? 'bg-amber-400 text-slate-950 shadow-lg font-black'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Apostila Definitiva (Manual Completo)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('cartoes')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'cartoes'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/80'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Cartões Práticos por Etapa (6)</span>
          </button>

          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 bg-slate-900/60 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Abrir Simulador de IA</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: APOSTILA DEFINITIVA (MANUAL COMPLETO COM SCRIPTS & CLÁUSULAS)   */}
      {/* ========================================================================= */}
      {activeMainTab === 'apostila' && (
        <div className="space-y-6">
          {/* Module Selector Ribbon */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
            {APOSTILA_MODULES.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedApostilaModule(mod.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  selectedApostilaModule === mod.id
                    ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono ${
                  selectedApostilaModule === mod.id ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {mod.id === 0 ? '★' : mod.id}
                </span>
                <span>{mod.id === 0 ? 'Introdução' : `Módulo ${mod.id}`}</span>
              </button>
            ))}
          </div>

          {/* Active Module Content */}
          {(() => {
            const currentMod = APOSTILA_MODULES.find(m => m.id === selectedApostilaModule) || APOSTILA_MODULES[0];
            return (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">
                
                {/* Module Heading */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[11px] mb-2">
                      <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                      <span>{currentMod.code}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                      {currentMod.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      {currentMod.tagline}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Diretriz Oficial Morada Digital</span>
                  </div>
                </div>

                {/* Sections List */}
                <div className="space-y-8">
                  {currentMod.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-4 pt-2">
                      <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>{sec.subtitle}</span>
                      </h4>

                      {/* O Que Fazer & O Que Não Fazer Grid */}
                      {(sec.whatToDo || sec.whatNotToDo) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sec.whatToDo && (
                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-2">
                              <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold text-xs">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>O QUE FAZER (Prática Correta)</span>
                              </div>
                              <p className="text-slate-800 text-xs leading-relaxed font-medium">
                                {sec.whatToDo}
                              </p>
                              {sec.whyWhatToDo && (
                                <div className="pt-2 border-t border-emerald-200/60 text-[11.5px] text-emerald-800">
                                  <strong>Por quê:</strong> {sec.whyWhatToDo}
                                </div>
                              )}
                            </div>
                          )}

                          {sec.whatNotToDo && (
                            <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-5 space-y-2">
                              <div className="flex items-center gap-1.5 text-rose-900 font-extrabold text-xs">
                                <X className="w-4 h-4 text-rose-600" />
                                <span>O QUE NÃO FAZER (Risco Grave)</span>
                              </div>
                              <p className="text-slate-800 text-xs leading-relaxed font-medium">
                                {sec.whatNotToDo}
                              </p>
                              {sec.whyWhatNotToDo && (
                                <div className="pt-2 border-t border-rose-200/60 text-[11.5px] text-rose-800">
                                  <strong>Por quê:</strong> {sec.whyWhatNotToDo}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Bullet points if any */}
                      {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                          {sec.bulletPoints.map((bp, bidx) => (
                            <div key={bidx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                              <span className="font-bold text-slate-900 text-xs block">
                                {bp.label}
                              </span>
                              <p className="text-slate-600 text-xs leading-relaxed">
                                {bp.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Copyable Script or Contract Clause */}
                      {sec.scriptTitle && sec.scriptContent && (
                        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="font-bold text-amber-300 text-xs flex items-center gap-1.5">
                              <Copy className="w-3.5 h-3.5" />
                              <span>{sec.scriptTitle}</span>
                            </span>

                            <button
                              onClick={() => handleCopyText(sec.scriptContent!, sec.scriptTitle!, `script-${currentMod.id}-${idx}`)}
                              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                            >
                              {copiedKey === `script-${currentMod.id}-${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar Modelo</span>
                                </>
                              )}
                            </button>
                          </div>

                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 font-mono text-[11.5px] leading-relaxed text-slate-200 whitespace-pre-wrap select-all">
                            {sec.scriptContent}
                          </div>
                        </div>
                      )}

                      {sec.notes && (
                        <p className="text-xs text-slate-500 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                          {sec.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Navigation between modules */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  <button
                    disabled={selectedApostilaModule === 0}
                    onClick={() => setSelectedApostilaModule(prev => Math.max(0, prev - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs disabled:opacity-30 cursor-pointer"
                  >
                    ← Módulo Anterior
                  </button>

                  <button
                    onClick={() => setIsSimulatorOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Praticar este Módulo com IA</span>
                  </button>

                  <button
                    disabled={selectedApostilaModule === APOSTILA_MODULES.length - 1}
                    onClick={() => setSelectedApostilaModule(prev => Math.min(APOSTILA_MODULES.length - 1, prev + 1))}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs disabled:opacity-30 cursor-pointer"
                  >
                    Próximo Módulo →
                  </button>
                </div>

              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: CARTÕES PRÁTICOS DE FORMAÇÃO (6 CARDS + ROLEPLAY)                */}
      {/* ========================================================================= */}
      {activeMainTab === 'cartoes' && (
        <div className="space-y-6">
          {/* Categories Bar */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'todos', label: 'Todos os Módulos (6)' },
              { id: 'onboarding', label: '1. Primeiro Dia' },
              { id: 'captacao', label: '2. Captação & Angariação' },
              { id: 'atendimento', label: '3. Atendimento & WhatsApp' },
              { id: 'visitas', label: '4. Condução de Visitas' },
              { id: 'negociacao', label: '5. Negociação & Fechamento' },
              { id: 'marketing', label: '6. Marketing com IA' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div
                key={card.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all p-6 flex flex-col justify-between group cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div className="space-y-4">
                  {/* Card Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                      #{card.stepNumber}
                    </span>

                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Three Core Pillars Preview */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800 block text-[11px] mb-0.5 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-indigo-600" />
                        <span>O Que Fazer:</span>
                      </span>
                      <p className="text-slate-600 text-[11.5px] line-clamp-2">
                        {card.whatToDo}
                      </p>
                    </div>

                    <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900 block text-[11px] mb-0.5 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        <span>Regra de Ouro:</span>
                      </span>
                      <p className="text-amber-800 text-[11.5px] italic line-clamp-2">
                        "{card.goldenRule}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Card Action */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-600 group-hover:underline flex items-center gap-1">
                    <span>Ver Passo a Passo Completo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <span className="text-[10px] text-slate-400 font-medium">
                    {card.practicalChecklist.length} itens no checklist
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DETALHAMENTO DO CARTÃO DE TREINAMENTO                             */}
      {/* ========================================================================= */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-6 text-xs">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                  #{selectedCard.stepNumber}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedCard.title}</h3>
                  <p className="text-xs text-slate-500">{selectedCard.subtitle}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. O QUE FAZER */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>1. O QUE FAZER (Objetivo Principal)</span>
              </h4>
              <p className="text-slate-700 leading-relaxed text-[12px]">
                {selectedCard.whatToDo}
              </p>
            </div>

            {/* 2. COMO FAZER (Passo a Passo) */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>2. COMO FAZER PASSO A PASSO (Metodologia Morada Digital)</span>
              </h4>
              <div className="space-y-2">
                {selectedCard.howToDoSteps.map((step, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs text-[11.5px] text-slate-800 font-medium">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. QUAL A IMPORTÂNCIA */}
            <div className="bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100 space-y-1.5">
              <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>3. QUAL A IMPORTÂNCIA (Por que isso gera vendas?)</span>
              </h4>
              <p className="text-indigo-900 leading-relaxed text-[11.5px]">
                {selectedCard.whyItMatters}
              </p>
            </div>

            {/* 4. CHECKLIST PRÁTICO */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>4. CHECKLIST DO CORRETOR PROFISSIONAL</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCard.practicalChecklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. PRATIQUE COM A IA */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/60 p-4 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Pergunta recomendada para praticar no Simulador de IA:</span>
                </span>
              </div>
              <p className="text-amber-900 font-mono text-[11px] bg-white/80 p-2.5 rounded-xl border border-amber-200">
                "{selectedCard.aiPromptExample}"
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedCard(null);
                  setIsSimulatorOpen(true);
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Testar este módulo no Simulador de IA</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCard(null)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
              >
                Entendido / Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SIMULADOR DE ROLEPLAY COM IA PARA NOVATOS                        */}
      {/* ========================================================================= */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 space-y-5 text-xs">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Simulador de Roleplay & Prática com IA</span>
                </h3>
                <p className="text-xs text-slate-500">Pratique situações difíceis da vida real antes de falar com o cliente</p>
              </div>

              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scenario Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Selecione o Desafio do Treinamento:</label>
              <select
                value={simScenario}
                onChange={(e) => {
                  setSimScenario(e.target.value as any);
                  setAiClientResponse(null);
                }}
                className="w-full bg-slate-50 border border-slate-300 px-3 py-2 rounded-xl text-slate-800 font-bold"
              >
                <option value="objecao_preco">1. Cliente diz que o imóvel no Arvoredo está muito caro</option>
                <option value="recusa_comissao">2. Proprietário não quer pagar 6% de comissão nem exclusividade</option>
                <option value="termo_visita">3. Cliente recusa assinar o Termo de Visita na portaria</option>
                <option value="cliente_sumido">4. Cliente elogiou a casa na visita mas parou de responder no WhatsApp</option>
              </select>
            </div>

            {/* Scenario Prompt Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 text-[11.5px] leading-relaxed">
              <strong className="text-slate-900 block mb-1">Fala do Cliente / Situação:</strong>
              {simScenario === 'objecao_preco' && '"Achei essa casa no Arvoredo maravilhosa, mas 1.8 milhão está muito fora da realidade da região, só pago 1.5M à vista."'}
              {simScenario === 'recusa_comissao' && '"Não aceito pagar 6% de comissão. Se você quiser trazer comprador, meu teto de comissão é 2% e sem exclusividade."'}
              {simScenario === 'termo_visita' && '"Não vou assinar nenhum Termo de Visita nem passar meu CPF na portaria, não gosto de burocracia."'}
              {simScenario === 'cliente_sumido' && '"O cliente visitou o imóvel, elogiou muito a piscina, mas há 4 dias não responde suas mensagens no WhatsApp."'}
            </div>

            {/* User Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Sua Resposta como Corretor Novato:</label>
              <textarea
                rows={4}
                value={userBrokerMessage}
                onChange={(e) => setUserBrokerMessage(e.target.value)}
                placeholder="Escreva como você responderia ao cliente agora..."
                className="w-full bg-slate-50 border border-slate-300 p-3 rounded-xl text-slate-800 text-xs outline-none focus:border-indigo-500 focus:bg-white resize-y"
              />
            </div>

            <button
              type="button"
              disabled={isSimulating || !userBrokerMessage.trim()}
              onClick={handleSimulateRoleplay}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>A IA está analisando sua postura e técnica...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Enviar para Avaliação da IA</span>
                </>
              )}
            </button>

            {/* AI Feedback Box */}
            {aiClientResponse && (
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 text-xs">
                    <Award className="w-4 h-4" />
                    <span>Feedback do Treinador Sênior (IA Morada Digital)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Avaliação Concluída
                  </span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed text-slate-200 text-[11.5px] font-sans">
                  {aiClientResponse}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSimulatorOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer"
              >
                Fechar Simulador
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
