import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FileQuestion,
  ArrowLeft,
  LayoutDashboard,
  FileText,
  CreditCard,
  Users,
  Home,
  LogIn,
  Search,
  Sparkles,
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const quickLinks = isAuthenticated
    ? [
        { title: 'Dashboard', desc: 'Revenue & analytics overview', path: '/dashboard', icon: LayoutDashboard, color: 'text-blue-600 bg-blue-50' },
        { title: 'Invoices', desc: 'Manage & create invoices', path: '/invoices', icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
        { title: 'Expenses', desc: 'Track expenditures', path: '/expenses', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50' },
        { title: 'Clients', desc: 'Client address directory', path: '/clients', icon: Users, color: 'text-purple-600 bg-purple-50' },
      ]
    : [
        { title: 'Home Page', desc: 'Explore InvoiceFlow platform', path: '/', icon: Home, color: 'text-blue-600 bg-blue-50' },
        { title: 'Sign In', desc: 'Access your account', path: '/login', icon: LogIn, color: 'text-indigo-600 bg-indigo-50' },
      ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between relative overflow-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Background Ambient Mesh Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group outline-none">
          <img
            src="/invoiceflow_logo.jpg"
            alt="InvoiceFlow Logo"
            className="w-8 h-8 rounded-xl object-cover border border-slate-200/80 shadow-2xs group-hover:scale-105 transition-transform"
          />
          <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
            Invoice<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
          </span>
        </Link>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Go Back</span>
        </button>
      </header>

      {/* Main 404 Hero Section */}
      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center my-auto space-y-8">
        
        {/* Floating 404 Icon Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-blue-500/5 relative"
        >
          <div className="absolute -top-1 -right-1">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
            </span>
          </div>
          <FileQuestion className="w-12 h-12 text-blue-600" />
        </motion.div>

        {/* 404 Title & Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Error 404 • Page Not Found</span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tight font-display text-slate-900 leading-none">
            Lost in <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 bg-clip-text text-transparent">Space?</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-lg mx-auto font-normal leading-relaxed pt-2">
            The page, invoice document, or endpoint you are looking for doesn't exist, has been removed, or moved to a different address.
          </p>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
        >
          <Link
            to={isAuthenticated ? '/dashboard' : '/'}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isAuthenticated ? 'Back to Executive Dashboard' : 'Return to Home Page'}</span>
          </Link>

          {!isAuthenticated && (
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-blue-600" />
              <span>Sign In to Account</span>
            </Link>
          )}
        </motion.div>

        {/* Quick Destinations Card Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-6 border-t border-slate-200/80 space-y-4"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Navigation Shortcuts
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-blue-300 transition-all outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${link.color} shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {link.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.div>

      </main>

      {/* Footer Disclaimer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-400 border-t border-slate-200/60">
        <span>© {new Date().getFullYear()} InvoiceFlow Inc. All rights reserved. • Error Code: 404_PAGE_NOT_FOUND</span>
      </footer>

    </div>
  );
}
