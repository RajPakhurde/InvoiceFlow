import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';
import Navbar from '../components/Navbar';
import DashboardPage from '../features/dashboard/DashboardPage';
import ClientsListPage from '../features/clients/ClientsListPage';
import InvoicesListPage from '../features/invoices/InvoicesListPage';
import InvoiceFormPage from '../features/invoices/InvoiceFormPage';
import InvoiceDetailPage from '../features/invoices/InvoiceDetailPage';
import ExpensesListPage from '../features/expenses/ExpensesListPage';

const ProtectedLayout = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

const ProtectedPlaceholder = ({ title }) => (
  <div className="flex-1 flex items-center justify-center p-6 my-auto">
    <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
        IF
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
      <p className="text-slate-500 text-sm">
        Protected Route Verified. Module features coming in upcoming phases.
      </p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/clients" element={<ClientsListPage />} />
          
          {/* Invoice Routes */}
          <Route path="/invoices" element={<InvoicesListPage />} />
          <Route path="/invoices/new" element={<InvoiceFormPage />} />
          <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />

          {/* Expense Routes */}
          <Route path="/expenses" element={<ExpensesListPage />} />
        </Route>
      </Route>

      <Route path="*" element={<ProtectedPlaceholder title="404 - Page Not Found" />} />
    </Routes>
  );
}
