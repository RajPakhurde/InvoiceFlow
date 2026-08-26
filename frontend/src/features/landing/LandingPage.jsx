import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  TrendingUp,
  CreditCard,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Layers,
  ChevronDown,
  Lock,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeFaq, setActiveFaq] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const screenshots = {
    dashboard: {
      title: 'Executive Financial Dashboard',
      subtitle: 'Real-time revenue analytics, net profit margins, and interactive invoice status distribution.',
      img: '/assets/if-dashboard.png',
      alt: 'InvoiceFlow Executive Dashboard Screenshot',
    },
    invoices: {
      title: 'Invoices & Billing Directory',
      subtitle: 'Server-side paginated list with 3-dots action menus, instant status filters, and draft edits.',
      img: '/assets/if-invoiceandbilling.png',
      alt: 'InvoiceFlow Invoices and Billing Table Screenshot',
    },
    detail: {
      title: 'PDF Receipt & Detail View',
      subtitle: 'Pixel-perfect PDF generation, email delivery to clients, line items breakdown, and tax calculations.',
      img: '/assets/if-invoice.png',
      alt: 'InvoiceFlow PDF Receipt Detail Screenshot',
    },
  };

  // Left Info Text Variant: Enters from Extreme Left (-140px), Exits scaling down in place (scale 0.85)
  const showcaseTextVariants = {
    enter: {
      x: -140,
      opacity: 0,
      scale: 0.9,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      x: 0,
      opacity: 0,
      scale: 0.85,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  // Right Screenshot Image Variant: Enters from Extreme Right (+180px), Exits scaling down in place (scale 0.85)
  const showcaseImageVariants = {
    enter: {
      x: 180,
      opacity: 0,
      scale: 0.85,
    },
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.55,
        ease: [0.25, 1, 0.5, 1],
      },
    },
    exit: {
      x: 0,
      opacity: 0,
      scale: 0.85,
      transition: {
        duration: 0.35,
        ease: [0.25, 1, 0.5, 1],
      },
    },
  };

  const faqs = [
    {
      q: 'How does InvoiceFlow handle tax calculations and PDF generation?',
      a: 'InvoiceFlow automatically calculates subtotal, tax amounts, and grand totals based on customizable tax rates. You can generate and download pixel-perfect PDF receipts with one click.',
    },
    {
      q: 'Can I track business expenses alongside client invoices?',
      a: 'Yes! InvoiceFlow includes a full Expense Tracker module allowing you to record expenditures, assign operational categories, and monitor net profit margins.',
    },
    {
      q: 'Is my financial data secure?',
      a: 'Absolutely. All user data is protected by industry-standard JWT authentication and 256-bit encrypted SSL database connections.',
    },
    {
      q: 'Can I upgrade or downgrade my plan at any time?',
      a: 'Yes, you can change your subscription tier anytime from your account settings with zero hassle.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Floating Glass Landing Navbar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-2xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.img
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              src="/invoiceflow_logo.jpg"
              alt="InvoiceFlow Logo"
              className="w-9 h-9 rounded-2xl object-cover border border-slate-200/80 shadow-xs"
            />
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
              Invoice<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#showcase" className="hover:text-blue-600 transition-colors">Showcase</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button (Visible ONLY on Mobile) */}
          <div className="flex md:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>

        </div>

        {/* Mobile Expanded Drawer Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 px-4 pt-3 pb-6 space-y-4 overflow-hidden"
            >
              <nav className="flex flex-col space-y-3 font-semibold text-sm text-slate-700 border-b border-slate-100 pb-4">
                <a
                  href="#showcase"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Showcase
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  FAQ
                </a>
              </nav>

              <div className="flex flex-col gap-2.5">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-md"
                    >
                      <span>Get Started Free</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                    >
                      Sign In to Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-20 overflow-hidden">
        
        {/* Background Mesh Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Staggered Entrance Animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Hero Eyebrow Header with Faded Center-Thick Horizontal Line */}
            <div className="inline-flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                THE MODERN FINANCIAL PLATFORM FOR SAAS & FREELANCERS
              </span>
              <div className="relative w-72 sm:w-96 h-1 mt-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-xs opacity-80" />
                <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 font-display max-w-4xl mx-auto leading-[1.15]">
              Smart Invoicing & Financial Management Made <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">Effortless</span>.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Create pixel-perfect PDF receipts, track real-time revenue analytics, monitor business expenses, and streamline client billing in one intuitive hub.
            </p>
          </motion.div>

          {/* Hero CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>Start Free Trial Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="#showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-base shadow-xs transition-colors cursor-pointer"
            >
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span>Explore Live Showcase</span>
            </motion.a>
          </motion.div>

          {/* Security & Feature Micro-Bullets */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500 pt-4"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Instant PDF receipts
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              256-bit SSL Data Security
            </span>
          </motion.div>

          {/* Main Hero App Screenshot Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="pt-8 max-w-6xl mx-auto relative group"
          >
            {/* Ambient Radial Backlight Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-emerald-600/25 rounded-3xl blur-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative rounded-3xl bg-slate-950/90 backdrop-blur-2xl p-2.5 sm:p-4 shadow-[0_30px_90px_-15px_rgba(59,130,246,0.35)] border border-slate-800/90 transition-all duration-500 hover:scale-[1.01]"
            >
              {/* macOS Window Header Bar */}
              <div className="flex items-center justify-between pb-3 px-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 hover:opacity-80 transition-opacity" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90 hover:opacity-80 transition-opacity" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 hover:opacity-80 transition-opacity" />
                </div>
                <div className="bg-slate-900/90 px-4 py-1 rounded-xl text-[11px] font-mono text-slate-400 border border-slate-800/80 hidden sm:flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>https://app.invoiceflow.com/dashboard</span>
                </div>
                <div className="w-12" />
              </div>

              {/* Real Dashboard Screenshot inside macOS Window */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 shadow-2xl">
                <img
                  src="/assets/if-dashboard.png"
                  alt="InvoiceFlow Executive Dashboard Screenshot"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* Interactive Application Showcase Section */}
      <section id="showcase" className="py-20 bg-white border-y border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            {/* Eyebrow Header with Faded Center-Thick Line */}
            <div className="inline-flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
                APPLICATION SHOWCASE
              </span>
              <div className="relative w-48 sm:w-56 h-1 mt-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-xs opacity-80" />
                <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
              Built for speed, accuracy, and executive financial clarity.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Explore the exact features and interfaces built into InvoiceFlow.
            </p>
          </motion.div>

          {/* Interactive Showcase Tabs */}
          <div className="flex justify-center gap-2 sm:gap-4 border-b border-slate-200 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>1. Executive Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'invoices'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>2. Invoices & Billing Table</span>
            </button>

            <button
              onClick={() => setActiveTab('detail')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'detail'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>3. PDF Receipts & Details</span>
            </button>
          </div>

          {/* Active Screenshot Presentation: Left Info Enters from Extreme Left (-140px), Right Image Enters from Extreme Right (+180px), Outgoing Fades & Scales Down (0.85) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 min-h-[440px]">
            
            {/* Screenshot Details (Left 4 Columns) - Enters from Extreme Left */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + '-text'}
                variants={showcaseTextVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="lg:col-span-4 space-y-4"
              >
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  {screenshots[activeTab].title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {screenshots[activeTab].subtitle}
                </p>
                
                <ul className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Real-time state synchronization with Redux Toolkit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Sub-second server response times & pagination</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Minimalist enterprise typography & micro-interactions</span>
                  </li>
                </ul>

                <div className="pt-4">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    <span>Try this feature now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Screenshot Display (Right 8 Columns) - Enters from Extreme Right (+180px) */}
            <div className="lg:col-span-8 relative group [perspective:1400px]">
              
              {/* Ambient Soft Backlight Glow */}
              <div className={`absolute -inset-8 rounded-full blur-3xl opacity-60 group-hover:opacity-90 transition-all duration-700 pointer-events-none ${
                activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-purple-600/25' :
                activeTab === 'invoices' ? 'bg-gradient-to-r from-indigo-600/30 via-blue-600/25 to-cyan-600/25' :
                'bg-gradient-to-r from-emerald-600/30 via-teal-600/25 to-blue-600/25'
              }`} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + '-image'}
                  variants={showcaseImageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative overflow-hidden py-4 transition-all duration-700 ease-out [transform:rotateX(12deg)_rotateY(-16deg)_rotateZ(4deg)_scale(1.02)] group-hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)_scale(1.0)]"
                >
                  <img
                    src={screenshots[activeTab].img}
                    alt={screenshots[activeTab].alt}
                    className="w-full object-cover shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] transition-all duration-500 [mask-image:radial-gradient(ellipse_92%_88%_at_50%_45%,#000_50%,transparent_100%)]"
                  />
                </motion.div>
              </AnimatePresence>

            </div>

          </div>

        </div>
      </section>

      {/* Core Capabilities Grid Section */}
      <section id="features" className="py-20 bg-[#f8fafc] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            {/* Eyebrow Header with Faded Center-Thick Line */}
            <div className="inline-flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">
                POWERFUL FEATURES
              </span>
              <div className="relative w-48 sm:w-56 h-1 mt-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent blur-xs opacity-80" />
                <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-600 to-transparent" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
              Everything you need to master your cash flow.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Designed from the ground up for modern businesses, agency owners, and independent professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-blue-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Instant PDF Invoicing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Generate clean PDF receipts formatted with custom line items, unit rates, tax percentages, and terms.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Revenue vs. Expense Charts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visualize continuous cash flow trends across 30 days, 12 months, and 5-year comparison timeframes.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-amber-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Expense Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Categorize business outgoings by vendor, date, and budget tier to calculate true Net Profit margins.
              </p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Client Directory & Tax IDs</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Store client contact profiles, corporate addresses, and Tax/GSTIN identifiers for seamless billing.
              </p>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-rose-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Server-Side Pagination</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                High-performance Prisma database pagination with rows-per-page selectors for rendering massive data sets.
              </p>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs hover:shadow-xl hover:border-sky-300 transition-all space-y-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Enterprise JWT Auth</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Secure cookie & token authentication with 256-bit SSL encrypted backend PostgreSQL storage.
              </p>
            </motion.div>

          </div>

        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3 max-w-3xl mx-auto"
          >
            {/* Eyebrow Header with Faded Center-Thick Line */}
            <div className="inline-flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-600">
                TRANSPARENT PRICING
              </span>
              <div className="relative w-48 sm:w-56 h-1 mt-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent blur-xs opacity-80" />
                <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-600 to-transparent" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
              Simple plans for businesses of all sizes.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              No hidden fees. Start free and scale as your transaction volume grows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Starter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
              className="bg-slate-50/80 border border-slate-200 p-8 rounded-3xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-display">Starter</h3>
                <p className="text-slate-500 text-xs">For freelancers & solo creators</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-slate-900">$0</span>
                  <span className="text-slate-500 text-xs">/ forever free</span>
                </div>
                <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Up to 10 Invoices / Month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Client Directory Storage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Expense Logging</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs text-center transition-colors cursor-pointer"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan (Featured) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-slate-950 border-2 border-blue-600 p-8 rounded-3xl space-y-6 flex flex-col justify-between text-white relative shadow-2xl"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded-full shadow-md">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white font-display">Pro Business</h3>
                <p className="text-slate-400 text-xs">For growing agencies & teams</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-white">$19</span>
                  <span className="text-slate-400 text-xs">/ per month</span>
                </div>
                <ul className="space-y-3 text-xs font-semibold text-slate-300 pt-4 border-t border-slate-800">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Unlimited Invoices & Receipts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Instant PDF Downloads & Email Delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Executive Analytics & Donut Charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    <span>Server-Side Paginated Tables</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs text-center shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
              >
                Start 14-Day Free Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-slate-50/80 border border-slate-200 p-8 rounded-3xl space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 font-display">Enterprise</h3>
                <p className="text-slate-500 text-xs">For large organizations</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-mono text-slate-900">$49</span>
                  <span className="text-slate-500 text-xs">/ per month</span>
                </div>
                <ul className="space-y-3 text-xs font-semibold text-slate-700 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Everything in Pro Plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Custom Brand PDF Templates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Dedicated 24/7 Priority Support</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/login"
                className="w-full py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs text-center transition-colors cursor-pointer"
              >
                Contact Sales
              </Link>
            </motion.div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#f8fafc] border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            {/* Eyebrow Header with Faded Center-Thick Line */}
            <div className="inline-flex flex-col items-center">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <div className="relative w-56 sm:w-72 h-1 mt-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-xs opacity-80" />
                <div className="relative w-full h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
              </div>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
              Have questions? We have answers.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs cursor-pointer transition-all overflow-hidden"
                onClick={() => toggleFaq(idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-bold text-slate-900">{faq.q}</h3>
                  <motion.div
                    animate={{ rotate: activeFaq === idx ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {activeFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="mt-3 text-sm text-slate-600 pt-3 border-t border-slate-100 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(255,255,255,0))] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10"
        >
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display">
            Ready to streamline your invoicing & financial management?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Join thousands of businesses managing their cash flow with speed, accuracy, and executive clarity.
          </p>

          <div className="pt-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-xl shadow-blue-500/25 transition-all cursor-pointer"
              >
                <span>Get Started Free Today</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Landing Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/invoiceflow_logo.jpg"
              alt="InvoiceFlow Logo"
              className="w-7 h-7 rounded-xl object-cover border border-slate-200"
            />
            <span className="font-extrabold text-slate-900 text-sm font-display">InvoiceFlow</span>
            <span>© {new Date().getFullYear()} InvoiceFlow Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <a href="#showcase" className="hover:text-slate-900 transition-colors">Showcase</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
