import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchInvoicesApi,
  fetchInvoiceByIdApi,
  createInvoiceApi,
  updateInvoiceApi,
  deleteInvoiceApi,
  updateInvoiceStatusApi,
} from '../../api/invoicesApi';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchInvoicesApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchInvoiceByIdApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch invoice detail');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/createInvoice',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const data = await createInvoiceApi(invoiceData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/updateInvoice',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateInvoiceApi({ id, data });
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update invoice');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/deleteInvoice',
  async (id, { rejectWithValue }) => {
    try {
      await deleteInvoiceApi(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete invoice');
    }
  }
);

export const updateInvoiceStatus = createAsyncThunk(
  'invoices/updateInvoiceStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const updated = await updateInvoiceStatusApi({ id, status });
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update status');
    }
  }
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    selectedInvoice: null,
    total: 0,
    page: 1,
    limit: 10,
    statusFilter: 'all',
    status: 'idle',
    error: null,
  },
  reducers: {
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    clearInvoicesError: (state) => {
      state.error = null;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.invoices = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Invoice By Id
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
      })

      // Create Invoice
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
      })

      // Update Invoice
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.selectedInvoice = action.payload;
      })

      // Delete Invoice
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((i) => i.id !== action.payload);
        if (state.selectedInvoice?.id === action.payload) {
          state.selectedInvoice = null;
        }
      })

      // Update Status
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
        if (state.selectedInvoice?.id === action.payload.id) {
          state.selectedInvoice = action.payload;
        }
        const index = state.invoices.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.invoices[index].status = action.payload.status;
        }
      });
  },
});

export const { setStatusFilter, setPage, setLimit, clearInvoicesError, clearSelectedInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
