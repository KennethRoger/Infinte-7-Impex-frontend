import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { FreshVegetablesPage } from './pages/FreshVegetablesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ExportProcessPage } from './pages/ExportProcessPage';
import { CountriesPage } from './pages/CountriesPage';
import { AboutPage } from './pages/AboutPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { Footer } from './components/layout/Footer';

// Admin imports
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';

const AppContent: React.FC = () => {
  const { currentPath } = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Admin Portal Routing
  if (currentPath.startsWith('/admin')) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#0E2318] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-2 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (currentPath === '/admin/login') {
      if (isAuthenticated) {
        return (
          <AdminLayout>
            <AdminDashboardPage />
          </AdminLayout>
        );
      }
      return <AdminLoginPage />;
    }

    // Protect all other /admin routes
    if (!isAuthenticated) {
      return <AdminLoginPage />;
    }

    const renderAdminSection = () => {
      if (currentPath.startsWith('/admin/customers')) {
        return <AdminCustomersPage />;
      }
      if (currentPath.startsWith('/admin/categories')) {
        return <AdminCategoriesPage />;
      }
      if (currentPath.startsWith('/admin/products')) {
        return <AdminProductsPage />;
      }
      if (currentPath.startsWith('/admin/blogs')) {
        return <AdminBlogsPage />;
      }
      return <AdminDashboardPage />;
    };

    return <AdminLayout>{renderAdminSection()}</AdminLayout>;
  }

  // 2. Public Website Routing
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

    if (currentPath.startsWith('/blog/') && currentPath !== '/blog/') {
      return <BlogDetailPage />;
    }

    if (currentPath === '/blog' || currentPath === '/blog/') {
      return <BlogListPage />;
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
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
};

export default App;
