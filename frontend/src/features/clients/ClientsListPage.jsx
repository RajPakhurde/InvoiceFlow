import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, AlertTriangle, ChevronLeft, ChevronRight, Plus, Search, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { fetchClients, deleteClient, setPage, setLimit, setSearch } from './clientsSlice';
import ClientFormModal from './ClientFormModal';

export default function ClientsListPage() {
  const dispatch = useDispatch();
  const { clients, total, page, limit, status, error, search } = useSelector((state) => state.clients);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  
  // Delete confirmation modal state
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Row 3-dots dropdown state
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  useEffect(() => {
    dispatch(fetchClients({ search, page, limit }));
  }, [dispatch, search, page, limit]);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdownId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    dispatch(setSearch(e.target.value));
  };

  const handleOpenAddModal = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (client) => {
    setClientToEdit(client);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await dispatch(deleteClient(clientToDelete.id)).unwrap();
      setClientToDelete(null);
      dispatch(fetchClients({ search, page, limit }));
    } catch (err) {
      const msg = typeof err === 'object' ? err.message : err;
      setDeleteError(msg || 'Failed to delete client');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Executive Command Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-display">
                  Client Directory
                </h1>
              </div>
              <p className="text-slate-500 text-sm">
                Manage client profiles, contact details, tax identifiers, and invoicing histories.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client</span>
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search clients by name, email, or company..."
            className="w-full h-12 pl-11 pr-4 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all shadow-2xs"
          />
        </div>

        {/* Global Error Alert */}
        {error && typeof error === 'string' && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>{error}</span>
          </div>
        )}

        {/* Clients Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          {status === 'loading' && clients.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600 mb-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-sm font-mono tracking-wider text-slate-600">LOADING CLIENTS...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">No clients found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                {search ? `No client matching "${search}". Try clearing your search.` : 'Get started by creating your first client profile.'}
              </p>
              {!search && (
                <button
                  onClick={handleOpenAddModal}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer"
                >
                  + Add First Client
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50/80 border-b border-slate-200 uppercase text-[11px] font-mono tracking-wider text-slate-500 font-semibold">
                    <tr>
                      <th className="px-6 py-4">Client / Contact</th>
                      <th className="px-6 py-4">Company</th>
                      <th className="px-6 py-4">Tax ID / GSTIN</th>
                      <th className="px-6 py-4">Added Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{client.name}</div>
                          <div className="text-xs text-slate-500">{client.email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {client.company ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                              {client.company}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-600">
                          {client.gstin || '—'}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(client.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <div className="relative inline-block text-left">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveDropdownId(activeDropdownId === client.id ? null : client.id);
                              }}
                              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                              title="Actions"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {activeDropdownId === client.id && (
                              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1 z-30 animate-fade-in text-left">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    handleOpenEditModal(client);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Edit className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDropdownId(null);
                                    setDeleteError(null);
                                    setClientToDelete(client);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Standardized Pagination Bar */}
              <div className="bg-slate-50/80 border-t border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>
                    Showing <strong className="font-semibold text-slate-900">{startItem}</strong> to{' '}
                    <strong className="font-semibold text-slate-900">{endItem}</strong> of{' '}
                    <strong className="font-semibold text-slate-900">{total}</strong> entries
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Rows:</span>
                    <select
                      value={limit}
                      onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
                      className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => dispatch(setPage(page - 1))}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-semibold font-mono text-slate-700 px-2">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => dispatch(setPage(page + 1))}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Add / Edit Form Modal */}
      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingClient={clientToEdit}
      />

      {/* Delete Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Client</h3>
              <p className="text-sm text-slate-600 mt-1">
                Are you sure you want to delete <span className="text-slate-900 font-semibold">{clientToDelete.name}</span>? This action cannot be undone.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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
