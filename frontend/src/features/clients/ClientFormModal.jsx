import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { User, Pencil, X } from 'lucide-react';
import { createClient, updateClient } from './clientsSlice';

const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  address: z.string().optional(),
  gstin: z.string().optional(),
});

export default function ClientFormModal({ isOpen, onClose, existingClient }) {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSchema),
  });

  useEffect(() => {
    if (existingClient) {
      reset({
        name: existingClient.name || '',
        email: existingClient.email || '',
        company: existingClient.company || '',
        address: existingClient.address || '',
        gstin: existingClient.gstin || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        company: '',
        address: '',
        gstin: '',
      });
    }
  }, [existingClient, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      if (existingClient) {
        await dispatch(updateClient({ id: existingClient.id, data })).unwrap();
      } else {
        await dispatch(createClient(data)).unwrap();
      }
      onClose();
    } catch (err) {
      console.error('Failed to save client:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative z-10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
              {existingClient ? <Pencil className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {existingClient ? 'Edit Client' : 'Add New Client'}
              </h2>
              <p className="text-xs text-slate-500">
                {existingClient ? 'Update client details and business info' : 'Enter client contact and billing details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors text-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Client Name <span className="text-blue-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp / John Doe"
              {...register('name')}
              className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-blue-600">*</span>
              </label>
              <input
                type="email"
                placeholder="billing@acme.com"
                {...register('email')}
                className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all"
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                placeholder="Acme Technologies Inc."
                {...register('company')}
                className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Billing Address
            </label>
            <textarea
              rows="2"
              placeholder="123 Innovation Way, Suite 400, New York, NY"
              {...register('address')}
              className="w-full p-3 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Tax ID / GSTIN
            </label>
            <input
              type="text"
              placeholder="27AAAPA1234A1Z5"
              {...register('gstin')}
              className="w-full h-11 px-4 rounded-xl bg-slate-50/70 border border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-600 text-sm transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {existingClient ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
