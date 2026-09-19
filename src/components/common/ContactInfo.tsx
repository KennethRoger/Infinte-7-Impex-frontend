import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CONTACT_INFO, type ContactData } from '../../data/contactData';

export { CONTACT_INFO, type ContactData };

export interface ContactInfoProps {
  variant?: 'section' | 'footer';
  className?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  variant = 'section',
  className,
}) => {
  if (variant === 'footer') {
    return (
      <div className={className ?? 'lg:col-span-4 space-y-4'}>
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#D4902A]">
          {CONTACT_INFO.title}
        </h4>
        <ul className="space-y-3.5 text-sm">
          {/* Phones */}
          <li className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
            <div className="space-y-2">
              {CONTACT_INFO.phones.map((phone) => (
                <div key={phone.label}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4902A] block">
                    {phone.label}
                  </span>
                  <a
                    href={phone.href}
                    className="hover:text-white transition-colors font-medium block mt-0.5"
                  >
                    {phone.number}
                  </a>
                </div>
              ))}
              <span className="text-xs text-slate-400 block">
                {CONTACT_INFO.workingHours}
              </span>
            </div>
          </li>

          {/* Email */}
          <li className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4902A] block">
                {CONTACT_INFO.email.label}
              </span>
              <a
                href={CONTACT_INFO.email.href}
                className="hover:text-white transition-colors font-medium block mt-0.5"
              >
                {CONTACT_INFO.email.address}
              </a>
              <span className="text-xs text-slate-400 block">
                {CONTACT_INFO.email.note}
              </span>
            </div>
          </li>

          {/* Offices */}
          <li className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#D4902A] shrink-0 mt-0.5" />
            <div className="space-y-2">
              {CONTACT_INFO.offices.map((office) => (
                <div key={office.label}>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4902A] block">
                    {office.label}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium mt-0.5">
                    {office.line1}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {office.line2}
                  </p>
                </div>
              ))}
            </div>
          </li>
        </ul>
      </div>
    );
  }

  // Default: 'section' variant (used in ContactSection / Contact page)
  return (
    <div className={className ?? 'space-y-5 pt-2'}>
      <span className="text-[11px] font-bold uppercase tracking-widest text-[#26543C] block">
        {CONTACT_INFO.title}
      </span>

      {/* Phone */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Phone className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-3">
          {CONTACT_INFO.phones.map((phone) => (
            <div key={phone.label}>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2C] block">
                {phone.label}
              </span>
              <a
                href={phone.href}
                className="text-base font-bold text-[#1A221E] hover:text-[#C88A2C] transition-colors block mt-0.5"
              >
                {phone.number}
              </a>
            </div>
          ))}
          <span className="text-xs text-slate-500 font-medium block">
            {CONTACT_INFO.workingHours}
          </span>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <Mail className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2C] block">
            {CONTACT_INFO.email.label}
          </span>
          <a
            href={CONTACT_INFO.email.href}
            className="text-base font-bold text-[#1A221E] hover:text-[#C88A2C] transition-colors block mt-0.5"
          >
            {CONTACT_INFO.email.address}
          </a>
          <span className="text-xs text-slate-500 font-medium">
            {CONTACT_INFO.email.note}
          </span>
        </div>
      </div>

      {/* Offices */}
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
          <MapPin className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-3">
          {CONTACT_INFO.offices.map((office) => (
            <div key={office.label}>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2C] block">
                {office.label}
              </span>
              <p className="text-sm font-semibold text-[#1A221E] leading-snug mt-0.5">
                {office.line1}
              </p>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {office.line2}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
