import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ExportProcessPage } from './pages/ExportProcessPage';
import { Footer } from './components/layout/Footer';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/export-process':
        return <ExportProcessPage />;
      case '/':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A221E]">
      <Navbar />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
};

export default App;
