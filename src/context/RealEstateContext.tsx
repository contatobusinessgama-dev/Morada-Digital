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
  MarketingCampaign
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
  INITIAL_MARKETING
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

  // Current logged in user in CRM
  currentUser: User;
  setCurrentUser: (user: User) => void;
  team: User[];

  // Properties State & Actions
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  searchFilters: SearchFilterState;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilterState>>;
  addProperty: (property: Omit<Property, 'id' | 'code' | 'createdAt'>) => Property;
  updatePropertyStatus: (id: string, status: PropertyStatus) => void;

  // Clientes
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'createdAt'>) => Cliente;

  // Leads & CRM State & Actions
  leads: Lead[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  moveLeadStage: (leadId: string, newStage: LeadStage) => void;
  addLead: (leadData: Partial<Lead>) => Lead;
  addLeadInteraction: (leadId: string, description: string, type: 'nota' | 'ligacao' | 'whatsapp' | 'visita' | 'proposta') => void;

  // Visitas (Highlighted in user image)
  visitas: Visita[];
  selectedVisita: Visita | null;
  setSelectedVisita: (visita: Visita | null) => void;
  addVisita: (visita: Omit<Visita, 'id' | 'code' | 'createdAt'>) => Visita;
  updateVisitaStatus: (id: string, status: VisitaStatus) => void;
  addVisitaFeedback: (id: string, rating: number, comment: string) => void;

  // Agenda
  agendaEvents: AgendaEvent[];
  addAgendaEvent: (event: Omit<AgendaEvent, 'id'>) => void;
  toggleAgendaCompleted: (id: string) => void;

  // Proposals
  proposals: Proposal[];
  addProposal: (proposalData: Omit<Proposal, 'id' | 'code' | 'createdAt'>) => void;
  updateProposalStatus: (id: string, status: Proposal['status']) => void;

  // Contratos
  contratos: Contrato[];
  addContrato: (contrato: Omit<Contrato, 'id' | 'code'>) => void;
  updateContratoStatus: (id: string, status: ContratoStatus) => void;

  // Locações
  locacoes: Locacao[];
  updateLocacaoStatus: (id: string, status: 'pago' | 'em_aberto' | 'atrasado') => void;

  // Comissões
  comissoes: Comissao[];
  updateComissaoStatus: (id: string, status: 'a_receber' | 'liberado' | 'pago') => void;

  // Financeiro
  financialTransactions: FinancialTransaction[];
  addFinancialTransaction: (tx: Omit<FinancialTransaction, 'id'>) => void;

  // Marketing
  marketingCampaigns: MarketingCampaign[];
  toggleCampaignStatus: (id: string) => void;

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

  // Load from LocalStorage if available
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('morada_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('morada_clientes');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('morada_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [visitas, setVisitas] = useState<Visita[]>(() => {
    const saved = localStorage.getItem('morada_visitas');
    return saved ? JSON.parse(saved) : INITIAL_VISITAS;
  });

  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>(() => {
    const saved = localStorage.getItem('morada_agenda');
    return saved ? JSON.parse(saved) : INITIAL_AGENDA;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('morada_proposals');
    return saved ? JSON.parse(saved) : INITIAL_PROPOSALS;
  });

  const [contratos, setContratos] = useState<Contrato[]>(() => {
    const saved = localStorage.getItem('morada_contratos');
    return saved ? JSON.parse(saved) : INITIAL_CONTRATOS;
  });

  const [locacoes, setLocacoes] = useState<Locacao[]>(() => {
    const saved = localStorage.getItem('morada_locacoes');
    return saved ? JSON.parse(saved) : INITIAL_LOCACOES;
  });

  const [comissoes, setComissoes] = useState<Comissao[]>(() => {
    const saved = localStorage.getItem('morada_comissoes');
    return saved ? JSON.parse(saved) : INITIAL_COMISSOES;
  });

  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem('morada_financial');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL;
  });

  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem('morada_marketing');
    return saved ? JSON.parse(saved) : INITIAL_MARKETING;
  });

  const [team] = useState<User[]>(USERS_TEAM);
  const [currentUser, setCurrentUser] = useState<User>(USERS_TEAM[0]); // Default to Rodrigo (Admin)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedVisita, setSelectedVisita] = useState<Visita | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilterState>(INITIAL_FILTER_STATE);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

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

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('morada_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('morada_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('morada_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('morada_visitas', JSON.stringify(visitas));
  }, [visitas]);

  useEffect(() => {
    localStorage.setItem('morada_agenda', JSON.stringify(agendaEvents));
  }, [agendaEvents]);

  useEffect(() => {
    localStorage.setItem('morada_proposals', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('morada_contratos', JSON.stringify(contratos));
  }, [contratos]);

  useEffect(() => {
    localStorage.setItem('morada_locacoes', JSON.stringify(locacoes));
  }, [locacoes]);

  useEffect(() => {
    localStorage.setItem('morada_comissoes', JSON.stringify(comissoes));
  }, [comissoes]);

  useEffect(() => {
    localStorage.setItem('morada_financial', JSON.stringify(financialTransactions));
  }, [financialTransactions]);

  useEffect(() => {
    localStorage.setItem('morada_marketing', JSON.stringify(marketingCampaigns));
  }, [marketingCampaigns]);

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

  const updatePropertyStatus = (id: string, status: PropertyStatus) => {
    setProperties(prev => prev.map(p => {
      if (p.id === id) {
        showToast(`Status do imóvel ${p.code} alterado para "${status.toUpperCase()}".`, 'Catálogo Atualizado', 'crm');
        return { ...p, status };
      }
      return p;
    }));
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

  const updateLocacaoStatus = (id: string, status: 'pago' | 'em_aberto' | 'atrasado') => {
    setLocacoes(prev => prev.map(loc => {
      if (loc.id === id) {
        showToast(`Status da locação ${loc.code} alterado para "${status.toUpperCase()}".`, 'Locações', 'crm');
        return { ...loc, currentMonthStatus: status, lastPaymentDate: status === 'pago' ? new Date().toISOString().split('T')[0] : loc.lastPaymentDate };
      }
      return loc;
    }));
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

  const addFinancialTransaction = (txData: Omit<FinancialTransaction, 'id'>) => {
    const newTx: FinancialTransaction = {
      ...txData,
      id: `fin-${Date.now()}`
    };
    setFinancialTransactions(prev => [newTx, ...prev]);
    showToast(`Lançamento "${txData.description}" registrado no fluxo financeiro!`, 'Financeiro', 'success');
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

    showToast('Dados restaurados para os valores padrão da demonstração.', 'Reset', 'info');
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
      properties,
      selectedProperty,
      setSelectedProperty,
      searchFilters,
      setSearchFilters,
      addProperty,
      updatePropertyStatus,
      clientes,
      addCliente,
      leads,
      selectedLead,
      setSelectedLead,
      moveLeadStage,
      addLead,
      addLeadInteraction,
      visitas,
      selectedVisita,
      setSelectedVisita,
      addVisita,
      updateVisitaStatus,
      addVisitaFeedback,
      agendaEvents,
      addAgendaEvent,
      toggleAgendaCompleted,
      proposals,
      addProposal,
      updateProposalStatus,
      contratos,
      addContrato,
      updateContratoStatus,
      locacoes,
      updateLocacaoStatus,
      comissoes,
      updateComissaoStatus,
      financialTransactions,
      addFinancialTransaction,
      marketingCampaigns,
      toggleCampaignStatus,
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
