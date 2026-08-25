import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { createExpense, updateExpense } from './expensesSlice';

const PRESET_CATEGORIES = [
  'Software',
  'Subscriptions',
  'Travel',
  'Equipment',
  'Marketing',
  'Office',
  'Other',
];

export default function ExpenseFormModal({ isOpen, onClose, expenseToEdit }) {
  const dispatch = useDispatch();
  const isEditMode = Boolean(expenseToEdit);

  const [categoryPreset, setCategoryPreset] = useState('Software');
  const [customCategory, setCustomCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (expenseToEdit) {
      if (PRESET_CATEGORIES.includes(expenseToEdit.category)) {
        setCategoryPreset(expenseToEdit.category);
        setCustomCategory('');
      } else {
        setCategoryPreset('Custom');
        setCustomCategory(expenseToEdit.category);
      }
      setAmount(expenseToEdit.amount || '');
      setDate(
        expenseToEdit.date
          ? new Date(expenseToEdit.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setNote(expenseToEdit.note || '');
    } else {
      setCategoryPreset('Software');
      setCustomCategory('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
    setFormError(null);
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const finalCategory =
      categoryPreset === 'Custom' ? customCategory.trim() : categoryPreset;

    if (!finalCategory) {
      setFormError('Please select or specify an expense category');
      return;
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setFormError('Amount must be a positive number');
      return;
    }

    if (!date) {
      setFormError('Please select a valid date');
      return;
    }

    const payload = {
      category: finalCategory,
      amount: numericAmount,
      date,
      note: note.trim() || null,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await dispatch(updateExpense({ id: expenseToEdit.id, data: payload })).unwrap();
      } else {
        await dispatch(createExpense(payload)).unwrap();
      }
      onClose();
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Failed to save expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {isEditMode ? 'Edit Expense' : 'Log New Expense'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditMode ? 'Update expense entry details' : 'Add a business expense to track overall profitability'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {formError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Category Dropdown & Custom Category Input */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Category <span className="text-blue-600">*</span>
            </label>
            <select
              value={categoryPreset}
              onChange={(e) => setCategoryPreset(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              {PRESET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Custom">+ Custom Category...</option>
            </select>

            {categoryPreset === 'Custom' && (
              <input
                type="text"
                placeholder="Enter custom category name (e.g. Hosting, Legal)"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 mt-2"
              />
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Amount ($) <span className="text-blue-600">*</span>
              </label>
              <input
                type="number"
                step="any"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Date <span className="text-blue-600">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          {/* Note / Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Note / Description (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Annual GitHub Enterprise renewal receipt #94012"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : isEditMode ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
