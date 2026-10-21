export type PropertyType = 
  | 'apartamento' 
  | 'casa' 
  | 'casa_condominio' 
  | 'cobertura' 
  | 'studio' 
  | 'terreno' 
  | 'comercial';

export type PropertyGoal = 'venda' | 'locacao' | 'lancamento';

export type PropertyStatus = 'disponivel' | 'reservado' | 'vendido' | 'alugado' | 'inativo';

export interface Property {
  id: string;
  code: string; // Ex: MD-4029
  title: string;
  description: string;
  type: PropertyType;
  goal: PropertyGoal;
  status: PropertyStatus;
  price: number;
  condoFee?: number;
  iptuAnnual?: number;
  rentalPrice?: number;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpots: number;
  totalArea: number; // m²
  usableArea: number; // m²
  neighborhood: string;
  city: string;
  state: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[]; // ['Piscina', 'Varanda Gourmet', 'Churrasqueira', 'Portaria 24h', 'Academia', 'Pet Friendly', 'Mobiliado', 'Ar Condicionado']
  images: string[];
  videoUrl?: string;
  virtualTourUrl?: string;
  brokerId: string;
  brokerName: string;
  brokerPhone: string;
  brokerCreci: string;
  brokerAvatar: string;
  exclusive: boolean;
  featured: boolean;
  yearBuilt?: number;
  floor?: number;
  portalsSynced?: {
    zap: boolean;
    vivaReal: boolean;
    olx: boolean;
  };
  createdAt: string;
}

export type LeadStage = 
  | 'novo' 
  | 'contato_realizado' 
  | 'visita_agendada' 
  | 'proposta_enviada' 
  | 'fechado_ganho' 
  | 'perdido';

export type LeadOrigin = 
  | 'site_direto' 
  | 'portal_zap' 
  | 'portal_vivareal' 
  | 'portal_olx' 
  | 'instagram_ads' 
  | 'indicacao' 
  | 'whatsapp_direto';

export interface LeadInteraction {
  id: string;
  date: string;
  type: 'nota' | 'ligacao' | 'whatsapp' | 'visita' | 'proposta';
  description: string;
  author: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestType: PropertyGoal;
  budgetMin?: number;
  budgetMax: number;
  preferredNeighborhoods: string[];
  preferredPropertyTypes: PropertyType[];
  stage: LeadStage;
  origin: LeadOrigin;
  assignedBrokerId: string;
  assignedBrokerName: string;
  assignedBrokerAvatar: string;
  propertyOfInterestId?: string;
  propertyOfInterestTitle?: string;
  propertyOfInterestCode?: string;
  notes: string;
  score: 'frio' | 'morno' | 'quente';
  lastContactAt: string;
  createdAt: string;
  interactions: LeadInteraction[];
  visitDate?: string;
}

export type ProposalStatus = 'em_analise' | 'aceita' | 'contraproposta' | 'recusada' | 'contrato_assinado';

export interface Proposal {
  id: string;
  code: string;
  leadId: string;
  leadName: string;
  leadPhone: string;
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAskingPrice: number;
  offeredPrice: number;
  paymentMethod: 'a_vista' | 'financiamento' | 'fgts_financiamento' | 'parcelamento_direto' | 'permuta';
  downPayment: number;
  status: ProposalStatus;
  brokerId: string;
  brokerName: string;
  commissionRate: number; // ex: 6%
  commissionTotal: number;
  commissionBrokerPart: number; // ex: 2.5%
  commissionAgencyPart: number; // ex: 3.5%
  counterOfferPrice?: number;
  validUntil: string;
  notes?: string;
  createdAt: string;
}

export type UserRole = 'admin' | 'gerente' | 'corretor' | 'proprietario' | 'cliente';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  creci?: string;
  avatar: string;
  activeLeadsCount?: number;
  salesMonthVGV?: number;
  salesGoal?: number;
}

export type SidebarModule = 
  // Operacional
  | 'dashboard'
  | 'imoveis'
  | 'clientes'
  // Comercial
  | 'leads'
  | 'agenda'
  | 'visitas'
  | 'propostas'
  | 'contratos'
  | 'locacoes'
  // Financeiro
  | 'comissoes'
  | 'financeiro'
  // Sistema
  | 'marketing'
  | 'configuracoes';

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  type: 'comprador' | 'proprietario' | 'locatario' | 'investidor';
  status: 'ativo' | 'em_negociacao' | 'contrato_assinado' | 'inativo';
  budgetMax?: number;
  preferredNeighborhoods?: string[];
  notes?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export type VisitaStatus = 'agendada' | 'confirmada' | 'realizada' | 'cancelada';

export interface Visita {
  id: string;
  code: string; // Ex: VIS-2041
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  leadOrClientName: string;
  leadOrClientPhone: string;
  brokerId: string;
  brokerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: VisitaStatus;
  keyLocation: string; // ex: "Portaria social com identificação", "Base Operacional Pinheiro 264", "Proprietário no imóvel"
  feedbackRating?: number; // 1 to 5
  feedbackComment?: string;
  termSigned: boolean;
  notes?: string;
  createdAt: string;
}

export interface AgendaEvent {
  id: string;
  title: string;
  type: 'visita' | 'reuniao' | 'vistoria' | 'assinatura' | 'fechamento';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  brokerId: string;
  brokerName: string;
  clientName?: string;
  location?: string;
  notes?: string;
  completed: boolean;
}

export type ContratoStatus = 'minuta' | 'aguardando_assinatura' | 'assinado' | 'vigente' | 'encerrado';

export interface Contrato {
  id: string;
  code: string; // Ex: CTR-2026-081
  type: 'venda' | 'locacao_residencial' | 'locacao_comercial';
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  clientName: string;
  clientCpf: string;
  ownerName: string;
  ownerCpf: string;
  brokerName: string;
  value: number; // Valor de venda ou valor total do contrato de locação
  monthlyRent?: number;
  warrantyType: 'seguro_fianca' | 'caucao' | 'fiador' | 'titulo_capitalizacao' | 'nenhuma';
  adjustmentIndex: 'IPCA' | 'IGPM' | 'INPC';
  startDate: string;
  endDate: string;
  status: ContratoStatus;
  electronicSignatureUrl?: string;
  signedAt?: string;
  notes?: string;
}

export interface Locacao {
  id: string;
  code: string; // Ex: LOC-4401
  propertyId: string;
  propertyCode: string;
  propertyTitle: string;
  propertyAddress: string;
  tenantName: string;
  tenantPhone: string;
  ownerName: string;
  ownerPhone: string;
  monthlyRent: number;
  condoFee: number;
  iptuMonthly: number;
  adminFeePercent: number; // ex: 8%
  adminFeeValue: number; // R$
  ownerNetTransfer: number; // R$
  paymentDueDay: number; // Dia 10
  currentMonthStatus: 'pago' | 'em_aberto' | 'atrasado';
  lastPaymentDate?: string;
  contractEndDate: string;
  nextReadjustmentDate: string;
  warranty: string;
}

export interface Comissao {
  id: string;
  code: string; // Ex: COM-1092
  dealType: 'venda' | 'locacao';
  propertyCode: string;
  propertyTitle: string;
  totalDealValue: number;
  totalCommissionRate: number; // ex: 6%
  totalCommissionValue: number;
  agencyShareRate: number; // ex: 3%
  agencyShareValue: number;
  brokerId: string;
  brokerName: string;
  brokerShareRate: number; // ex: 2%
  brokerShareValue: number;
  captadorBrokerId?: string;
  captadorBrokerName?: string;
  captadorShareRate?: number; // ex: 1%
  captadorShareValue?: number;
  status: 'a_receber' | 'liberado' | 'pago';
  dealDate: string;
  paymentDate?: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  category: 'comissao_venda' | 'taxa_locacao' | 'marketing' | 'portais' | 'sede_operacional' | 'sistemas_crm' | 'juridico' | 'outros';
  type: 'receita' | 'despesa';
  amount: number;
  date: string;
  dueDate: string;
  status: 'pago' | 'pendente' | 'agendado';
  paymentMethod: 'pix' | 'ted' | 'boleto' | 'cartao';
}

export interface MarketingCampaign {
  id: string;
  name: string;
  channel: 'meta_ads' | 'google_ads' | 'portal_zap' | 'portal_vivareal' | 'whatsapp';
  budget: number;
  spent: number;
  leadsGenerated: number;
  cpl: number; // Custo por lead
  roas: number; // Retorno
  status: 'ativa' | 'pausada' | 'concluida';
  headline: string;
}

export interface SearchFilterState {
  goal: PropertyGoal;
  type: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  suites: string;
  parking: string;
  minArea: number;
  features: string[];
  sortBy: 'relevancia' | 'menor_preco' | 'maior_preco' | 'mais_recentes';
}

