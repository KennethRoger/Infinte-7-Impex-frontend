import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logoBgRemoved from '../../assets/logo_bg_removed.png';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Products', href: '#products' },
    { label: 'Export Process', href: '#process' },
    { label: 'Countries', href: '#countries' },
    { label: 'About', href: '#about' },
    { label: 'Blog', href: '#blog' },
  ];

  const handleScrollToQuote = () => {
    setMobileMenuOpen(false);
    const element = document.getElementById('get-quote');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E7DFD3]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="shrink-0 flex items-center py-1">
          <img
            src={logoBgRemoved}
            alt="Infinite 7 Impex"
            className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-[14px] font-medium text-slate-700">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`transition-colors duration-150 relative py-1 ${
                link.active
                  ? 'text-[#8A5A1B] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C88A2C]'
                  : 'hover:text-[#C88A2C]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={handleScrollToQuote}
            className="bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-[14px] px-6 py-2.5 rounded-md transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-700 hover:text-slate-900 p-2 rounded-md focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E7DFD3] px-6 py-5 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-1.5 transition-colors ${
                  link.active ? 'text-[#C88A2C] font-bold' : 'hover:text-[#C88A2C]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleScrollToQuote}
              className="w-full bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold py-3 rounded-md transition-colors shadow-sm text-center"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
