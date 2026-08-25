import { axiosClient } from './axiosClient';

export const registerApi = async (userData) => {
  const response = await axiosClient.post('/auth/register', userData);
  return response.data;
};

export const loginApi = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials);
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosClient.post('/auth/logout');
  return response.data;
};

export const refreshApi = async () => {
  const response = await axiosClient.post('/auth/refresh');
  return response.data;
};

export const getMeApi = async () => {
  const response = await axiosClient.get('/auth/me');
  return response.data;
};
