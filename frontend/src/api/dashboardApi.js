import { axiosClient } from './axiosClient';

export const fetchDashboardSummaryApi = async () => {
  const response = await axiosClient.get('/dashboard/summary');
  return response.data;
};

export const fetchDashboardChartApi = async (period = '12months') => {
  const response = await axiosClient.get(`/dashboard/revenue-chart?period=${period}`);
  return response.data;
};
