import React, { useState, useEffect } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter, Link } from '../../context/RouterContext';
import logoBgRemoved from '../../assets/logo_bg_removed.png';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to /admin
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Invalid login credentials. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@infinite7impex.com');
    setPassword('Admin@12345');
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-[#0E2318] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22C55E]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-[#C88A2C]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Back to Website link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-100/70 hover:text-emerald-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Website</span>
        </Link>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#22C55E] bg-[#163825] px-2.5 py-1 rounded border border-[#22C55E]/20">
          Admin Portal
        </span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5DCD1] p-8 sm:p-10 relative z-10 space-y-6">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#FAF7F2] border border-[#E7DFD3] shadow-inner mb-1">
            <img src={logoBgRemoved} alt="Infinite 7 Impex" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#1A221E] tracking-tight">
            Admin Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-normal">
            Enter authorized credentials to access portal management
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
            <p className="leading-snug">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@infinite7impex.com"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:ring-1 focus:ring-[#C88A2C] transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-[#FAF7F2] border border-[#D5CBC0] rounded-lg text-sm text-[#1A221E] placeholder:text-slate-400 focus:outline-none focus:border-[#C88A2C] focus:ring-1 focus:ring-[#C88A2C] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C88A2C] hover:bg-[#B57A22] text-white font-semibold text-sm py-3.5 rounded-lg shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Helper for Development */}
        <div className="pt-2 border-t border-[#EAE2D7] text-center">
          <button
            type="button"
            onClick={handleFillDemoCredentials}
            className="text-xs text-slate-500 hover:text-[#C88A2C] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Click to fill default admin credentials</span>
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-emerald-100/50">
        © {new Date().getFullYear()} Infinite 7 Impex. Secure Admin Gateway.
      </div>
    </div>
  );
};
