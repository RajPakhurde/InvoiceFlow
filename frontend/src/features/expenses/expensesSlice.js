import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchExpensesApi,
  createExpenseApi,
  updateExpenseApi,
  deleteExpenseApi,
} from '../../api/expensesApi';

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (params, { rejectWithValue }) => {
    try {
      const data = await fetchExpensesApi(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (expenseData, { rejectWithValue, dispatch, getState }) => {
    try {
      const created = await createExpenseApi(expenseData);
      const { categoryFilter, startDateFilter, endDateFilter } = getState().expenses;
      dispatch(fetchExpenses({ category: categoryFilter, startDate: startDateFilter, endDate: endDateFilter }));
      return created;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, data }, { rejectWithValue, dispatch, getState }) => {
    try {
      const updated = await updateExpenseApi({ id, data });
      const { categoryFilter, startDateFilter, endDateFilter } = getState().expenses;
      dispatch(fetchExpenses({ category: categoryFilter, startDate: startDateFilter, endDate: endDateFilter }));
      return updated;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue, dispatch, getState }) => {
    try {
      await deleteExpenseApi(id);
      const { categoryFilter, startDateFilter, endDateFilter } = getState().expenses;
      dispatch(fetchExpenses({ category: categoryFilter, startDate: startDateFilter, endDate: endDateFilter }));
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
    categoryFilter: 'all',
    startDateFilter: '',
    endDateFilter: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setStartDateFilter: (state, action) => {
      state.startDateFilter = action.payload;
    },
    setEndDateFilter: (state, action) => {
      state.endDateFilter = action.payload;
    },
    resetFilters: (state) => {
      state.categoryFilter = 'all';
      state.startDateFilter = '';
      state.endDateFilter = '';
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
        state.expenses = action.payload;
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
  resetFilters,
  clearExpensesError,
} = expensesSlice.actions;

export default expensesSlice.reducer;
