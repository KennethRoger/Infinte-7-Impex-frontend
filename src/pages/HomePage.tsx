import React, { useState } from 'react';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  FileText,
  Send,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { CreateCustomerSchema, type CreateCustomerDto } from '../types/customer';
import { api } from '../services/api-client';
import { API_ENDPOINTS } from '../services/endpoints';

export const HomePage: React.FC = () => {
  const [formData, setFormData] = useState<CreateCustomerDto>({
    fullName: '',
    country: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setValidationErrors({});

    // Validate using Zod schema
    const validationResult = CreateCustomerSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post<{ _id: string; fullName: string }>(
        API_ENDPOINTS.CUSTOMERS.BASE,
        formData
      );
      setFeedback({
        success: true,
        message: response.message || 'Thank you! Your enquiry has been received.',
      });
      setFormData({
        fullName: '',
        country: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unable to submit enquiry. Is the server running?';
      setFeedback({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 py-12">
      {/* Hero Section */}
      <section id="overview" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <Badge variant="emerald" size="md" className="gap-1.5 px-3 py-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Vite + React + Tailwind v4 + Zod Client
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Direct Global Export of{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Export-Grade Produce
            </span>
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed">
            Infinite 7 Impex connects premium Indian agricultural origins with Sri Lanka and global
            import hubs with rigorous quality grading, certified packaging, and dependable transit timelines.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={() => {
                const el = document.getElementById('contact');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Custom Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const el = document.getElementById('architecture');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Client Architecture
            </Button>
          </div>
        </div>
      </section>

      {/* Core Commodities Showcase */}
      <section id="commodities" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <Badge variant="sky" size="sm" className="mb-2">
              Primary Lines
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Export Commodities</h2>
          </div>
          <span className="text-sm text-slate-400">Exported under strict international phyto standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Red &amp; Pink Onions</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Premium Nashik/Maharashtra export varieties graded by size (45mm+ to 55mm+), cured and
              mesh-bag packed for maximum container transit shelf life.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>View Specifications</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Fresh Vegetables &amp; Chillies</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              G4 Green Chillies, farm-fresh lemons, and root vegetables harvested, pre-cooled, and
              dispatched through temperature-controlled reefer cargo.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>View Specifications</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Card>

          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Spices &amp; Specialty Grains</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whole turmeric, coriander seeds, cumin, and non-basmati rice sourced straight from grower
              mandis with full traceability and batch certification.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <span>View Specifications</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </Card>
        </div>
      </section>

      {/* Client Architecture Highlights */}
      <section id="architecture" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <Badge variant="emerald" size="sm">
            Ready for First Commit
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Client Scaffolding &amp; Architecture
          </h2>
          <p className="text-sm text-slate-400">
            Engineered with strict TypeScript, Zod domain contracts, and Tailwind CSS v4 styling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="w-5 h-5" />
              <h4 className="font-semibold text-white">Tailwind CSS v4</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fast CSS-first setup using the official <code className="text-slate-300">@tailwindcss/vite</code>{' '}
              plugin without extra config overhead.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <Layers className="w-5 h-5" />
              <h4 className="font-semibold text-white">Zod Schema Typing</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runtime contract validation for enquiries, categories, products, and blogs mirror-matching
              the backend schemas.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Server className="w-5 h-5" />
              <h4 className="font-semibold text-white">Type-Safe API Client</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured generic client handling standard success and failure envelopes with automatic JWT
              token authorization.
            </p>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <FileText className="w-5 h-5" />
              <h4 className="font-semibold text-white">Modular Structure</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean separation of components (common, feedback, layout), services, config, hooks, and
              typed domain models.
            </p>
          </Card>
        </div>
      </section>

      {/* Interactive Customer Enquiry Form */}
      <section id="contact" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card className="space-y-6 border-slate-700 bg-slate-900/90 shadow-2xl p-8">
          <div className="text-center space-y-2">
            <Badge variant="emerald" size="sm">
              Live API Connection
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Submit An Export Enquiry</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              Test the end-to-end integration by submitting an enquiry directly to the Infinite 7 Impex
              backend server (<code className="text-emerald-400">POST /customers</code>).
            </p>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-lg text-sm flex items-start gap-3 border ${
                feedback.success
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/70 border-rose-800 text-rose-200'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {validationErrors.fullName && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Country <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="e.g. Sri Lanka"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {validationErrors.country && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.country}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {validationErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Phone Number <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+94 77 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                {validationErrors.phone && (
                  <p className="text-xs text-rose-400 mt-1">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Commodity &amp; Volume Requirements <span className="text-emerald-400">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Specify commodity (e.g. Red Onions 50mm+), tonnage, destination port, and delivery schedule..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              {validationErrors.message && (
                <p className="text-xs text-rose-400 mt-1">{validationErrors.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              variant="primary"
              loading={isSubmitting}
              icon={<Send className="w-4 h-4" />}
              className="w-full"
            >
              Submit Export Enquiry
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
};
