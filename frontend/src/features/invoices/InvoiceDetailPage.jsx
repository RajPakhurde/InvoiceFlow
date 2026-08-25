import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceById, updateInvoiceStatus, deleteInvoice } from './invoicesSlice';
import { downloadInvoicePdfApi, sendInvoiceEmailApi } from '../../api/invoicesApi';

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedInvoice, status, error } = useSelector((state) => state.invoices);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Phase 4 States
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  if (status === 'loading' || !selectedInvoice || selectedInvoice.id !== id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-mono text-sm tracking-wider">LOADING INVOICE DETAILS...</span>
        </div>
      </div>
    );
  }

  const invoice = selectedInvoice;
  const isDraft = invoice.status === 'draft';

  const handleStatusChange = (newStatus) => {
    dispatch(updateInvoiceStatus({ id: invoice.id, status: newStatus }));
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteInvoice(invoice.id)).unwrap();
      navigate('/invoices');
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Phase 4: Download PDF
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    setActionError(null);
    try {
      await downloadInvoicePdfApi(invoice.id, invoice.invoiceNumber);
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Failed to generate and download PDF');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Phase 4: Send Invoice Email
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    setActionError(null);
    setToastMessage(null);
    try {
      const res = await sendInvoiceEmailApi(invoice.id);
      setToastMessage(`Invoice sent successfully to ${invoice.client?.email || 'client'}!`);
      // Refresh invoice to reflect 'sent' status and sentAt timestamp
      dispatch(fetchInvoiceById(invoice.id));
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Failed to send email. Please check SMTP settings.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getStatusBadge = (statusName) => {
    switch (statusName) {
      case 'draft':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Draft</span>;
      case 'sent':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">Sent</span>;
      case 'paid':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Paid</span>;
      case 'overdue':
        return <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">Overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 sm:p-6 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <Link to="/invoices" className="text-slate-500 hover:text-slate-900 transition-colors">
              ← Back to Invoices
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900 text-lg">{invoice.invoiceNumber}</span>
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isDraft && (
              <>
                <Link
                  to={`/invoices/${invoice.id}/edit`}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors border border-blue-200"
                >
                  ✏️ Edit Draft
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors border border-rose-200"
                >
                  🗑️ Delete
                </button>
              </>
            )}

            {/* Status Change Controls */}
            {invoice.status !== 'paid' && (
              <button
                onClick={() => handleStatusChange('paid')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Mark as Paid
              </button>
            )}

            {/* Phase 4 Live Action Buttons */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>📥 Download PDF</>
              )}
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSendingEmail ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending Email...</span>
                </>
              ) : (
                <>✉️ Send Invoice</>
              )}
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-600 font-bold">✕</button>
          </div>
        )}

        {/* Action Error Alert */}
        {(error || actionError) && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{actionError || error}</span>
            <button onClick={() => setActionError(null)} className="text-rose-600 font-bold">✕</button>
          </div>
        )}

        {/* Invoice Printable View Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 space-y-8">
          
          {/* Header Branding */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                  IF
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Invoice<span className="text-blue-600">Flow</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">SMART INVOICING & FINANCE MANAGEMENT</p>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                INVOICE
              </h2>
              <p className="text-sm font-mono font-bold text-blue-600 mt-1">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* Dates & Client Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Billed To</h3>
              <p className="font-bold text-slate-900 text-base">{invoice.client?.name || 'Client Name'}</p>
              {invoice.client?.company && <p className="text-slate-700">{invoice.client.company}</p>}
              <p className="text-slate-600">{invoice.client?.email}</p>
              {invoice.client?.address && <p className="text-slate-500 whitespace-pre-line mt-1">{invoice.client.address}</p>}
              {invoice.client?.gstin && <p className="text-xs font-mono text-slate-500 mt-1">Tax ID: {invoice.client.gstin}</p>}
            </div>

            <div className="space-y-2 sm:text-right">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Issue Date</span>
                <span className="font-mono text-slate-900 font-medium">
                  {new Date(invoice.issueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Due Date</span>
                <span className="font-mono text-slate-900 font-semibold">
                  {new Date(invoice.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </span>
              </div>

              {invoice.sentAt && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Sent Date</span>
                  <span className="font-mono text-slate-600 text-xs">
                    {new Date(invoice.sentAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              )}

              {invoice.paidAt && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block text-emerald-600">Paid Date</span>
                  <span className="font-mono text-emerald-700 font-bold text-xs">
                    {new Date(invoice.paidAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[11px] font-mono tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5 text-center">Qty</th>
                  <th className="px-6 py-3.5 text-right">Rate</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items && invoice.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.description}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-mono text-slate-600">
                      ${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-900">
                      ${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-100">
            <div className="flex-1">
              {invoice.notes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Notes & Terms</h4>
                  <p className="text-xs text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {invoice.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-semibold text-slate-900">
                  ${invoice.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxPercent}%):</span>
                <span className="font-mono font-semibold text-slate-900">
                  ${invoice.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-lg">
                <span>Total Due:</span>
                <span className="font-mono text-blue-600">
                  ${invoice.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Draft Invoice</h3>
              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete <span className="text-slate-900 font-semibold">{invoice.invoiceNumber}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
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
