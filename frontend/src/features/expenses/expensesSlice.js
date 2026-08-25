import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchExpensesApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
} from '../../api/expensesApi';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params, { rejectWithValue, getState }) => {
    try {
      const { categoryFilter, startDateFilter, endDateFilter, page, limit } = getState().expenses;
      const mergedParams = {
        category: categoryFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
        page,
        limit,
        ...params,
      };
      const data = await fetchExpensesApi(mergedParams);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue, dispatch }) => {
    try {
      const created = await createExpenseApi(expenseData);
      dispatch(fetchExpenses());
      return created;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const updated = await updateExpenseApi({ id, data });
      dispatch(fetchExpenses());
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await deleteExpenseApi(id);
      dispatch(fetchExpenses());
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete expense');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    total: 0,
    page: 1,
    limit: 10,
    categoryFilter: 'all',
    startDateFilter: '',
    endDateFilter: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      state.page = 1;
    },
    setStartDateFilter: (state, action) => {
      state.startDateFilter = action.payload;
      state.page = 1;
    },
    setEndDateFilter: (state, action) => {
      state.endDateFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.categoryFilter = 'all';
      state.startDateFilter = '';
      state.endDateFilter = '';
      state.page = 1;
    },
    clearExpensesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (Array.isArray(action.payload)) {
          state.expenses = action.payload;
          state.total = action.payload.length;
        } else {
          state.expenses = action.payload.data || [];
          state.total = action.payload.total || 0;
          state.page = action.payload.page || 1;
          state.limit = action.payload.limit || 10;
        }
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setCategoryFilter,
  setStartDateFilter,
  setEndDateFilter,
  setPage,
  setLimit,
  resetFilters,
  clearExpensesError,
} = expensesSlice.actions;

export default expensesSlice.reducer;
