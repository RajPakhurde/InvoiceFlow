import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchClientsApi,
  fetchClientByIdApi,
  createClientApi,
  updateClientApi,
  deleteClientApi,
} from '../../api/clientsApi';

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (search, { rejectWithValue }) => {
    try {
      const data = await fetchClientsApi(search);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch clients');
    }
  }
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchClientByIdApi(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch client details');
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/createClient',
  async (clientData, { rejectWithValue }) => {
    try {
      const data = await createClientApi(clientData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create client');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await updateClientApi({ id, data });
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update client');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id, { rejectWithValue }) => {
    try {
      await deleteClientApi(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.error?.message || 'Failed to delete client';
      const status = error.response?.status;
      return rejectWithValue({ message, status });
    }
  }
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    clients: [],
    selectedClient: null,
    status: 'idle',
    error: null,
    search: '',
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearClientsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Fetch Client By Id
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.selectedClient = action.payload;
      })

      // Create Client
      .addCase(createClient.fulfilled, (state, action) => {
        state.clients.unshift(action.payload);
      })

      // Update Client
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.clients.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.clients[index] = action.payload;
        }
        if (state.selectedClient?.id === action.payload.id) {
          state.selectedClient = { ...state.selectedClient, ...action.payload };
        }
      })

      // Delete Client
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.clients = state.clients.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSearch, clearClientsError } = clientsSlice.actions;
export default clientsSlice.reducer;
