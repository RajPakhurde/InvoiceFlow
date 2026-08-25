import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInvoice, updateInvoice, fetchInvoiceById } from './invoicesSlice';
import { fetchClientsApi } from '../../api/clientsApi';

export default function InvoiceFormPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedInvoice } = useSelector((state) => state.invoices);

  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const nextTwoWeeks = new Date();
    nextTwoWeeks.setDate(nextTwoWeeks.getDate() + 14);
    return nextTwoWeeks.toISOString().split('T')[0];
  });
  const [taxPercent, setTaxPercent] = useState(18);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { description: '', quantity: 1, rate: 0 },
  ]);

  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load clients dropdown
  useEffect(() => {
    fetchClientsApi().then((data) => setClients(data)).catch((err) => console.error(err));
  }, []);

  // Load existing invoice if edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchInvoiceById(id));
    }
  }, [dispatch, id, isEditMode]);

  // Populate form fields on load in edit mode
  useEffect(() => {
    if (isEditMode && selectedInvoice && selectedInvoice.id === id) {
      setClientId(selectedInvoice.clientId || '');
      setIssueDate(new Date(selectedInvoice.issueDate).toISOString().split('T')[0]);
      setDueDate(new Date(selectedInvoice.dueDate).toISOString().split('T')[0]);
      setTaxPercent(selectedInvoice.taxPercent || 0);
      setNotes(selectedInvoice.notes || '');
      if (selectedInvoice.items && selectedInvoice.items.length > 0) {
        setItems(
          selectedInvoice.items.map((i) => ({
            description: i.description,
            quantity: i.quantity,
            rate: i.rate,
          }))
        );
      }
    }
  }, [isEditMode, selectedInvoice, id]);

  const isReadOnly = isEditMode && selectedInvoice?.status && selectedInvoice.status !== 'draft';

  // Dynamic Line Items Handlers
  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // Live Totals Calculations
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    return sum + qty * rate;
  }, 0);

  const taxAmount = subtotal * (Number(taxPercent || 0) / 100);
  const total = subtotal + taxAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!clientId) {
      setFormError('Please select a client');
      return;
    }

    if (items.some((item) => !item.description.trim() || item.quantity <= 0 || item.rate < 0)) {
      setFormError('All line items must have a non-empty description, positive quantity, and non-negative rate');
      return;
    }

    const payload = {
      clientId,
      issueDate,
      dueDate,
      taxPercent: Number(taxPercent),
      items: items.map((i) => ({
        description: i.description.trim(),
        quantity: Number(i.quantity),
        rate: Number(i.rate),
      })),
      notes: notes.trim() || null,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const result = await dispatch(updateInvoice({ id, data: payload })).unwrap();
        navigate(`/invoices/${result.id}`);
      } else {
        const result = await dispatch(createInvoice(payload)).unwrap();
        navigate(`/invoices/${result.id}`);
      }
    } catch (err) {
      setFormError(typeof err === 'string' ? err : 'Failed to save invoice');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link to="/invoices" className="hover:text-blue-600 transition-colors">Invoices</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">{isEditMode ? 'Edit Invoice' : 'New Invoice'}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditMode ? `Edit Invoice ${selectedInvoice?.invoiceNumber || ''}` : 'Create New Invoice'}
            </h1>
          </div>
          <Link
            to="/invoices"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
        </div>

        {/* Read-Only Warning Banner */}
        {isReadOnly && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-3">
            <span className="text-lg">⚠️</span>
            <span>
              This invoice is currently in <strong className="uppercase">{selectedInvoice.status}</strong> status. Only <strong>draft</strong> invoices can be modified.
            </span>
          </div>
        )}

        {/* Form Error Banner */}
        {formError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            {formError}
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Client & Dates */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
              1. General Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Select Client <span className="text-blue-600">*</span>
                </label>
                <select
                  disabled={isReadOnly}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 disabled:opacity-50"
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Issue Date <span className="text-blue-600">*</span>
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Due Date <span className="text-blue-600">*</span>
                </label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Dynamic Line Items */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                2. Line Items
              </h2>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors border border-blue-200"
                >
                  + Add Item Row
                </button>
              )}
            </div>

            <div className="space-y-3">
              {items.map((item, index) => {
                const itemAmount = (Number(item.quantity) || 0) * (Number(item.rate) || 0);
                return (
                  <div key={index} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
                    {/* Item Description */}
                    <div className="flex-1 w-full">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 sm:hidden">
                        Description
                      </label>
                      <input
                        type="text"
                        disabled={isReadOnly}
                        placeholder="Item description (e.g. Web Development - Sprint 1)"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 w-full sm:w-auto">
                      {/* Quantity */}
                      <div className="w-full sm:w-24">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 sm:hidden">
                          Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          step="any"
                          disabled={isReadOnly}
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                        />
                      </div>

                      {/* Rate */}
                      <div className="w-full sm:w-28">
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 sm:hidden">
                          Rate ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          disabled={isReadOnly}
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Calculated Amount & Delete Button */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      <div className="sm:w-28 text-left sm:text-right font-mono font-bold text-slate-900">
                        <span className="text-xs text-slate-400 font-sans font-normal sm:hidden">Amount: </span>
                        ${itemAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>

                      {!isReadOnly && items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors text-xs font-bold shrink-0"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Summary Totals & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
                Notes & Terms (Optional)
              </h2>
              <textarea
                rows="4"
                disabled={isReadOnly}
                placeholder="Payment terms, bank details, or thank you note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-50 resize-none"
              />
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-100">
                Calculated Summary
              </h2>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span>Tax (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    disabled={isReadOnly}
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-16 h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>
                <span className="font-mono font-semibold text-slate-900">
                  ${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-bold text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-lg text-blue-600">
                  ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          {!isReadOnly && (
            <div className="flex items-center justify-end gap-4">
              <Link
                to="/invoices"
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isEditMode ? 'Update Invoice' : 'Save Invoice as Draft'}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}
