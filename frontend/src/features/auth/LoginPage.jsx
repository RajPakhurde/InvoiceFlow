import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, TrendingUp, UserPlus, Sparkles, KeyRound } from 'lucide-react';
import { loginUser, clearAuthError } from './authSlice';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  const handleFillDemo = (autoSubmit = false) => {
    setValue('email', 'demo@invoiceflow.app', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    if (autoSubmit) {
      dispatch(loginUser({ email: 'demo@invoiceflow.app', password: 'password123' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* 1. Animated Radial Gradient Mesh Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-emerald-500/10 blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* 2. Floating Ticker Badges around the Card (Desktop View) */}
      <div className="hidden lg:block absolute left-12 xl:left-24 top-1/3 -translate-y-1/2 z-20 animate-pulse">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-900">INV-0015 Paid</span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Cleared
              </span>
            </div>
            <p className="text-xs font-mono font-semibold text-emerald-600">$3,410.00 received</p>
          </div>
        </div>
      </div>

      <div className="hidden lg:block absolute right-12 xl:right-24 bottom-1/3 translate-y-1/2 z-20 animate-pulse">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900">Revenue Growth</span>
            <p className="text-xs font-mono font-semibold text-blue-600">+24.8% vs last month</p>
          </div>
        </div>
      </div>

      <div className="hidden xl:block absolute right-32 top-1/4 z-20">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/90 p-3 rounded-2xl shadow-lg flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
            <UserPlus className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-800">New Client Onboarded</span>
        </div>
      </div>

      {/* 3. Centered Elevated Glass Auth Card */}
      <div className="max-w-md w-full relative z-10 space-y-4">
        
        {/* Top Back to Home Button */}
        <div className="flex items-center justify-between px-1">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-slate-500 group-hover:text-blue-600" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Brand Header */}
        <Link to="/" className="flex items-center justify-center gap-3 group pt-1">
          <img
            src="/invoiceflow_logo.jpg"
            alt="InvoiceFlow Logo"
            className="w-10 h-10 rounded-2xl object-cover border border-slate-200/80 shadow-md group-hover:scale-105 transition-transform"
          />
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
            Invoice<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
          </span>
        </Link>

        {/* Demo Account Recruiter Quick-Fill Banner Card */}
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-blue-50/90 border border-blue-200/90 rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-xs font-bold text-blue-900 uppercase font-mono tracking-wider">
                Recruiter / Portfolio Demo Login
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-2 py-0.5 rounded-full">
              Pre-Loaded Data
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Want to evaluate InvoiceFlow immediately? Use our pre-seeded demo account:
          </p>

          <div className="bg-white/90 border border-blue-100 rounded-xl p-2.5 text-xs font-mono space-y-1 text-slate-700">
            <div className="flex items-center justify-between">
              <span>Email: <strong className="text-slate-900 font-bold">demo@invoiceflow.app</strong></span>
            </div>
            <div className="flex items-center justify-between">
              <span>Password: <strong className="text-slate-900 font-bold">password123</strong></span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleFillDemo(true)}
            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>One-Click Auto Login as Demo User</span>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-blue-500/10 space-y-5">
          
          <div className="text-center space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Sign in to manage your invoices, expenses, and clients
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{typeof error === 'string' ? error : 'Invalid email or password.'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register('email')}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/80 border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 transition-all font-medium"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Create account
            </Link>
          </div>

        </div>

        {/* Security Trust Note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Protected by 256-bit SSL Banking Encryption</span>
        </div>

      </div>

    </div>
  );
}
