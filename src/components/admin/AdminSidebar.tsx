import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  BookOpen,
  LogOut,
  ExternalLink,
  X,
} from 'lucide-react';
import { useRouter } from '../../context/RouterContext';
import { useAuth } from '../../context/AuthContext';
import logoBgRemoved from '../../assets/logo_bg_removed.png';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { currentPath, navigate } = useRouter();
  const { admin, logout } = useAuth();

  const menuItems: NavMenuItem[] = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Product Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Blogs', href: '/admin/blogs', icon: BookOpen },
  ];

  const handleNavigate = (href: string) => {
    navigate(href);
    onClose();
  };

  const handleSignOut = () => {
    logout();
    navigate('/admin/login');
  };

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return currentPath === '/admin' || currentPath === '/admin/dashboard';
    }
    return currentPath.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0E2318] text-white border-r border-[#1C422D] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* 1. Header & Brand Logo */}
        <div className="h-20 px-6 border-b border-[#1C422D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-1.5 rounded-lg border border-white/10">
              <img src={logoBgRemoved} alt="Infinite 7 Impex" className="h-9 w-auto object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block">
                Infinite 7 Impex
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                ADMIN PORTAL
              </span>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Navigation Section */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          <div className="px-3 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/50">
              Management
            </span>
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item.href);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#C88A2C] text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#163825]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100/50">
              Quick Links
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              navigate('/');
              onClose();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-[#163825] transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-3">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Website</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-[#163825] px-1.5 py-0.5 rounded">
              Live
            </span>
          </button>
        </div>

        {/* 3. Footer: Admin Profile & Signout Button */}
        <div className="p-4 border-t border-[#1C422D] bg-[#0A1A12] space-y-3">
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-full bg-[#C88A2C] flex items-center justify-center font-bold text-white text-xs shadow-inner">
              {admin?.email ? admin.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.email || 'admin@infinite7impex.com'}
              </p>
              <p className="text-[10px] text-[#22C55E] capitalize font-medium">
                {admin?.role || 'Administrator'}
              </p>
            </div>
          </div>

          {/* Prominent Signout Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 hover:text-white border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
