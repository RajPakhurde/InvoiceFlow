import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { fetchDashboardSummary, fetchDashboardChart } from './dashboardSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { summary, chartData, status, error } = useSelector((state) => state.dashboard);

  const [chartPeriod, setChartPeriod] = useState('12months');
  const [activePieIndex, setActivePieIndex] = useState(null);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchDashboardChart(chartPeriod));
  }, [dispatch, chartPeriod]);

  const handlePeriodChange = (period) => {
    setChartPeriod(period);
  };

  if (status === 'loading' && !summary) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[60vh]">
        <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-mono tracking-wider text-slate-600">LOADING DASHBOARD METRICS...</p>
      </div>
    );
  }

  const {
    totalOutstanding = 0,
    totalPaid = 0,
    totalExpenses = 0,
    netProfit = 0,
    invoiceCounts = {},
  } = summary || {};

  const totalInvoicesCount =
    (invoiceCounts.draft || 0) +
    (invoiceCounts.sent || 0) +
    (invoiceCounts.paid || 0) +
    (invoiceCounts.overdue || 0);

  const hasData = (chartData || []).some((item) => item.revenue > 0 || item.expenses > 0);

  // Pie chart data structure
  const pieData = [
    { name: 'Draft', value: invoiceCounts.draft || 0, key: 'draft', color: '#f59e0b' },
    { name: 'Sent', value: invoiceCounts.sent || 0, key: 'sent', color: '#3b82f6' },
    { name: 'Paid', value: invoiceCounts.paid || 0, key: 'paid', color: '#10b981' },
    { name: 'Overdue', value: invoiceCounts.overdue || 0, key: 'overdue', color: '#f43f5e' },
  ].filter((item) => item.value > 0);

  const displayPieData = pieData.length > 0 ? pieData : [{ name: 'None', value: 1, key: 'none', color: '#e2e8f0' }];

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Executive Command Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Welcome back, {user?.name || 'Partner'}!
                </h1>
              </div>
              <p className="text-slate-500 text-sm">
                Here is your real-time financial performance overview, revenue analytics, and status distribution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/invoices/new"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </Link>
            <Link
              to="/expenses"
              className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Expense</span>
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Financial Analytics & Executive Summary Side-by-Side Row (70% / 30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Revenue vs. Expenses Area Chart (70% width -> lg:col-span-8) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 font-display">Revenue vs. Expenses</h2>
                <p className="text-xs text-slate-500">
                  {chartPeriod === '30days' && 'Daily financial comparison over the last 30 days'}
                  {chartPeriod === '12months' && 'Continuous 12-month financial comparison'}
                  {chartPeriod === 'yearly' && 'Annual financial comparison over the last 5 years'}
                </p>
              </div>

              {/* Timeframe Switcher Segmented Control */}
              <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                <button
                  type="button"
                  onClick={() => handlePeriodChange('30days')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border outline-none cursor-pointer ${
                    chartPeriod === '30days'
                      ? 'bg-white text-blue-600 border-slate-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
                  }`}
                >
                  30 Days
                </button>

                <button
                  type="button"
                  onClick={() => handlePeriodChange('12months')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border outline-none cursor-pointer ${
                    chartPeriod === '12months'
                      ? 'bg-white text-blue-600 border-slate-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
                  }`}
                >
                  12 Months
                </button>

                <button
                  type="button"
                  onClick={() => handlePeriodChange('yearly')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border outline-none cursor-pointer ${
                    chartPeriod === 'yearly'
                      ? 'bg-white text-blue-600 border-slate-200/90 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-200/50'
                  }`}
                >
                  5 Years
                </button>
              </div>
            </div>

            {!hasData ? (
              <div className="p-12 text-center text-slate-500 space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-slate-900">No financial data yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Add your first invoice or log an expense to see real-time financial analytics.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <Link
                    to="/invoices/new"
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
                  >
                    + Create Invoice
                  </Link>
                  <Link
                    to="/expenses"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                  >
                    + Log Expense
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="monthLabel" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, '']}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="expenses" name="Expenses ($)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Right: Single Consolidated Financial Summary Card (30% width -> lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col justify-between space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-display">Financial Summary</h3>
                <p className="text-xs text-slate-500">Key performance indicators</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="divide-y divide-slate-100 space-y-3.5">
              
              {/* 1. Total Outstanding */}
              <div className="flex items-center justify-between pt-3.5 first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outstanding</p>
                    <p className="text-[11px] text-slate-400">Unpaid & overdue</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold font-mono text-slate-900">
                    ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* 2. Total Revenue Paid */}
              <div className="flex items-center justify-between pt-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue Paid</p>
                    <p className="text-[11px] text-slate-400">Collected revenue</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold font-mono text-emerald-600">
                    ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* 3. Total Expenses */}
              <div className="flex items-center justify-between pt-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</p>
                    <p className="text-[11px] text-slate-400">Business outgoings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-extrabold font-mono text-slate-900">
                    ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* 4. Net Profit */}
              <div className="flex items-center justify-between pt-3.5">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                    netProfit >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {netProfit >= 0 ? <TrendingUp className="w-4.5 h-4.5" /> : <TrendingDown className="w-4.5 h-4.5" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</p>
                    <p className="text-[11px] text-slate-400">Revenue - expenses</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-base font-extrabold font-mono ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Interactive Invoice Status Breakdown (Donut Chart + Filter Shortcuts) */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">Invoice Status Distribution</h2>
            <p className="text-xs text-slate-500">Interactive status breakdown — click any card to filter invoices</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            
            {/* Donut Chart View */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center justify-center relative">
              <div className="w-full h-52 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={displayPieData.length > 1 ? 4 : 0}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      onMouseLeave={() => setActivePieIndex(null)}
                    >
                      {displayPieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                          className="transition-all duration-200 cursor-pointer hover:opacity-80"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [`${val} Invoices`, name]}
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Hole Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-extrabold font-mono text-slate-900">
                    {totalInvoicesCount}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Actionable Status Cards */}
            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Draft */}
              <div
                onClick={() => navigate('/invoices?status=draft')}
                className="p-4 rounded-2xl bg-amber-50/50 hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Draft</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-extrabold text-amber-950">{invoiceCounts.draft || 0}</span>
                    <span className="text-xs text-amber-700 font-mono">
                      ({totalInvoicesCount > 0 ? Math.round(((invoiceCounts.draft || 0) / totalInvoicesCount) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-amber-100/80 group-hover:bg-amber-200/80 text-amber-800 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Sent */}
              <div
                onClick={() => navigate('/invoices?status=sent')}
                className="p-4 rounded-2xl bg-blue-50/50 hover:bg-blue-50 border border-blue-200/80 hover:border-blue-300 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Sent</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-extrabold text-blue-950">{invoiceCounts.sent || 0}</span>
                    <span className="text-xs text-blue-700 font-mono">
                      ({totalInvoicesCount > 0 ? Math.round(((invoiceCounts.sent || 0) / totalInvoicesCount) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-blue-100/80 group-hover:bg-blue-200/80 text-blue-800 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Paid */}
              <div
                onClick={() => navigate('/invoices?status=paid')}
                className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 hover:border-emerald-300 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">Paid</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-extrabold text-emerald-950">{invoiceCounts.paid || 0}</span>
                    <span className="text-xs text-emerald-700 font-mono">
                      ({totalInvoicesCount > 0 ? Math.round(((invoiceCounts.paid || 0) / totalInvoicesCount) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-emerald-100/80 group-hover:bg-emerald-200/80 text-emerald-800 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Overdue */}
              <div
                onClick={() => navigate('/invoices?status=overdue')}
                className="p-4 rounded-2xl bg-rose-50/50 hover:bg-rose-50 border border-rose-200/80 hover:border-rose-300 transition-all cursor-pointer group flex items-center justify-between shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-900">Overdue</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-2xl font-extrabold text-rose-950">{invoiceCounts.overdue || 0}</span>
                    <span className="text-xs text-rose-700 font-mono">
                      ({totalInvoicesCount > 0 ? Math.round(((invoiceCounts.overdue || 0) / totalInvoicesCount) * 100) : 0}%)
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-rose-100/80 group-hover:bg-rose-200/80 text-rose-800 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
