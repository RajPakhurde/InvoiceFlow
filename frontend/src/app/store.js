import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import clientsReducer from '../features/clients/clientsSlice';
import invoicesReducer from '../features/invoices/invoicesSlice';
import expensesReducer from '../features/expenses/expensesSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import { injectStore } from '../api/axiosClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clients: clientsReducer,
    invoices: invoicesReducer,
    expenses: expensesReducer,
    dashboard: dashboardReducer,
  },
});

injectStore(store);
