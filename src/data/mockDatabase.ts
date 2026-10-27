import { 
  Property, 
  Lead, 
  Proposal, 
  User, 
  SearchFilterState,
  Cliente,
  Visita,
  AgendaEvent,
  Contrato,
  Locacao,
  Comissao,
  FinancialTransaction,
  MarketingCampaign,
  DEFAULT_ADMIN_PERMISSIONS,
  DEFAULT_CORRETOR_PERMISSIONS,
  AgencyFinancialSettings,
  SocialMediaConfig,
  DashboardConfig
} from '../types';

export const MORADA_BRAND = {
  name: 'Morada Digital',
  legalName: 'Morada Digital Intermediação Imobiliária Ltda.',
  tagline: 'A paz de encontrar o lugar onde você pertence.',
  creci: 'CRECI Jurídico nº 104.900-J/MG',
  phone: '(31) 3357-3030', // Telefone Fixo Principal
  landlinePhone: '(31) 3357-3030', // Telefone Fixo
  whatsapp: '(31) 98427-9865', // Plantão WhatsApp
  phoneClean: '3133573030',
  whatsappClean: '5531984279865',
  email: 'contato@moradadigital.com.br',
  address: 'Rua Pinheiro, 264 - Arvoredo, Contagem - MG',
  cep: '32113-230',
  city: 'Contagem',
  state: 'MG',
  model: 'Imobiliária 100% Digital com Base Operacional',
  isLaunch: true,
  launchYear: 2026,
  statusBadge: 'Lançamento Oficial 2026',
  logoUrl: '/assets/morada-logo.svg',
  heroBannerUrl: '/assets/aistudio/WhatsApp_Image_2026-10-20_at_23.26.06_d24aabb1.jpeg'
};

export const SHALOM_BRAND = MORADA_BRAND;

/**
 * BASE LIMPA COM APENAS 1 CASO DE EXEMPLO
 * Permite que a imobiliária inicie a utilização imediatamente com dados reais,
 * mantendo apenas 1 modelo de referência em cada módulo do sistema.
 */

// 1. IMÓVEL DE EXEMPLO (Suporta até 15 fotos)
export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    code: 'MD-1001',
    title: 'Casa de Alto Padrão com Varanda Gourmet e Piscina no Bairro Arvoredo',
    description: 'Exclusiva residência de alto padrão no Bairro Arvoredo em Contagem/MG. Living amplo com pé direito duplo integrado à varanda gourmet e piscina com cascata. 4 suítes máster com marcenaria planejada, cozinha ampla com bancadas em granito, 4 vagas de garagem e segurança especializada 24h. Localização nobre próxima à base operacional da Morada Digital.',
    type: 'casa_condominio',
    goal: 'venda',
    status: 'disponivel',
    price: 1850000,
    condoFee: 680,
    iptuAnnual: 2450,
    bedrooms: 4,
    suites: 4,
    bathrooms: 5,
    parkingSpots: 4,
    totalArea: 360,
    usableArea: 290,
    neighborhood: 'Arvoredo',
    city: 'Contagem',
    state: 'MG',
    address: 'Rua Pinheiro, 264 - Arvoredo',
    coordinates: { lat: -19.9208, lng: -44.0538 },
    features: [
      'Piscina Privativa', 
      'Varanda Gourmet', 
      'Churrasqueira', 
      'Portaria 24h', 
      'Ar Condicionado', 
      'Pet Friendly', 
      'Acabamento Premium', 
      'Armários Planejados'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    brokerId: 'usr-1',
    brokerName: 'Rodrigo Mendonça',
    brokerPhone: '(31) 98427-9865',
    brokerCreci: 'CRECI 189.442-F/MG',
    brokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    exclusive: true,
    featured: true,
    yearBuilt: 2024,
    floor: 2,
    portalsSynced: { zap: true, vivaReal: true, olx: true },
    createdAt: '2026-04-15'
  }
];

// 2. EQUIPE DE EXEMPLO (Diretor e Adm Geral + Corretor Credenciado com CRECI)
export const USERS_TEAM: User[] = [
  {
    id: 'usr-0',
    name: 'Daniel Gama',
    email: 'daniel.gama@moradadigital.com.br',
    role: 'admin',
    phone: '(31) 3357-3030',
    creci: 'CRECI 68.165-F/MG',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
    salesMonthVGV: 1850000,
    salesGoal: 5000000,
    cpf: '913.436.236-34',
    pixKey: '91343623634',
    pixKeyType: 'cpf',
    commissionRate: 100,
    rentalCommissionRate: 100,
    status: 'ativo',
    joinedDate: '01/01/2024',
    specialties: ['Direção Geral', 'Gestão Estratégica & Comercial', 'Negócios Imobiliários & Jurídico'],
    totalSalesVGV: 1850000,
    paidCommissions: 111000,
    pendingCommissions: 0,
    bio: 'Diretor e Administrador da Morada Digital. CRECI 68.165.',
    city: 'Contagem - MG',
    permissions: DEFAULT_ADMIN_PERMISSIONS
  },
  {
    id: 'usr-1',
    name: 'Rodrigo Mendonça',
    email: 'rodrigo.mendonca@moradadigital.com.br',
    role: 'corretor',
    phone: '(31) 98427-9865',
    creci: 'CRECI 189.442-F/MG',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    activeLeadsCount: 1,
    salesMonthVGV: 1850000,
    salesGoal: 3000000,
    cpf: '219.458.706-33',
    pixKey: '219.458.706-33',
    pixKeyType: 'cpf',
    commissionRate: 45, // 45% do honorário da imobiliária
    rentalCommissionRate: 50, // 50% do 1º aluguel
    status: 'ativo',
    joinedDate: '15/03/2024',
    specialties: ['Alto Padrão', 'Condomínios Fechados', 'Bairro Arvoredo'],
    totalSalesVGV: 1850000,
    paidCommissions: 49950,
    pendingCommissions: 48060,
    city: 'Contagem / Belo Horizonte - MG',
    permissions: DEFAULT_CORRETOR_PERMISSIONS
  }
];

// 3. LEAD DE EXEMPLO
export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    name: 'Dr. Fernando Albuquerque',
    email: 'fernando.albuquerque@cardio.med.br',
    phone: '(31) 98427-9865',
    interestType: 'venda',
    budgetMin: 1500000,
    budgetMax: 2200000,
    preferredNeighborhoods: ['Arvoredo', 'Cabral'],
    preferredPropertyTypes: ['casa_condominio'],
    stage: 'proposta_enviada',
    origin: 'whatsapp_direto',
    assignedBrokerId: 'usr-1',
    assignedBrokerName: 'Rodrigo Mendonça',
    assignedBrokerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    propertyOfInterestId: 'prop-1',
    propertyOfInterestTitle: 'Casa de Alto Padrão no Bairro Arvoredo',
    propertyOfInterestCode: 'MD-1001',
    notes: 'Cliente médico cirurgião, busca casa ampla com piscina e espaço gourmet para a família em Contagem. Fez proposta inicial com sinal facilitado.',
    score: 'quente',
    lastContactAt: 'Há 1 hora',
    createdAt: '2026-04-16',
    interactions: [
      { id: 'i-1', date: '16/04/2026 10:15', type: 'whatsapp', description: 'Lead recebido via WhatsApp Oficial da Morada Digital interessado na casa do Bairro Arvoredo.', author: 'Atendimento Digital' },
      { id: 'i-2', date: '17/04/2026 14:30', type: 'ligacao', description: 'Contato telefônico realizado com Dr. Fernando. Perfil qualificado com recursos próprios e financiamento pré-aprovado.', author: 'Rodrigo Mendonça' },
      { id: 'i-3', date: '19/04/2026 15:00', type: 'visita', description: 'Visita guiada ao imóvel MD-1001 com a família. Excelente aceitação da área gourmet e suítes.', author: 'Rodrigo Mendonça' },
      { id: 'i-4', date: '21/04/2026 11:20', type: 'proposta', description: 'Formalizada proposta formal no valor de R$ 1.780.000.', author: 'Rodrigo Mendonça' }
    ]
  }
];

// 4. PROPOSTA DE EXEMPLO
export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'prop-rec-1',
    code: 'MD-PROP-001',
    leadId: 'lead-101',
    leadName: 'Dr. Fernando Albuquerque',
    leadPhone: '(31) 98427-9865',
    propertyId: 'prop-1',
    propertyCode: 'MD-1001',
    propertyTitle: 'Casa de Alto Padrão com Varanda Gourmet e Piscina no Bairro Arvoredo',
    propertyAskingPrice: 1850000,
    offeredPrice: 1780000,
    paymentMethod: 'financiamento',
    downPayment: 360000,
    status: 'em_analise',
    brokerId: 'usr-1',
    brokerName: 'Rodrigo Mendonça',
    commissionRate: 6,
    commissionTotal: 106800,
    commissionBrokerPart: 48060,
    commissionAgencyPart: 58740,
    validUntil: '2026-04-30',
    notes: 'Sinal de 20% + saldo financiado via Caixa / Itaú já com carta de crédito pré-aprovada.',
    createdAt: '2026-04-21'
  }
];

// 5. CLIENTE DE EXEMPLO
export const INITIAL_CLIENTES: Cliente[] = [
  {
    id: 'cli-1',
    name: 'Dr. Eduardo Siqueira',
    email: 'eduardo.siqueira@medicina.br',
    phone: '(31) 99872-3341',
    cpfCnpj: '249.810.748-12',
    type: 'comprador',
    status: 'em_negociacao',
    budgetMax: 2000000,
    preferredNeighborhoods: ['Arvoredo', 'Cabral', 'Eldorado'],
    notes: 'Médico comprador qualificado buscando imóvel pronto para morar no Bairro Arvoredo.',
    city: 'Contagem - MG',
    createdAt: '2026-04-10'
  }
];

// 6. VISITA DE EXEMPLO
export const INITIAL_VISITAS: Visita[] = [
  {
    id: 'vis-1',
    code: 'VIS-1001',
    propertyId: 'prop-1',
    propertyCode: 'MD-1001',
    propertyTitle: 'Casa de Alto Padrão no Bairro Arvoredo',
    propertyAddress: 'Rua Pinheiro, 264 - Arvoredo, Contagem - MG',
    leadOrClientName: 'Dr. Eduardo Siqueira',
    leadOrClientPhone: '(31) 99872-3341',
    brokerId: 'usr-1',
    brokerName: 'Rodrigo Mendonça',
    date: '2026-04-23',
    time: '15:30',
    status: 'agendada',
    keyLocation: 'Base Operacional Morada Digital (Rua Pinheiro, 264 - Arvoredo)',
    termSigned: false,
    notes: 'Visita agendada com envio prévio do catálogo digital ao cliente.',
    createdAt: '2026-04-21'
  }
];

// 7. AGENDA DE EXEMPLO
export const INITIAL_AGENDA: AgendaEvent[] = [
  {
    id: 'age-1',
    title: 'Visita Imóvel MD-1001 - Dr. Eduardo Siqueira',
    type: 'visita',
    date: '2026-04-23',
    time: '15:30',
    brokerId: 'usr-1',
    brokerName: 'Rodrigo Mendonça',
    clientName: 'Dr. Eduardo Siqueira',
    location: 'Rua Pinheiro, 264 - Arvoredo, Contagem',
    notes: 'Apresentação completa das 4 suítes e área de lazer com piscina.',
    completed: false
  }
];

// 8. CONTRATO DE EXEMPLO
export const INITIAL_CONTRATOS: Contrato[] = [
  {
    id: 'ctr-1',
    code: 'CTR-2026-001',
    type: 'venda',
    propertyId: 'prop-1',
    propertyCode: 'MD-1001',
    propertyTitle: 'Casa de Alto Padrão no Bairro Arvoredo',
    clientName: 'Dr. Fernando Albuquerque',
    clientCpf: '219.458.706-33',
    ownerName: 'Espólio Morada Patrimonial Ltda',
    ownerCpf: '14.882.190/0001-34',
    brokerName: 'Rodrigo Mendonça',
    value: 1780000,
    warrantyType: 'nenhuma',
    adjustmentIndex: 'IPCA',
    startDate: '2026-04-21',
    endDate: '2026-05-21',
    status: 'minuta',
    electronicSignatureUrl: 'https://zapsign.co/doc/ctr-2026-001',
    notes: 'Minuta de promessa de compra e venda elaborada conforme arts. 722 a 729 do Código Civil Brasileiro.'
  }
];

// 9. LOCAÇÃO DE EXEMPLO
export const INITIAL_LOCACOES: Locacao[] = [
  {
    id: 'loc-1',
    code: 'LOC-1001',
    propertyId: 'prop-1',
    propertyCode: 'MD-1001',
    propertyTitle: 'Casa de Alto Padrão com Piscina - Arvoredo',
    propertyAddress: 'Rua Pinheiro, 264 - Arvoredo, Contagem - MG',
    tenantName: 'Carlos Alberto Mendonça',
    tenantPhone: '(31) 98455-1122',
    ownerName: 'Morada Administração Patrimonial',
    ownerPhone: '(31) 98427-9865',
    monthlyRent: 8500,
    condoFee: 680,
    iptuMonthly: 204,
    adminFeePercent: 8,
    adminFeeValue: 680,
    ownerNetTransfer: 7820,
    paymentDueDay: 10,
    currentMonthStatus: 'pago',
    lastPaymentDate: '2026-04-10',
    contractEndDate: '2028-04-09',
    nextReadjustmentDate: '2027-04-01',
    warranty: 'Seguro Fiança Porto Seguro'
  }
];

// 10. COMISSÃO DE EXEMPLO
export const INITIAL_COMISSOES: Comissao[] = [
  {
    id: 'com-1',
    code: 'COM-1001',
    dealType: 'venda',
    propertyCode: 'MD-1001',
    propertyTitle: 'Casa de Alto Padrão no Bairro Arvoredo',
    totalDealValue: 1780000,
    totalCommissionRate: 6,
    totalCommissionValue: 106800,
    agencyShareRate: 3.3,
    agencyShareValue: 58740,
    brokerId: 'usr-1',
    brokerName: 'Rodrigo Mendonça',
    brokerShareRate: 2.7,
    brokerShareValue: 48060,
    status: 'a_receber',
    dealDate: '2026-04-21'
  }
];

// 11. FINANCEIRO DE EXEMPLO
export const INITIAL_FINANCIAL: FinancialTransaction[] = [
  {
    id: 'fin-1',
    description: 'Honorários de Intermediação Imobiliária (MD-1001)',
    category: 'comissao_venda',
    type: 'receita',
    amount: 106800,
    date: '2026-04-21',
    dueDate: '2026-04-30',
    status: 'pendente',
    paymentMethod: 'ted'
  }
];

// 12. MARKETING DE EXEMPLO
export const INITIAL_MARKETING: MarketingCampaign[] = [
  {
    id: 'mkt-1',
    name: 'Lançamento Oficial Morada Digital - Bairro Arvoredo & Região Metropolitana',
    channel: 'meta_ads',
    budget: 3500,
    spent: 1200,
    leadsGenerated: 48,
    cpl: 25.00,
    roas: 14.2,
    status: 'ativa',
    headline: 'Descubra a tranquilidade de encontrar seu lar no Bairro Arvoredo com a Morada Digital.'
  }
];

export const DEFAULT_FINANCIAL_SETTINGS: AgencyFinancialSettings = {
  defaultSalesCommissionRate: 6.0,
  agencySplitPercent: 55.0,
  brokerSplitPercent: 45.0,
  defaultRentalAdminFeePercent: 8.0,
  bankName: 'Banco Itaú Unibanco S.A.',
  bankCode: '341',
  agencyNumber: '3182',
  accountNumber: '48920-1',
  accountHolder: 'Morada Digital Negócios Imobiliários Ltda',
  cnpj: '31.284.992/0001-44',
  pixKey: 'financeiro@moradadigital.com.br',
  pixKeyType: 'email',
  escrowAccountNotes: 'Conta caução e repasse com liquidação D+1 automatizada via Pix e TED.'
};

export const DEFAULT_SOCIAL_MEDIA_CONFIG: SocialMediaConfig = {
  instagramUrl: 'https://instagram.com/moradadigital.imoveis',
  facebookUrl: 'https://facebook.com/moradadigital.mg',
  youtubeUrl: 'https://youtube.com/@moradadigital.oficial',
  tiktokUrl: 'https://tiktok.com/@moradadigital',
  linkedinUrl: 'https://linkedin.com/company/morada-digital-imoveis',
  whatsappBusinessNumber: '(31) 98427-9865',
  whatsappDirectLink: 'https://wa.me/5531984279865?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis.',
  bioSlogan: 'Morada Digital • 100% Digital • Imóveis selecionados em Contagem e Grande BH.',
  metaPixelId: 'PIXEL-MD-882914-CONTAGEM',
  googleAnalyticsId: 'G-MD94820194',
  googleTagManagerId: 'GTM-MD84920'
};

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  layoutDensity: 'padrao',
  monthlyTargetVGV: 10000000,
  monthlyPropertiesTarget: 10,
  widgets: {
    kpis: true,
    chartPropertiesVolume: true,
    chartOpenSales: true,
    chartBrokerPerformance: true,
    chartPortfolioDistribution: true,
    criticalDeals: true,
    quickActions: true,
    conversionTargetBanner: true
  }
};

// ESTADO INICIAL DE FILTROS DO SITE PÚBLICO
export const INITIAL_FILTER_STATE: SearchFilterState = {
  goal: 'venda',
  type: 'todos',
  location: '',
  minPrice: 0,
  maxPrice: 15000000,
  bedrooms: 'qualquer',
  suites: 'qualquer',
  parking: 'qualquer',
  minArea: 0,
  features: [],
  sortBy: 'relevancia'
};

