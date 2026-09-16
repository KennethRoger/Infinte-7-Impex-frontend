import React, { useState } from 'react';
import { Menu, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';
import { AdminSidebar } from './AdminSidebar';
import { useRouter, Link } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPath, navigate } = useRouter();
  const { admin, logout } = useAuth();

  const getPageTitle = () => {
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') return 'Dashboard';
    if (currentPath.startsWith('/admin/customers')) return 'Customer Inquiries';
    if (currentPath.startsWith('/admin/categories')) return 'Product Categories';
    if (currentPath.startsWith('/admin/products')) return 'Products Management';
    if (currentPath.startsWith('/admin/blogs')) return 'Blog Posts Management';
    return 'Admin Management';
  };

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#1A221E] flex flex-col lg:flex-row">
      {/* 1. Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white border-b border-[#E5DCD1] px-4 sm:px-8 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Admin</span>
                <span>/</span>
                <span className="text-[#C88A2C]">{getPageTitle()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#1A221E]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#C88A2C] px-3 py-2 rounded-lg border border-[#E5DCD1] hover:bg-[#FAF7F2] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#E5DCD1]">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-[#FAF7F2] border border-[#E5DCD1] px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="truncate max-w-[150px]">{admin?.email || 'admin'}</span>
              </span>
            </div>

            {/* Quick Signout Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
