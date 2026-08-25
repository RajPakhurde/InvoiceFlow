import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import { injectStore } from '../api/axiosClient';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

injectStore(store);
