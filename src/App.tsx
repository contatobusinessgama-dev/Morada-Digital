import React from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { MainLayout } from './components/admin/MainLayout';
import { PublicSite } from './components/public/PublicSite';
import { AdminPasswordModal } from './components/common/AdminPasswordModal';
import { ToastContainer } from './components/common/ToastContainer';

const AppContent: React.FC = () => {
  const { currentView, isSystemAuthenticated } = useRealEstate();

  return (
    <>
      {currentView === 'system' && isSystemAuthenticated ? (
        <MainLayout />
      ) : (
        <PublicSite />
      )}
      <AdminPasswordModal />
      <ToastContainer />
    </>
  );
};

export default function App() {
  return (
    <RealEstateProvider>
      <AppContent />
    </RealEstateProvider>
  );
}
