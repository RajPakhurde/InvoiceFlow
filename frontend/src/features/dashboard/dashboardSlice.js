import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDashboardSummaryApi, fetchDashboardChartApi } from '../../api/dashboardApi';

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchDashboardSummary',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchDashboardSummaryApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch dashboard summary');
    }
  }
);

export const fetchDashboardChart = createAsyncThunk(
  'dashboard/fetchDashboardChart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchDashboardChartApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch revenue chart data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    chartData: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchDashboardChart.fulfilled, (state, action) => {
        state.chartData = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
