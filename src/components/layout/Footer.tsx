import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import footerLogo from '../../assets/Logo.jpeg';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#11271A] text-slate-300 border-t border-[#1C422D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#1C422D]">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-6">
            <div className="inline-block bg-white rounded-2xl p-3 sm:p-4 shadow-md">
              <img
                src={footerLogo}
                alt="Infinite 7 Impex"
                className="h-16 sm:h-20 w-auto object-contain rounded-lg"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              Direct export of export-grade agricultural produce from Indian grower belts to wholesale
              buyers across Sri Lanka, Singapore, and global import corridors.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              <span className="bg-[#153323] px-2.5 py-1 rounded border border-[#214F35]">APEDA</span>
              <span className="bg-[#153323] px-2.5 py-1 rounded border border-[#214F35]">FSSAI</span>
              <span className="bg-[#153323] px-2.5 py-1 rounded border border-[#214F35]">Phytosanitary</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4902A]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="#home" className="hover:text-[#D4902A] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-[#D4902A] transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#D4902A] transition-colors">
                  Export Process
                </a>
              </li>
              <li>
                <a href="#countries" className="hover:text-[#D4902A] transition-colors">
                  Countries
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#D4902A] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-[#D4902A] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#get-quote" className="hover:text-[#D4902A] transition-colors">
                  Customer Enquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4902A]">
              Our Contacts
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
                <div>
                  <a href="tel:+919865993308" className="hover:text-white transition-colors font-medium">
                    +91 986 599 3308
                  </a>
                  <span className="text-xs text-slate-400 block">Mon-Sat, 9am - 7pm IST</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
                <div>
                  <a href="mailto:exports@infinite7impex.com" className="hover:text-white transition-colors font-medium">
                    exports@infinite7impex.com
                  </a>
                  <span className="text-xs text-slate-400 block">response within 24 hours</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-200">Kollam, Kerala, India</span>
                  <span className="text-xs text-slate-400 block">Logistics &amp; Port Dispatch</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Socials */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4902A]">
              Our Socials
            </h4>
            <div className="flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#183925] border border-[#214F35] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#204930] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#183925] border border-[#214F35] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#204930] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#183925] border border-[#214F35] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#204930] transition-colors"
                aria-label="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Infinite 7 Impex. All Rights Reserved.</p>
          <p className="text-slate-500">Export &amp; Import Specialists</p>
        </div>
      </div>
    </footer>
  );
};
