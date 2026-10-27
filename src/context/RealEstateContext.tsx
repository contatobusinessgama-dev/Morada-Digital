import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, 
  Lead, 
  Proposal, 
  User, 
  SearchFilterState, 
  LeadStage, 
  PropertyStatus,
  SidebarModule,
  Cliente,
  Visita,
  VisitaStatus,
  AgendaEvent,
  Contrato,
  ContratoStatus,
  Locacao,
  Comissao,
  FinancialTransaction,
  MarketingCampaign,
  AgencyFinancialSettings,
  SocialMediaConfig,
  DashboardConfig,
  DEFAULT_ADMIN_PERMISSIONS
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_LEADS, 
  INITIAL_PROPOSALS, 
  USERS_TEAM, 
  INITIAL_FILTER_STATE,
  INITIAL_CLIENTES,
  INITIAL_VISITAS,
  INITIAL_AGENDA,
  INITIAL_CONTRATOS,
  INITIAL_LOCACOES,
  INITIAL_COMISSOES,
  INITIAL_FINANCIAL,
  INITIAL_MARKETING,
  DEFAULT_FINANCIAL_SETTINGS,
  DEFAULT_SOCIAL_MEDIA_CONFIG,
  DEFAULT_DASHBOARD_CONFIG
} from '../data/mockDatabase';

export interface ToastNotification {
  id: string;
  message: string;
  title?: string;
  type: 'success' | 'info' | 'favorite' | 'crm';
}

interface RealEstateContextType {
  // Navigation / Views: Public Site vs CRM System
  currentView: 'public' | 'system';
  setCurrentView: (view: 'public' | 'system') => void;
  isSystemAuthenticated: boolean;
  authenticateSystem: (password: string) => boolean;
  logoutSystem: () => void;
  isPasswordModalOpen: boolean;
  setIsPasswordModalOpen: (open: boolean) => void;
  requestSystemAccess: () => void;

  // Active Sidebar Module (from user screenshot)
  activeModule: SidebarModule;
  setActiveModule: (module: SidebarModule) => void;

  // Current logged in user in CRM & Team of Brokers
  currentUser: User;
  setCurrentUser: (user: User) => void;
  team: User[];
  addBroker: (brokerData: Omit<User, 'id'>) => User;
  updateBroker: (id: string, brokerData: Partial<User>) => void;
  deleteBroker: (id: string) => void;

  // Properties State & Actions
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  searchFilters: SearchFilterState;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  addProperty: (property: Omit<Property, 'id' | 'code' | 'createdAt'>) => Property;
  updateProperty: (id: string, updatedData: Partial<Property>) => void;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;
  deleteProperty: (id: string) => void;

  // Clientes
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'createdAt'>) => Cliente;

  // Leads & CRM State & Actions
  leads: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  moveLeadStage: (leadId: string, newStage: LeadStage) => void;
  addLead: (leadData: Partial<Lead>) => Lead;
  updateLead: (id: string, updated: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addLeadInteraction: (leadId: string, description: string, type: 'nota' | 'ligacao' | 'whatsapp' | 'visita' | 'proposta') => void;

  // Visitas
  visitas: Visita[];
  selectedVisita: Visita | null;
  setSelectedVisita: (visita: Visita | null) => void;
  addVisita: (visita: Omit<Visita, 'id' | 'code' | 'createdAt'>) => Visita;
  updateVisitaStatus: (id: string, status: VisitaStatus) => void;
  updateVisita: (id: string, updated: Partial<Visita>) => void;
  deleteVisita: (id: string) => void;
  addVisitaFeedback: (id: string, rating: number, comment: string) => void;

  // Agenda
  agendaEvents: AgendaEvent[];
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  updateAgendaEvent: (id: string, updated: Partial<AgendaEvent>) => void;
  deleteAgendaEvent: (id: string) => void;
  toggleAgendaCompleted: (id: string) => void;

  // Proposals
  proposals: Proposal[];
  addProposal: (proposalData: Omit<Proposal, 'id' | 'code' | 'createdAt'>) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;
  updateProposal: (id: string, updated: Partial<Proposal>) => void;
  deleteProposal: (id: string) => void;

  // Contratos
  contratos: Contrato[];
  addContrato: (contrato: Omit<Contrato, 'id' | 'code'>) => void;
  updateContratoStatus: (id: string, status: ContratoStatus) => void;
  updateContrato: (id: string, updated: Partial<Contrato>) => void;
  deleteContrato: (id: string) => void;

  // Locações
  locacoes: Locacao[];
  updateLocacaoStatus: (id: string, status: 'pago' | 'em_aberto' | 'atrasado') => void;
  updateLocacao: (id: string, updated: Partial<Locacao>) => void;
  deleteLocacao: (id: string) => void;

  // Comissões
  comissoes: Comissao[];
  updateComissaoStatus: (id: string, status: 'a_receber' | 'liberado' | 'pago') => void;
  addComissao: (comissao: Omit<Comissao, 'id'>) => void;
  updateComissao: (id: string, updated: Partial<Comissao>) => void;
  deleteComissao: (id: string) => void;

  // Financeiro (Fluxo de Caixa & Configurações da Agência)
  financialTransactions: FinancialTransaction[];
  addFinancialTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;
  updateFinancialTransaction: (id: string, updated: Partial<FinancialTransaction>) => void;
  deleteFinancialTransaction: (id: string) => void;
  financialSettings: AgencyFinancialSettings;
  updateFinancialSettings: (settings: Partial<AgencyFinancialSettings>) => void;

  // Marketing & Redes Sociais
  marketingCampaigns: MarketingCampaign[];
  addMarketingCampaign: (campaign: Omit<MarketingCampaign, 'id'>) => void;
  updateMarketingCampaign: (id: string, updated: Partial<MarketingCampaign>) => void;
  deleteMarketingCampaign: (id: string) => void;
  toggleCampaignStatus: (id: string) => void;
  socialMediaConfig: SocialMediaConfig;
  updateSocialMediaConfig: (config: Partial<SocialMediaConfig>) => void;

  // Dashboard Ferramentas & Customização
  dashboardConfig: DashboardConfig;
  updateDashboardConfig: (config: Partial<DashboardConfig>) => void;
  resetDashboardConfig: () => void;

  // Helpers
  resetToInitialDemo: () => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, title?: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export const RealEstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'system'>(() => {
    const saved = localStorage.getItem('morada_current_view');
    return (saved === 'system' || saved === 'public') ? saved : 'public';
  });

  const [isSystemAuthenticated, setIsSystemAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('morada_crm_auth') === 'true';
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Start on 'visitas' which is the highlighted module in user's screenshot!
  const [activeModule, setActiveModule] = useState<SidebarModule>('visitas');

  // Load from LocalStorage if available (v3 represents clean single-case operational start)
  const isMigrated = typeof window !== 'undefined' && localStorage.getItem('morada_data_version') === 'v3_single_case';

  const [properties, setProperties] = useState<Property[]>(() => {
    if (!isMigrated) return INITIAL_PROPERTIES;
    const saved = localStorage.getItem('morada_properties_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    if (!isMigrated) return INITIAL_CLIENTES;
    const saved = localStorage.getItem('morada_clientes_v3');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    if (!isMigrated) return INITIAL_LEADS;
    const saved = localStorage.getItem('morada_leads_v3');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [visitas, setVisitas] = useState<Visita[]>(() => {
    if (!isMigrated) return INITIAL_VISITAS;
    const saved = localStorage.getItem('morada_visitas_v3');
    return saved ? JSON.parse(saved) : INITIAL_VISITAS;
  });

  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => {
    if (!isMigrated) return INITIAL_AGENDA;
    const saved = localStorage.getItem('morada_agenda_v3');
    return saved ? JSON.parse(saved) : INITIAL_AGENDA;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    if (!isMigrated) return INITIAL_PROPOSALS;
    const saved = localStorage.getItem('morada_proposals_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [contratos, setContratos] = useState<Contrato[]>(() => {
    if (!isMigrated) return INITIAL_CONTRATOS;
    const saved = localStorage.getItem('morada_contratos_v3');
    return saved ? JSON.parse(saved) : INITIAL_CONTRATOS;
  });

  const [locacoes, setLocacoes] = useState<Locacao[]>(() => {
    if (!isMigrated) return INITIAL_LOCACOES;
    const saved = localStorage.getItem('morada_locacoes_v3');
    return saved ? JSON.parse(saved) : INITIAL_LOCACOES;
  });

  const [comissoes, setComissoes] = useState<Comissao[]>(() => {
    if (!isMigrated) return INITIAL_COMISSOES;
    const saved = localStorage.getItem('morada_comissoes_v3');
    return saved ? JSON.parse(saved) : INITIAL_COMISSOES;
  });

  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => {
    if (!isMigrated) return INITIAL_FINANCIAL;
    const saved = localStorage.getItem('morada_financial_v3');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL;
  });

  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(() => {
    if (!isMigrated) return INITIAL_MARKETING;
    const saved = localStorage.getItem('morada_marketing_v3');
    return saved ? JSON.parse(saved) : INITIAL_MARKETING;
  });

  const [team, setTeam] = useState<User[]>(() => {
    if (!isMigrated) return USERS_TEAM;
    const saved = localStorage.getItem('morada_team_v3');
    if (!saved) return USERS_TEAM;
    try {
      const parsed: User[] = JSON.parse(saved);
      // Ensure Daniel Gama as usr-0 director and admin
      return parsed.map(u => u.id === 'usr-0' ? {
        ...u,
        name: 'Daniel Gama',
        creci: 'CRECI 68.165-F/MG',
        cpf: '913.436.236-34',
        phone: '(31) 3357-3030',
        role: 'admin' as const,
        permissions: DEFAULT_ADMIN_PERMISSIONS
      } : u);
    } catch {
      return USERS_TEAM;
    }
  });

  const [financialSettings, setFinancialSettings] = useState<AgencyFinancialSettings>(() => {
    if (!isMigrated) return DEFAULT_FINANCIAL_SETTINGS;
    const saved = localStorage.getItem('morada_financial_settings_v3');
    return saved ? JSON.parse(saved) : DEFAULT_FINANCIAL_SETTINGS;
  });

  const [socialMediaConfig, setSocialMediaConfig] = useState<SocialMediaConfig>(() => {
    if (!isMigrated) return DEFAULT_SOCIAL_MEDIA_CONFIG;
    const saved = localStorage.getItem('morada_social_media_v3');
    return saved ? JSON.parse(saved) : DEFAULT_SOCIAL_MEDIA_CONFIG;
  });

  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>(() => {
    if (!isMigrated) return DEFAULT_DASHBOARD_CONFIG;
    const saved = localStorage.getItem('morada_dashboard_config_v3');
    return saved ? JSON.parse(saved) : DEFAULT_DASHBOARD_CONFIG;
  });

  const [currentUser, setCurrentUser] = useState<User>(team[0] || USERS_TEAM[0]); // Default to Admin
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>(INITIAL_FILTER_STATE);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Enforce single case mode migration once on load
  useEffect(() => {
    const version = localStorage.getItem('morada_data_version');
    if (version !== 'v3_single_case') {
      localStorage.setItem('morada_data_version', 'v3_single_case');
      localStorage.setItem('morada_properties_v3', JSON.stringify(INITIAL_PROPERTIES));
      localStorage.setItem('morada_clientes_v3', JSON.stringify(INITIAL_CLIENTES));
      localStorage.setItem('morada_leads_v3', JSON.stringify(INITIAL_LEADS));
      localStorage.setItem('morada_visitas_v3', JSON.stringify(INITIAL_VISITAS));
      localStorage.setItem('morada_agenda_v3', JSON.stringify(INITIAL_AGENDA));
      localStorage.setItem('morada_proposals_v3', JSON.stringify(INITIAL_PROPOSALS));
      localStorage.setItem('morada_contratos_v3', JSON.stringify(INITIAL_CONTRATOS));
      localStorage.setItem('morada_locacoes_v3', JSON.stringify(INITIAL_LOCACOES));
      localStorage.setItem('morada_comissoes_v3', JSON.stringify(INITIAL_COMISSOES));
      localStorage.setItem('morada_financial_v3', JSON.stringify(INITIAL_FINANCIAL));
      localStorage.setItem('morada_marketing_v3', JSON.stringify(INITIAL_MARKETING));
      localStorage.setItem('morada_team_v3', JSON.stringify(USERS_TEAM));
      localStorage.setItem('morada_financial_settings_v3', JSON.stringify(DEFAULT_FINANCIAL_SETTINGS));
      localStorage.setItem('morada_social_media_v3', JSON.stringify(DEFAULT_SOCIAL_MEDIA_CONFIG));
      localStorage.setItem('morada_dashboard_config_v3', JSON.stringify(DEFAULT_DASHBOARD_CONFIG));

      setProperties(INITIAL_PROPERTIES);
      setClientes(INITIAL_CLIENTES);
      setLeads(INITIAL_LEADS);
      setVisitas(INITIAL_VISITAS);
      setAgendaEvents(INITIAL_AGENDA);
      setProposals(INITIAL_PROPOSALS);
      setContratos(INITIAL_CONTRATOS);
      setLocacoes(INITIAL_LOCACOES);
      setComissoes(INITIAL_COMISSOES);
      setFinancialTransactions(INITIAL_FINANCIAL);
      setMarketingCampaigns(INITIAL_MARKETING);
      setTeam(USERS_TEAM);
      setFinancialSettings(DEFAULT_FINANCIAL_SETTINGS);
      setSocialMediaConfig(DEFAULT_SOCIAL_MEDIA_CONFIG);
      setDashboardConfig(DEFAULT_DASHBOARD_CONFIG);
    }
  }, []);

  const showToast = (message: string, title?: string, type: ToastNotification['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastNotification = { id, message, title, type };
    setToasts(prev => [...prev.slice(-4), newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to local storage v3
  useEffect(() => {
    localStorage.setItem('morada_properties_v3', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('morada_clientes_v3', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('morada_leads_v3', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('morada_visitas_v3', JSON.stringify(visitas));
  }, [visitas]);

  useEffect(() => {
    localStorage.setItem('morada_agenda_v3', JSON.stringify(agendaEvents));
  }, [agendaEvents]);

  useEffect(() => {
    localStorage.setItem('morada_proposals_v3', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('morada_contratos_v3', JSON.stringify(contratos));
  }, [contratos]);

  useEffect(() => {
    localStorage.setItem('morada_locacoes_v3', JSON.stringify(locacoes));
  }, [locacoes]);

  useEffect(() => {
    localStorage.setItem('morada_comissoes_v3', JSON.stringify(comissoes));
  }, [comissoes]);

  useEffect(() => {
    localStorage.setItem('morada_financial_v3', JSON.stringify(financialTransactions));
  }, [financialTransactions]);

  useEffect(() => {
    localStorage.setItem('morada_marketing_v3', JSON.stringify(marketingCampaigns));
  }, [marketingCampaigns]);

  useEffect(() => {
    localStorage.setItem('morada_team_v3', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    localStorage.setItem('morada_financial_settings_v3', JSON.stringify(financialSettings));
  }, [financialSettings]);

  useEffect(() => {
    localStorage.setItem('morada_social_media_v3', JSON.stringify(socialMediaConfig));
  }, [socialMediaConfig]);

  useEffect(() => {
    localStorage.setItem('morada_dashboard_config_v3', JSON.stringify(dashboardConfig));
  }, [dashboardConfig]);

  const addBroker = (brokerData: Omit<User, 'id'>): User => {
    const newBroker: User = {
      ...brokerData,
      id: `usr-${Date.now()}`
    };
    setTeam(prev => [...prev, newBroker]);
    showToast(`Corretor(a) ${newBroker.name} (${newBroker.creci || 'CRECI'}) cadastrado com sucesso!`, 'Cadastro Realizado', 'crm');
    return newBroker;
  };

  const updateBroker = (id: string, updatedData: Partial<User>) => {
    setTeam(prev => prev.map(u => u.id === id ? { ...u, ...updatedData } : u));
    if (currentUser.id === id) {
      setCurrentUser(prev => ({ ...prev, ...updatedData }));
    }
    // Sincronizar dados e foto do corretor com seus imóveis vinculados
    if (updatedData.avatar || updatedData.name || updatedData.phone || updatedData.creci) {
      setProperties(prev => prev.map(p => {
        if (p.brokerId === id) {
          return {
            ...p,
            brokerName: updatedData.name ?? p.brokerName,
            brokerPhone: updatedData.phone ?? p.brokerPhone,
            brokerCreci: updatedData.creci ?? p.brokerCreci,
            brokerAvatar: updatedData.avatar ?? p.brokerAvatar
          };
        }
        return p;
      }));
    }
    showToast('Dados do usuário/corretor e foto de perfil atualizados!', 'Usuários & Permissões', 'crm');
  };

  const deleteBroker = (id: string) => {
    if (id === 'usr-0') {
      showToast('O usuário Administrador Principal não pode ser excluído.', 'Operação Bloqueada', 'crm');
      return;
    }
    setTeam(prev => prev.filter(u => u.id !== id));
    showToast('Usuário removido com sucesso.', 'Usuários', 'info');
  };

  // Actions
  const addProperty = (newPropData: Omit<Property, 'id' | 'code' | 'createdAt'>): Property => {
    const newId = `prop-${Date.now()}`;
    const code = `MD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProperty: Property = {
      ...newPropData,
      id: newId,
      code,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProperties(prev => [newProperty, ...prev]);
    showToast(`Imóvel ${code} cadastrado com sucesso!`, 'Imóveis', 'success');
    return newProperty;
  };

  const updateProperty = (id: string, updatedData: Partial<Property>) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedData };
        showToast(`Imóvel ${p.code} atualizado com sucesso!`, 'Imóvel Editado', 'success');
        return updated;
      }
      return p;
    }));
  };

  const updatePropertyStatus = (id: string, status: PropertyStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        showToast(`Status do imóvel ${p.code} alterado para "${status.toUpperCase()}".`, 'Catálogo Atualizado', 'crm');
        return { ...p, status };
      }
      return p;
    }));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    showToast('Imóvel excluído do inventário com sucesso!', 'Imóveis', 'info');
  };

  const addCliente = (clienteData: Omit<Cliente, 'id' | 'createdAt'>): Cliente => {
    const newId = `cli-${Date.now()}`;
    const newClient: Cliente = {
      ...clienteData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClientes(prev => [newClient, ...prev]);
    showToast(`Cliente ${newClient.name} cadastrado na base de dados!`, 'Clientes', 'success');
    return newClient;
  };

  const moveLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const stageNames: Record<LeadStage, string> = {
          novo: 'Novo Lead',
          contato_realizado: 'Contato Realizado',
          visita_agendada: 'Visita Agendada',
          proposta_enviada: 'Proposta Enviada',
          fechado_ganho: 'Fechado / Ganho 🎉',
          perdido: 'Perdido'
        };
        const interaction = {
          id: `int-${Date.now()}`,
          date: new Date().toLocaleString('pt-BR'),
          type: 'nota' as const,
          description: `Fase atualizada para "${stageNames[newStage]}" por ${currentUser.name}.`,
          author: currentUser.name
        };

        showToast(
          `${lead.name} avançou para "${stageNames[newStage]}".`,
          'Funil de Vendas Atualizado',
          'crm'
        );

        return {
          ...lead,
          stage: newStage,
          lastContactAt: 'Agora mesmo',
          interactions: [interaction, ...lead.interactions]
        };
      }
      return lead;
    }));
  };

  const addLead = (leadData: Partial<Lead>): Lead => {
    const broker = team.find(b => b.role === 'corretor') || team[1];
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || 'Novo Interessado',
      email: leadData.email || '',
      phone: leadData.phone || '',
      interestType: leadData.interestType || 'venda',
      budgetMin: leadData.budgetMin || 0,
      budgetMax: leadData.budgetMax || 2500000,
      preferredNeighborhoods: leadData.preferredNeighborhoods || ['Jardins'],
      preferredPropertyTypes: leadData.preferredPropertyTypes || ['apartamento'],
      stage: leadData.stage || 'novo',
      origin: leadData.origin || 'whatsapp_direto',
      assignedBrokerId: broker.id,
      assignedBrokerName: broker.name,
      assignedBrokerAvatar: broker.avatar,
      propertyOfInterestId: leadData.propertyOfInterestId,
      propertyOfInterestTitle: leadData.propertyOfInterestTitle,
      propertyOfInterestCode: leadData.propertyOfInterestCode,
      notes: leadData.notes || 'Lead cadastrado na plataforma Morada Digital.',
      score: 'quente',
      lastContactAt: 'Agora mesmo',
      visitDate: leadData.visitDate,
      createdAt: new Date().toISOString().split('T')[0],
      interactions: [
        {
          id: `int-${Date.now()}`,
          date: new Date().toLocaleString('pt-BR'),
          type: 'whatsapp',
          description: `Lead recebido e atribuído para o corretor ${broker.name}.`,
          author: 'Sistema Morada Digital'
        }
      ]
    };

    setLeads(prev => [newLead, ...prev]);
    showToast(
      `Novo lead adicionado: ${newLead.name}. Corretor: ${broker.name}.`,
      'Leads',
      'crm'
    );
    return newLead;
  };

  const addLeadInteraction = (
    leadId: string, 
    description: string, 
    type: 'nota' | 'ligacao' | 'whatsapp' | 'visita' | 'proposta'
  ) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const interaction = {
          id: `int-${Date.now()}`,
          date: new Date().toLocaleString('pt-BR'),
          type,
          description,
          author: currentUser.name
        };
        showToast(`Interação registrada no histórico do lead.`, 'CRM', 'crm');
        return {
          ...lead,
          lastContactAt: 'Agora mesmo',
          interactions: [interaction, ...lead.interactions]
        };
      }
      return lead;
    }));
  };

  const updateLead = (id: string, updated: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    showToast('Dados do lead atualizados com sucesso!', 'CRM Leads', 'crm');
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    showToast('Lead removido do funil.', 'CRM Leads', 'info');
  };

  const addVisita = (visitaData: Omit<Visita, 'id' | 'code' | 'createdAt'>): Visita => {
    const code = `VIS-${Math.floor(2000 + Math.random() * 8000)}`;
    const newVisita: Visita = {
      ...visitaData,
      id: `vis-${Date.now()}`,
      code,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setVisitas(prev => [newVisita, ...prev]);
    showToast(`Visita ${code} agendada para ${visitaData.date} às ${visitaData.time}!`, 'Visitas', 'success');
    return newVisita;
  };

  const updateVisitaStatus = (id: string, status: VisitaStatus) => {
    setVisitas(prev => prev.map(v => {
      if (v.id === id) {
        const labels: Record<VisitaStatus, string> = {
          agendada: 'Agendada',
          confirmada: 'Confirmada',
          realizada: 'Realizada',
          cancelada: 'Cancelada'
        };
        showToast(`Visita ${v.code} atualizada para "${labels[status]}".`, 'Visita Atualizada', 'crm');
        return { ...v, status };
      }
      return v;
    }));
  };

  const addVisitaFeedback = (id: string, rating: number, comment: string) => {
    setVisitas(prev => prev.map(v => {
      if (v.id === id) {
        showToast(`Feedback registrado para a visita ${v.code}!`, 'Feedback Registrado', 'success');
        return { ...v, feedbackRating: rating, feedbackComment: comment, status: 'realizada' };
      }
      return v;
    }));
  };

  const updateVisita = (id: string, updated: Partial<Visita>) => {
    setVisitas(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
    showToast('Dados da visita atualizados com sucesso!', 'Visitas', 'crm');
  };

  const deleteVisita = (id: string) => {
    setVisitas(prev => prev.filter(v => v.id !== id));
    showToast('Visita excluída com sucesso.', 'Visitas', 'info');
  };

  const addAgendaEvent = (eventData: Omit<AgendaEvent, 'id'>) => {
    const newEvent: AgendaEvent = {
      ...eventData,
      id: `age-${Date.now()}`
    };
    setAgendaEvents(prev => [newEvent, ...prev]);
    showToast(`Compromisso "${eventData.title}" adicionado à agenda!`, 'Agenda', 'success');
  };

  const toggleAgendaCompleted = (id: string) => {
    setAgendaEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        return { ...ev, completed: !ev.completed };
      }
      return ev;
    }));
  };

  const updateAgendaEvent = (id: string, updated: Partial<AgendaEvent>) => {
    setAgendaEvents(prev => prev.map(ev => ev.id === id ? { ...ev, ...updated } : ev));
    showToast('Compromisso da agenda atualizado com sucesso!', 'Agenda', 'crm');
  };

  const deleteAgendaEvent = (id: string) => {
    setAgendaEvents(prev => prev.filter(ev => ev.id !== id));
    showToast('Compromisso removido da agenda.', 'Agenda', 'info');
  };

  const addProposal = (proposalData: Omit<Proposal, 'id' | 'code' | 'createdAt'>) => {
    const newProposal: Proposal = {
      ...proposalData,
      id: `prop-rec-${Date.now()}`,
      code: `PROP-2026-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProposals(prev => [newProposal, ...prev]);
    moveLeadStage(proposalData.leadId, 'proposta_enviada');
    showToast(
      `Proposta formalizada no valor de R$ ${(proposalData.offeredPrice / 1000000).toFixed(2)}M.`,
      'Proposta Registrada',
      'success'
    );
  };

  const updateProposalStatus = (id: string, status: Proposal['status']) => {
    setProposals(prev => prev.map(p => {
      if (p.id === id) {
        showToast(`Proposta ${p.code} atualizada para "${status.toUpperCase()}".`, 'Proposta', 'crm');
        return { ...p, status };
      }
      return p;
    }));
  };

  const updateProposal = (id: string, updated: Partial<Proposal>) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    showToast('Proposta comercial atualizada com sucesso!', 'Propostas', 'crm');
  };

  const deleteProposal = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
    showToast('Proposta excluída com sucesso.', 'Propostas', 'info');
  };

  const addContrato = (contratoData: Omit<Contrato, 'id' | 'code'>) => {
    const code = `CTR-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newContrato: Contrato = {
      ...contratoData,
      id: `ctr-${Date.now()}`,
      code
    };
    setContratos(prev => [newContrato, ...prev]);
    showToast(`Contrato ${code} emitido e pronto para assinaturas eletrônicas.`, 'Contratos', 'success');
  };

  const updateContratoStatus = (id: string, status: ContratoStatus) => {
    setContratos(prev => prev.map(c => {
      if (c.id === id) {
        showToast(`Contrato ${c.code} alterado para "${status.toUpperCase()}".`, 'Contratos', 'crm');
        return { ...c, status, signedAt: status === 'assinado' || status === 'vigente' ? new Date().toISOString().split('T')[0] : c.signedAt };
      }
      return c;
    }));
  };

  const updateContrato = (id: string, updated: Partial<Contrato>) => {
    setContratos(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    showToast('Contrato imobiliário atualizado com sucesso!', 'Contratos', 'crm');
  };

  const deleteContrato = (id: string) => {
    setContratos(prev => prev.filter(c => c.id !== id));
    showToast('Contrato removido com sucesso.', 'Contratos', 'info');
  };

  const updateLocacaoStatus = (id: string, status: 'pago' | 'em_aberto' | 'atrasado') => {
    setLocacoes(prev => prev.map(loc => {
      if (loc.id === id) {
        showToast(`Status da locação ${loc.code} alterado para "${status.toUpperCase()}".`, 'Locações', 'crm');
        return { ...loc, currentMonthStatus: status, lastPaymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : loc.lastPaymentDate };
      }
      return loc;
    }));
  };

  const updateLocacao = (id: string, updated: Partial<Locacao>) => {
    setLocacoes(prev => prev.map(loc => {
      if (loc.id === id) {
        return { ...loc, ...updated };
      }
      return loc;
    }));
    showToast('Dados e valores da locação atualizados com sucesso!', 'Locações', 'crm');
  };

  const deleteLocacao = (id: string) => {
    setLocacoes(prev => prev.filter(loc => loc.id !== id));
    showToast('Contrato de locação removido.', 'Locações', 'info');
  };

  const updateComissaoStatus = (id: string, status: 'a_receber' | 'liberado' | 'pago') => {
    setComissoes(prev => prev.map(c => {
      if (c.id === id) {
        showToast(`Comissão ${c.code} atualizada para "${status.toUpperCase()}".`, 'Comissões', 'crm');
        return { ...c, status, paymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : c.paymentDate };
      }
      return c;
    }));
  };

  const addComissao = (comissaoData: Omit<Comissao, 'id'>) => {
    const newCom: Comissao = {
      ...comissaoData,
      id: `com-${Date.now()}`
    };
    setComissoes(prev => [newCom, ...prev]);
    showToast(`Comissão ${newCom.code} cadastrada com sucesso!`, 'Honorários', 'success');
  };

  const updateComissao = (id: string, updated: Partial<Comissao>) => {
    setComissoes(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    showToast('Dados de honorários e divisão de comissão atualizados!', 'Comissões', 'crm');
  };

  const deleteComissao = (id: string) => {
    setComissoes(prev => prev.filter(c => c.id !== id));
    showToast('Registro de comissão excluído.', 'Comissões', 'info');
  };

  const addFinancialTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `fin-${Date.now()}`
    };
    setFinancialTransactions(prev => [newTx, ...prev]);
    showToast(`Lançamento "${txData.description}" registrado no fluxo financeiro!`, 'Financeiro', 'success');
  };

  const updateFinancialTransaction = (id: string, updated: Partial<FinancialTransaction>) => {
    setFinancialTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updated } : tx));
    showToast('Lançamento financeiro atualizado com sucesso!', 'Financeiro', 'crm');
  };

  const deleteFinancialTransaction = (id: string) => {
    setFinancialTransactions(prev => prev.filter(tx => tx.id !== id));
    showToast('Lançamento financeiro excluído do fluxo.', 'Financeiro', 'info');
  };

  const updateFinancialSettings = (settings: Partial<AgencyFinancialSettings>) => {
    setFinancialSettings(prev => ({ ...prev, ...settings }));
    showToast('Regras de honorários e dados bancários atualizados!', 'Configurações Financeiras', 'success');
  };

  const addMarketingCampaign = (campaignData: Omit<MarketingCampaign, 'id'>) => {
    const newCamp: MarketingCampaign = {
      ...campaignData,
      id: `mkt-${Date.now()}`
    };
    setMarketingCampaigns(prev => [newCamp, ...prev]);
    showToast(`Campanha "${newCamp.name}" criada com sucesso!`, 'Marketing', 'success');
  };

  const updateMarketingCampaign = (id: string, updated: Partial<MarketingCampaign>) => {
    setMarketingCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    showToast('Campanha de marketing atualizada com sucesso!', 'Marketing', 'crm');
  };

  const deleteMarketingCampaign = (id: string) => {
    setMarketingCampaigns(prev => prev.filter(c => c.id !== id));
    showToast('Campanha removida.', 'Marketing', 'info');
  };

  const toggleCampaignStatus = (id: string) => {
    setMarketingCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'ativa' ? 'pausada' : 'ativa';
        showToast(`Campanha "${c.name}" foi ${nextStatus === 'ativa' ? 'ativada' : 'pausada'}.`, 'Marketing', 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const updateSocialMediaConfig = (config: Partial<SocialMediaConfig>) => {
    setSocialMediaConfig(prev => ({ ...prev, ...config }));
    showToast('Canais de redes sociais e tags de conversão atualizadas!', 'Redes Sociais', 'success');
  };

  const updateDashboardConfig = (config: Partial<DashboardConfig>) => {
    setDashboardConfig(prev => ({
      ...prev,
      ...config,
      widgets: {
        ...prev.widgets,
        ...(config.widgets || {})
      }
    }));
    showToast('Ferramentas e layout do Dashboard atualizados!', 'Dashboard', 'crm');
  };

  const resetDashboardConfig = () => {
    setDashboardConfig(DEFAULT_DASHBOARD_CONFIG);
    localStorage.setItem('morada_dashboard_config_v3', JSON.stringify(DEFAULT_DASHBOARD_CONFIG));
    showToast('Layout do Dashboard redefinido para a configuração padrão.', 'Dashboard', 'info');
  };

  const authenticateSystem = (password: string): boolean => {
    if (password === 'adm@123') {
      setIsSystemAuthenticated(true);
      sessionStorage.setItem('morada_crm_auth', 'true');
      setIsPasswordModalOpen(false);
      setCurrentView('system');
      localStorage.setItem('morada_current_view', 'system');
      showToast('Acesso de Administrador autorizado com sucesso!', 'Segurança Morada Digital', 'success');
      return true;
    } else {
      showToast('Senha incorreta! Verifique suas credenciais de acesso.', 'Acesso Negado', 'crm');
      return false;
    }
  };

  const logoutSystem = () => {
    setIsSystemAuthenticated(false);
    sessionStorage.removeItem('morada_crm_auth');
    setCurrentView('public');
    localStorage.setItem('morada_current_view', 'public');
    showToast('Você retornou ao portal público da Morada Digital.', 'Sessão Finalizada', 'info');
  };

  const requestSystemAccess = () => {
    if (isSystemAuthenticated) {
      setCurrentView('system');
      localStorage.setItem('morada_current_view', 'system');
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const resetToInitialDemo = () => {
    localStorage.removeItem('morada_properties');
    localStorage.removeItem('morada_clientes');
    localStorage.removeItem('morada_leads');
    localStorage.removeItem('morada_visitas');
    localStorage.removeItem('morada_agenda');
    localStorage.removeItem('morada_proposals');
    localStorage.removeItem('morada_contratos');
    localStorage.removeItem('morada_locacoes');
    localStorage.removeItem('morada_comissoes');
    localStorage.removeItem('morada_financial');
    localStorage.removeItem('morada_marketing');
    localStorage.removeItem('morada_team_v2');

    localStorage.removeItem('morada_properties_v3');
    localStorage.removeItem('morada_clientes_v3');
    localStorage.removeItem('morada_leads_v3');
    localStorage.removeItem('morada_visitas_v3');
    localStorage.removeItem('morada_agenda_v3');
    localStorage.removeItem('morada_proposals_v3');
    localStorage.removeItem('morada_contratos_v3');
    localStorage.removeItem('morada_locacoes_v3');
    localStorage.removeItem('morada_comissoes_v3');
    localStorage.removeItem('morada_financial_v3');
    localStorage.removeItem('morada_marketing_v3');
    localStorage.removeItem('morada_team_v3');
    localStorage.removeItem('morada_financial_settings_v3');
    localStorage.removeItem('morada_social_media_v3');
    localStorage.removeItem('morada_dashboard_config_v3');
    localStorage.setItem('morada_data_version', 'v3_single_case');

    setProperties(INITIAL_PROPERTIES);
    setClientes(INITIAL_CLIENTES);
    setLeads(INITIAL_LEADS);
    setVisitas(INITIAL_VISITAS);
    setAgendaEvents(INITIAL_AGENDA);
    setProposals(INITIAL_PROPOSALS);
    setContratos(INITIAL_CONTRATOS);
    setLocacoes(INITIAL_LOCACOES);
    setComissoes(INITIAL_COMISSOES);
    setFinancialTransactions(INITIAL_FINANCIAL);
    setMarketingCampaigns(INITIAL_MARKETING);
    setTeam(USERS_TEAM);
    setFinancialSettings(DEFAULT_FINANCIAL_SETTINGS);
    setSocialMediaConfig(DEFAULT_SOCIAL_MEDIA_CONFIG);
    setDashboardConfig(DEFAULT_DASHBOARD_CONFIG);

    showToast('Base restaurada para 1 caso de exemplo limpo para início de uso.', 'Base Limpa', 'info');
  };

  return (
    <RealEstateContext.Provider value={{
      currentView,
      setCurrentView,
      isSystemAuthenticated,
      authenticateSystem,
      logoutSystem,
      isPasswordModalOpen,
      setIsPasswordModalOpen,
      requestSystemAccess,
      activeModule,
      setActiveModule,
      currentUser,
      setCurrentUser,
      team,
      addBroker,
      updateBroker,
      deleteBroker,
      properties,
      selectedProperty,
      setSelectedProperty,
      searchFilters,
      setSearchFilters,
      addProperty,
      updateProperty,
      updatePropertyStatus,
      deleteProperty,
      clientes,
      addCliente,
      leads,
      selectedLead,
      setSelectedLead,
      moveLeadStage,
      addLead,
      updateLead,
      deleteLead,
      addLeadInteraction,
      visitas,
      selectedVisita,
      setSelectedVisita,
      addVisita,
      updateVisitaStatus,
      updateVisita,
      deleteVisita,
      addVisitaFeedback,
      agendaEvents,
      addAgendaEvent,
      updateAgendaEvent,
      deleteAgendaEvent,
      toggleAgendaCompleted,
      proposals,
      addProposal,
      updateProposalStatus,
      updateProposal,
      deleteProposal,
      contratos,
      addContrato,
      updateContratoStatus,
      updateContrato,
      deleteContrato,
      locacoes,
      updateLocacaoStatus,
      updateLocacao,
      deleteLocacao,
      comissoes,
      updateComissaoStatus,
      addComissao,
      updateComissao,
      deleteComissao,
      financialTransactions,
      addFinancialTransaction,
      updateFinancialTransaction,
      deleteFinancialTransaction,
      financialSettings,
      updateFinancialSettings,
      marketingCampaigns,
      addMarketingCampaign,
      updateMarketingCampaign,
      deleteMarketingCampaign,
      toggleCampaignStatus,
      socialMediaConfig,
      updateSocialMediaConfig,
      dashboardConfig,
      updateDashboardConfig,
      resetDashboardConfig,
      resetToInitialDemo,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </RealEstateContext.Provider>
  );
};

export const useRealEstate = () => {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
};
