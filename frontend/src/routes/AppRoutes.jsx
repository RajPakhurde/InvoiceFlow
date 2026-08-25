import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import ProtectedRoute from '../components/ProtectedRoute';

const ProtectedPlaceholder = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
    <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
        IF
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
      <p className="text-slate-400 text-sm">
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
        <Route path="/dashboard" element={<ProtectedPlaceholder title="Dashboard" />} />
        <Route path="/clients" element={<ProtectedPlaceholder title="Clients Management" />} />
        <Route path="/invoices" element={<ProtectedPlaceholder title="Invoices" />} />
        <Route path="/expenses" element={<ProtectedPlaceholder title="Expense Tracker" />} />
      </Route>

      <Route path="*" element={<ProtectedPlaceholder title="404 - Page Not Found" />} />
    </Routes>
  );
}
