import { axiosClient } from './axiosClient';

export const fetchExpensesApi = async ({ category, startDate, endDate } = {}) => {
  const params = {};
  if (category && category !== 'all') params.category = category;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await axiosClient.get('/expenses', { params });
  return response.data;
};

export const createExpenseApi = async (data) => {
  const response = await axiosClient.post('/expenses', data);
  return response.data;
};

export const updateExpenseApi = async ({ id, data }) => {
  const response = await axiosClient.put(`/expenses/${id}`, data);
  return response.data;
};

export const deleteExpenseApi = async (id) => {
  const response = await axiosClient.delete(`/expenses/${id}`);
  return response.data;
};
