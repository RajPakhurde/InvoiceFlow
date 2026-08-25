import { axiosClient } from './axiosClient';

export const fetchClientsApi = async (params = {}) => {
  const queryParams = typeof params === 'string' ? { search: params } : params;
  const response = await axiosClient.get('/clients', { params: queryParams });
  return response.data;
};

export const fetchClientByIdApi = async (id) => {
  const response = await axiosClient.get(`/clients/${id}`);
  return response.data;
};

export const createClientApi = async (data) => {
  const response = await axiosClient.post('/clients', data);
  return response.data;
};

export const updateClientApi = async ({ id, data }) => {
  const response = await axiosClient.put(`/clients/${id}`, data);
  return response.data;
};

export const deleteClientApi = async (id) => {
  const response = await axiosClient.delete(`/clients/${id}`);
  return response.data;
};
