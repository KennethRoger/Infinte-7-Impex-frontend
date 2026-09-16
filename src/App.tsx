import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { FreshVegetablesPage } from './pages/FreshVegetablesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ExportProcessPage } from './pages/ExportProcessPage';
import { CountriesPage } from './pages/CountriesPage';
import { AboutPage } from './pages/AboutPage';
import { Footer } from './components/layout/Footer';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();

  const renderCurrentPage = () => {
    if (
      currentPath === '/products/fresh-vegetables/onion' ||
      currentPath === '/products/onion'
    ) {
      return <ProductDetailPage />;
    }

    if (currentPath === '/products/fresh-vegetables') {
      return <FreshVegetablesPage />;
    }

    if (currentPath === '/products' || currentPath.startsWith('/products/')) {
      return <ProductsPage />;
    }

    switch (currentPath) {
      case '/export-process':
        return <ExportProcessPage />;
      case '/countries':
        return <CountriesPage />;
      case '/about':
        return <AboutPage />;
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
