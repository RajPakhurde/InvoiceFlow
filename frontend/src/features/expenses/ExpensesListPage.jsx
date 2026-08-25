import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchExpenses,
  setCategoryFilter,
  setStartDateFilter,
  setEndDateFilter,
  resetFilters,
  deleteExpense,
} from './expensesSlice';
import ExpenseFormModal from './ExpenseFormModal';

export default function ExpensesListPage() {
  const dispatch = useDispatch();
  const { expenses, categoryFilter, startDateFilter, endDateFilter, status, error } = useSelector(
    (state) => state.expenses
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(
      fetchExpenses({
        category: categoryFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
      })
    );
  }, [dispatch, categoryFilter, startDateFilter, endDateFilter]);

  const handleOpenAddModal = () => {
    setExpenseToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteExpense(expenseToDelete.id)).unwrap();
      setExpenseToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate Running Total of currently displayed expenses
  const runningTotal = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const getCategoryBadgeClass = (categoryName) => {
    switch (categoryName.toLowerCase()) {
      case 'software':
      case 'subscriptions':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'travel':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'equipment':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'marketing':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'office':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <span className="font-mono text-xs uppercase tracking-widest font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                FINANCE // EXPENSES
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {expenses.length} {expenses.length === 1 ? 'entry' : 'entries'} recorded
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-display">
              Expense Tracker
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Running Total Card */}
            <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl flex items-center gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                  Filtered Running Total
                </span>
                <span className="text-xl font-extrabold font-mono text-slate-900">
                  ${runningTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Log Expense</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Category Filter */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
                className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="all">All Categories</option>
                <option value="Software">Software</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Travel">Travel</option>
                <option value="Equipment">Equipment</option>
                <option value="Marketing">Marketing</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => dispatch(setStartDateFilter(e.target.value))}
                className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => dispatch(setEndDateFilter(e.target.value))}
                className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            {/* Clear Filters */}
            {(categoryFilter !== 'all' || startDateFilter || endDateFilter) && (
              <button
                onClick={() => dispatch(resetFilters())}
                className="mt-5 h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors"
              >
                Clear Filters ✕
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        )}

        {/* Expenses List / Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {status === 'loading' && expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-mono tracking-wider text-slate-600">LOADING EXPENSES...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-2xl">
                💳
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No expenses recorded</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {categoryFilter !== 'all' || startDateFilter || endDateFilter
                  ? 'No expenses match the selected filters. Try adjusting your search criteria.'
                  : 'Start tracking business expenses to keep accurate record of your profit margins.'}
              </p>
              <button
                onClick={handleOpenAddModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs"
              >
                + Log Expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[11px] font-mono tracking-wider text-slate-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Note / Description</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getCategoryBadgeClass(
                            exp.category
                          )}`}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">
                        {new Date(exp.date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-slate-800 font-medium">
                        {exp.note || <span className="text-slate-400 italic">No notes</span>}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                        ${Number(exp.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(exp)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors border border-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setExpenseToDelete(exp)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors border border-rose-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Expense Form Modal */}
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />

      {/* Delete Confirmation Modal */}
      {expenseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Expense Entry</h3>
              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete the <span className="text-slate-900 font-semibold">{expenseToDelete.category}</span> expense of <span className="text-slate-900 font-bold">${Number(expenseToDelete.amount).toFixed(2)}</span>?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setExpenseToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
