import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { fetchDashboardSummary, fetchDashboardChart } from './dashboardSlice';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { summary, chartData, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
    dispatch(fetchDashboardChart());
  }, [dispatch]);

  const hasData =
    summary &&
    (summary.totalPaid > 0 ||
      summary.totalOutstanding > 0 ||
      summary.totalExpenses > 0 ||
      summary.invoiceCounts?.draft > 0 ||
      summary.invoiceCounts?.sent > 0 ||
      summary.invoiceCounts?.paid > 0 ||
      summary.invoiceCounts?.overdue > 0);

  if (status === 'loading' && !summary) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-24 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />
            <div className="h-32 bg-white border border-slate-200 rounded-2xl animate-pulse" />
          </div>
          <div className="h-80 bg-white border border-slate-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const {
    totalOutstanding = 0,
    totalPaid = 0,
    totalExpenses = 0,
    netProfit = 0,
    invoiceCounts = { draft: 0, sent: 0, paid: 0, overdue: 0 },
  } = summary || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                EXECUTIVE DASHBOARD
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
              Welcome back, {user?.name || 'Partner'}!
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Here is your financial performance overview and revenue analytics.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/invoices/new"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              + Create Invoice
            </Link>
            <Link
              to="/expenses"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors"
            >
              + Log Expense
            </Link>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* 4 Financial Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Outstanding */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Outstanding</span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold text-sm">
                ⏳
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">Unpaid sent & overdue invoices</p>
          </div>

          {/* Total Paid */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Paid</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold text-sm">
                💰
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600">
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">Collected revenue to date</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenses</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-bold text-sm">
                💳
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
              ${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">Recorded business expenditures</p>
          </div>

          {/* Net Profit */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Profit</span>
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-bold text-sm ${
                netProfit >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'
              }`}>
                {netProfit >= 0 ? '📈' : '📉'}
              </div>
            </div>
            <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500">Revenue minus expenses</p>
          </div>

        </div>

        {/* Invoice Status Breakdown */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Invoice Status Breakdown
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-800">Draft</span>
              <span className="font-mono font-bold text-amber-900 text-lg">{invoiceCounts.draft || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-800">Sent</span>
              <span className="font-mono font-bold text-blue-900 text-lg">{invoiceCounts.sent || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">Paid</span>
              <span className="font-mono font-bold text-emerald-900 text-lg">{invoiceCounts.paid || 0}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-800">Overdue</span>
              <span className="font-mono font-bold text-rose-900 text-lg">{invoiceCounts.overdue || 0}</span>
            </div>
          </div>
        </div>

        {/* Revenue vs Expenses Chart Card */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue vs. Expenses</h2>
              <p className="text-xs text-slate-500">Continuous 12-month financial comparison</p>
            </div>
          </div>

          {!hasData ? (
            <div className="p-12 text-center text-slate-500 space-y-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
                📊
              </div>
              <h3 className="text-base font-semibold text-slate-900">No financial data yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your first invoice or log an expense to see your dashboard come to life with real-time financial analytics.
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
            <div className="h-80 w-full pt-4">
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
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="expenses" name="Expenses ($)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpenses)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
