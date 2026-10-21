import React, { useState } from 'react';
import { SidebarNav } from './SidebarNav';
import { HeaderBar } from './HeaderBar';
import { DashboardExecutive } from './DashboardExecutive';
import { PropertiesManager } from './PropertiesManager';
import { ClientsManager } from './ClientsManager';
import { LeadsKanban } from './LeadsKanban';
import { AgendaManager } from './AgendaManager';
import { VisitasManager } from './VisitasManager';
import { ProposalsManager } from './ProposalsManager';
import { ContractsManager } from './ContractsManager';
import { RentalsManager } from './RentalsManager';
import { CommissionsManager } from './CommissionsManager';
import { FinancialManager } from './FinancialManager';
import { MarketingManager } from './MarketingManager';
import { SettingsManager } from './SettingsManager';
import { LeadDetailModal } from './LeadDetailModal';
import { AiBrokerAssistantModal } from './AiBrokerAssistantModal';
import { useRealEstate } from '../../context/RealEstateContext';
import { Sparkles, MessageCircle } from 'lucide-react';
import { MORADA_BRAND } from '../../data/mockDatabase';

export const MainLayout: React.FC = () => {
  const { 
    activeModule, 
    selectedLead, 
    setSelectedLead,
    setCurrentView
  } = useRealEstate();

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      
      {/* 1. Left Vertical Navigation Sidebar (matches user's screenshot exactly) */}
      <SidebarNav />

      {/* 2. Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <HeaderBar onReturnToSite={() => setCurrentView('public')} />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {activeModule === 'dashboard' && <DashboardExecutive />}
            {activeModule === 'imoveis' && <PropertiesManager />}
            {activeModule === 'clientes' && <ClientsManager />}
            {activeModule === 'leads' && <LeadsKanban />}
            {activeModule === 'agenda' && <AgendaManager />}
            {activeModule === 'visitas' && <VisitasManager />}
            {activeModule === 'propostas' && <ProposalsManager />}
            {activeModule === 'contratos' && <ContractsManager />}
            {activeModule === 'locacoes' && <RentalsManager />}
            {activeModule === 'comissoes' && <CommissionsManager />}
            {activeModule === 'financeiro' && <FinancialManager />}
            {activeModule === 'marketing' && <MarketingManager />}
            {activeModule === 'configuracoes' && <SettingsManager onReturnToSite={() => setCurrentView('public')} />}
          </div>
        </main>
      </div>

      {/* Floating AI Broker Copilot Button */}
      <aside aria-label="Atalhos Flutuantes">
        <button
          onClick={() => setIsAiModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-bold py-3 px-4 rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer border border-white/20"
          title="Abrir IA Copiloto dos Corretores"
        >
          <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <span className="text-xs tracking-wide">IA Copiloto Corretores</span>
        </button>
      </aside>

      {/* AI Broker Assistant Modal */}
      <AiBrokerAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </div>
  );
};
