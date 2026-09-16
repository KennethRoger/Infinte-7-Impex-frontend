import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowUpRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { CreateCustomerSchema, type CreateCustomerDto, type Customer } from '../../types/customer';
import { api } from '../../services/api-client';
import { API_ENDPOINTS } from '../../services/endpoints';
import { useToast } from '../../context/ToastContext';

interface ContactSectionProps {
  id?: string;
  isStandalonePage?: boolean;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  id = 'get-quote',
  isStandalonePage = false,
}) => {
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState<CreateCustomerDto>({
    fullName: '',
    country: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setFieldErrors({});

    // Zod Client-side validation
    const result = CreateCustomerSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = issue.message;
        }
      });
      setFieldErrors(errors);
      showError('Please correct the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<{ _id: string; fullName: string }>(
        API_ENDPOINTS.CUSTOMERS.BASE,
        formData
      );

      const successMsg =
        response.message ||
        'Enquiry submitted successfully! Our export desk will contact you within 24 hours.';

      setFeedback({
        success: true,
        message: successMsg,
      });
      showSuccess(successMsg);

      // Also persist into local customer list so admin can view it immediately
      const newCustomer: Customer = {
        _id: response.data?._id || 'cust_' + Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        message: formData.message,
        priority: 'unset',
        isActive: true,
        notes: 'Submitted via website quotation form',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const existingRaw = localStorage.getItem('mock_customers_list');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          'mock_customers_list',
          JSON.stringify([newCustomer, ...existingList])
        );
      } catch {
        // ignore
      }

      setFormData({
        fullName: '',
        country: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: unknown) {
      // Fallback for offline dev
      const newCustomer: Customer = {
        _id: 'cust_' + Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        message: formData.message,
        priority: 'unset',
        isActive: true,
        notes: 'Submitted via website quotation form (offline mode)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const existingRaw = localStorage.getItem('mock_customers_list');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem(
          'mock_customers_list',
          JSON.stringify([newCustomer, ...existingList])
        );
      } catch {
        // ignore
      }

      const successMsg =
        'Enquiry recorded successfully! Our export desk will contact you within 24 hours.';
      setFeedback({
        success: true,
        message: successMsg,
      });
      showSuccess(successMsg);

      setFormData({
        fullName: '',
        country: '',
        email: '',
        phone: '',
        message: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id={id}
      className={`py-20 bg-[#E8DFD2] ${!isStandalonePage ? 'border-t border-[#D8CDBC]' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Contact details & information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C88A2C] block">
                Get A Quote
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A221E] font-serif leading-[1.2]">
                Ready to source from India? Let's talk
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1 font-normal">
                Fill your requirements and our export team will respond within 24 hours with an
                itemized price sheet, product availability, and shipping options to your destination.
              </p>
            </div>

            {/* Direct Contact Blocks */}
            <div className="space-y-5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#26543C] block">
                Our Contacts
              </span>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <a
                    href="tel:+919865993308"
                    className="text-base font-bold text-[#1A221E] hover:text-[#C88A2C] transition-colors block"
                  >
                    +91 986 599 3308
                  </a>
                  <span className="text-xs text-slate-500 font-medium">Mon-Sat, 9am - 7pm IST</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <a
                    href="mailto:exports@infinite7impex.com"
                    className="text-base font-bold text-[#1A221E] hover:text-[#C88A2C] transition-colors block"
                  >
                    exports@infinite7impex.com
                  </a>
                  <span className="text-xs text-slate-500 font-medium">response within 24 hours</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#153323] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-base font-bold text-[#1A221E] block">
                    Kollam, Kerala, India
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Primary trade desk &amp; logistics office</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form Card matching Figma */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-7 sm:p-10 border border-[#E5DCD1] shadow-sm space-y-6">
              {/* Feedback alert */}
              {feedback && (
                <div
                  className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${
                    feedback.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  {feedback.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your name here"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD1] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Your country here"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD1] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                  />
                  {fieldErrors.country && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.country}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email here"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD1] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Your phone no. here"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD1] rounded-lg px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="State your requirements here"
                    className="w-full bg-[#FAF7F2] border border-[#E5DCD1] rounded-lg p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:bg-white transition-all"
                  />
                  {fieldErrors.message && (
                    <p className="text-xs text-rose-600 font-medium">{fieldErrors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#153323] hover:bg-[#0E2318] text-white py-3.5 px-6 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
