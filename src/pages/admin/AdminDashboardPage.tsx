import React from 'react';
import {
  Users,
  FolderTree,
  Package,
  BookOpen,
  ArrowRight,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { admin, logout } = useAuth();

  const sections = [
    {
      title: 'Customer Inquiries',
      description: 'Review lead inquiries, contact details, and priority follow-ups from the website form.',
      href: '/admin/customers',
      icon: Users,
      badgeText: 'Active',
      color: '#00A859',
    },
    {
      title: 'Product Categories',
      description: 'Organize produce categories like Fresh Vegetables, Condiments, and Packed Food.',
      href: '/admin/categories',
      icon: FolderTree,
      badgeText: 'Configured',
      color: '#C88A2C',
    },
    {
      title: 'Products Management',
      description: 'Manage export-grade produce listings, packaging specs, certifications, and image galleries.',
      href: '/admin/products',
      icon: Package,
      badgeText: 'Configured',
      color: '#2563EB',
    },
    {
      title: 'Blog Articles',
      description: 'Publish export market intelligence articles with structured sections and market insights.',
      href: '/admin/blogs',
      icon: BookOpen,
      badgeText: 'Configured',
      color: '#7C3AED',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 1. Welcome Banner */}
      <div className="bg-[#0E2318] rounded-2xl text-white p-6 sm:p-8 border border-[#1C422D] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E]/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#163825] px-3 py-1 rounded-full text-xs font-semibold text-[#22C55E] border border-[#22C55E]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome, {admin?.email || 'Administrator'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Infinite 7 Impex Administration Portal
          </h2>
          <p className="text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
            Welcome to your administrative workspace. Use the sidebar to manage customer inquiries,
            product categories, product listings, and blog intelligence articles.
          </p>
        </div>
      </div>

      {/* 2. Dashboard Notice
      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <span className="font-bold block mb-0.5">Dashboard Section Status</span>
          As requested, this is the opening dashboard view. Analytics metrics, activity logs, and export charts
          will be added here in upcoming iterations. You can start managing each dedicated section below.
        </div>
      </div> */}

      {/* 3. Section Navigation Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold uppercase tracking-wider text-slate-700 text-xs">
          Management Sections
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                onClick={() => navigate(section.href)}
                className="bg-white rounded-xl border border-[#E5DCD1] p-6 shadow-sm hover:shadow-md hover:border-[#C88A2C]/60 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] border border-[#E7DFD3] flex items-center justify-center text-[#C88A2C] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {section.badgeText}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold font-serif text-[#1A221E] group-hover:text-[#8A5A1B] transition-colors">
                      {section.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-[#C88A2C] transition-colors">
                  <span>Open Section</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Session Controls */}
      <div className="p-6 bg-white rounded-xl border border-[#E5DCD1] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#1A221E]">Need to sign out?</h4>
          <p className="text-xs text-slate-600">
            Sign out of your administrative session on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Now</span>
        </button>
      </div>
    </div>
  );
};
