import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoryProductsPage } from './pages/CategoryProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ExportProcessPage } from './pages/ExportProcessPage';
import { CountriesPage } from './pages/CountriesPage';
import { AboutPage } from './pages/AboutPage';
import { BlogListPage } from './pages/BlogListPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { Footer } from './components/layout/Footer';

import { ToastProvider } from './context/ToastContext';
import { ContactSection } from './components/contact/ContactSection';

// Admin imports
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to /admin/login if attempting to access any protected admin route while unauthenticated
  React.useEffect(() => {
    if (!isLoading && currentPath.startsWith('/admin') && currentPath !== '/admin/login' && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isLoading, currentPath, isAuthenticated, navigate]);

  // Dynamic SEO Page Titles
  React.useEffect(() => {
    let title = 'Infinite 7 Impex | Indian Agricultural Produce & Commodities Exporter';
    if (currentPath === '/products') {
      title = 'Export Produce & Commodities Catalog | Infinite 7 Impex';
    } else if (currentPath.startsWith('/products/')) {
      title = 'Agricultural Export Products | Infinite 7 Impex';
    } else if (currentPath === '/about') {
      title = 'About Us | Infinite 7 Impex - Certified Indian Agro Exporters';
    } else if (currentPath === '/export-process') {
      title = 'Export Process & Quality Assurance | Infinite 7 Impex';
    } else if (currentPath === '/countries') {
      title = 'Global Export Destinations | Infinite 7 Impex';
    } else if (currentPath === '/blog' || currentPath.startsWith('/blog/')) {
      title = 'Agro Export Insights & Market Intelligence | Infinite 7 Impex';
    } else if (currentPath === '/contact') {
      title = 'Contact Us & Wholesale Inquiry | Infinite 7 Impex';
    } else if (currentPath.startsWith('/admin')) {
      title = 'Admin Management Portal | Infinite 7 Impex';
    }
    document.title = title;
  }, [currentPath]);

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
    // Legacy demo routes
    if (
      currentPath === '/products/fresh-vegetables/onion' ||
      currentPath === '/products/onion'
    ) {
      return <ProductDetailPage />;
    }

    // Direct product detail route /product/:productId
    if (currentPath.startsWith('/product/')) {
      const prodId = currentPath.replace('/product/', '').split('/')[0];
      return <ProductDetailPage productId={prodId} />;
    }

    // Product routes under /products/
    if (currentPath.startsWith('/products/')) {
      const parts = currentPath.replace('/products/', '').split('/').filter(Boolean);
      if (parts.length >= 2) {
        // e.g. /products/fresh-vegetables/6aa123...
        return <ProductDetailPage categorySlug={parts[0]} productId={parts[1]} />;
      }
      if (parts.length === 1) {
        // e.g. /products/fresh-vegetables or /products/onion
        return <CategoryProductsPage categorySlug={parts[0]} />;
      }
    }

    if (currentPath === '/products' || currentPath === '/products/') {
      return <ProductsPage />;
    }

    if (currentPath.startsWith('/blog/') && currentPath !== '/blog/') {
      return <BlogDetailPage />;
    }

    if (currentPath === '/blog' || currentPath === '/blog/') {
      return <BlogListPage />;
    }

    if (currentPath === '/contact') {
      return (
        <div className="w-full bg-[#E8DFD2] min-h-screen">
          <ContactSection isStandalonePage />
        </div>
      );
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
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
