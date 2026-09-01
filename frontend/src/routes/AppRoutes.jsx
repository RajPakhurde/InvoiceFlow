import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from '../features/landing/LandingPage';
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
import NotFoundPage from '../components/NotFoundPage';

const ProtectedLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected SaaS App Routes */}
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

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
