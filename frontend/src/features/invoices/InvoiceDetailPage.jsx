import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2, Download, Send, AlertTriangle, X, MoreVertical, CheckCircle } from 'lucide-react';
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

  // More options dropdown state
  const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
  }, [dispatch, id]);

  useEffect(() => {
    const handleClickOutside = () => setIsMoreOptionsOpen(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  if (status === 'loading' || !selectedInvoice || selectedInvoice.id !== id) {
    return (
      <div className="p-8 text-center text-slate-500 flex items-center justify-center min-h-[60vh]">
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

  // Download PDF
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

  // Send Invoice Email
  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    setActionError(null);
    setToastMessage(null);
    try {
      await sendInvoiceEmailApi(invoice.id);
      setToastMessage(`Invoice sent successfully to ${invoice.client?.email || 'client'}!`);
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
    <div className="p-4 sm:p-6 lg:p-8 text-slate-900">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Clean Executive Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
          
          {/* Left: Breadcrumb & Invoice Number */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Link
                to="/invoices"
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
              >
                Invoices
              </Link>
              <span className="text-sm text-slate-400 font-medium">/</span>
              <span className="text-lg font-bold font-display text-slate-900 tracking-tight">
                {invoice.invoiceNumber}
              </span>
            </div>

            {getStatusBadge(invoice.status)}
          </div>

          {/* Right: Clean Streamlined Action Toolbar */}
          <div className="flex items-center gap-2">
            
            {/* Download PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isDownloadingPdf ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            {/* Send Invoice */}
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSendingEmail ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invoice</span>
                </>
              )}
            </button>

            {/* 3-Dots Dropdown Menu for Secondary/Danger Actions */}
            {(isDraft || invoice.status !== 'paid') && (
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMoreOptionsOpen(!isMoreOptionsOpen);
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 bg-white hover:bg-slate-100 transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                  title="More Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {isMoreOptionsOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-30 animate-fade-in text-left space-y-0.5">
                    {invoice.status !== 'paid' && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreOptionsOpen(false);
                          handleStatusChange('paid');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mark as Paid</span>
                      </button>
                    )}

                    {isDraft && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreOptionsOpen(false);
                            navigate(`/invoices/${invoice.id}/edit`);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5 text-blue-600" />
                          <span>Edit Draft</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsMoreOptionsOpen(false);
                            setShowDeleteModal(true);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete Invoice</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Close Cross Icon */}
            <button
              type="button"
              onClick={() => navigate('/invoices')}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer ml-1"
              title="Close detail view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications & Error Alerts */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between shadow-2xs">
            <span className="font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">
              ✕
            </button>
          </div>
        )}

        {actionError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between shadow-2xs">
            <span className="font-semibold">{actionError}</span>
            <button onClick={() => setActionError(null)} className="text-rose-600 hover:text-rose-800 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Invoice Preview Sheet (Exact PDF Template Match) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-xs space-y-8 font-sans">
          
          {/* Top Brand Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src="/invoiceflow_logo.jpg"
                alt="InvoiceFlow Logo"
                className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 shadow-2xs"
              />
              <span className="text-xl font-bold text-slate-900 font-display">
                InvoiceFlow Services
              </span>
            </div>

            <div className="sm:text-right">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">INVOICE</h2>
              <p className="text-base font-mono font-bold text-blue-600 mt-0.5">{invoice.invoiceNumber}</p>
            </div>
          </div>

          {/* BILLED TO & INVOICE DATES Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
            
            {/* Left 7 columns: BILLED TO */}
            <div className="md:col-span-7 space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                BILLED TO
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {invoice.client?.name || invoice.clientName || 'Client Name'}
              </h3>
              {(invoice.client?.company || invoice.clientCompany) && (
                <p className="text-slate-600">{invoice.client?.company || invoice.clientCompany}</p>
              )}
              <p className="text-slate-500">{invoice.client?.email || invoice.clientEmail}</p>
              {invoice.client?.address && (
                <p className="text-slate-500">{invoice.client.address}</p>
              )}
              {(invoice.client?.gstin || invoice.gstin) && (
                <p className="text-xs font-mono text-slate-500 pt-1">
                  Tax ID: {invoice.client?.gstin || invoice.gstin}
                </p>
              )}
            </div>

            {/* Right 5 columns: INVOICE DATES */}
            <div className="md:col-span-5 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2 sm:text-right">
                INVOICE DATES
              </span>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Issue Date:</span>
                <span className="font-semibold font-mono text-slate-900">
                  {new Date(invoice.createdAt || invoice.issueDate || Date.now()).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-slate-500">Due Date:</span>
                <span className="font-semibold font-mono text-slate-900">
                  {new Date(invoice.dueDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-y border-slate-100 text-xs font-mono uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center">QTY</th>
                  <th className="py-3 px-4 text-right">RATE</th>
                  <th className="py-3 px-4 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.items || []).map((item, idx) => {
                  const qty = Number(item.quantity ?? 1);
                  const rate = Number(item.rate ?? item.unitPrice ?? item.price ?? 0);
                  const lineAmount = Number(item.amount ?? (qty * rate));

                  return (
                    <tr key={idx}>
                      <td className="py-4 px-4 font-medium text-slate-800">{item.description}</td>
                      <td className="py-4 px-4 text-center font-mono text-slate-700">{qty}</td>
                      <td className="py-4 px-4 text-right font-mono text-slate-700">
                        ${rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                        ${lineAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Section: NOTES & TERMS (Left) + Totals (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
            
            {/* Left 7 columns: NOTES & TERMS */}
            <div className="md:col-span-7">
              {invoice.notes ? (
                <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    NOTES & TERMS
                  </span>
                  <p className="text-xs text-slate-600">{invoice.notes}</p>
                </div>
              ) : (
                <div className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl space-y-1">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    NOTES & TERMS
                  </span>
                  <p className="text-xs text-slate-600">Payment due upon receipt. Thank you for your business!</p>
                </div>
              )}
            </div>

            {/* Right 5 columns: Subtotal, Tax, Total Due */}
            <div className="md:col-span-5 space-y-2.5 font-mono text-sm">
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-500 font-sans">Subtotal</span>
                <span className="font-semibold text-slate-900">
                  ${Number(invoice.subtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="text-slate-500 font-sans">Tax ({Number(invoice.taxPercent ?? invoice.taxRate ?? 0)}%)</span>
                <span className="font-semibold text-slate-900">
                  ${Number(invoice.taxAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-lg font-extrabold pt-3 border-t-2 border-slate-900">
                <span className="font-sans text-slate-900">Total Due</span>
                <span className="text-blue-600">
                  ${Number(invoice.total ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Thank You Message */}
          <div className="pt-8 text-center text-xs text-slate-400 border-t border-slate-100">
            Thank you for your business!
          </div>

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Draft Invoice</h3>
              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete invoice <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
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
