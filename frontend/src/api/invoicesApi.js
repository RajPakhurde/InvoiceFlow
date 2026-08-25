import { axiosClient } from './axiosClient';

export const fetchInvoicesApi = async ({ status, clientId, page = 1, limit = 20 } = {}) => {
  const params = {};
  if (status && status !== 'all') params.status = status;
  if (clientId) params.clientId = clientId;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await axiosClient.get('/invoices', { params });
  return response.data;
};

export const fetchInvoiceByIdApi = async (id) => {
  const response = await axiosClient.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoiceApi = async (data) => {
  const response = await axiosClient.post('/invoices', data);
  return response.data;
};

export const updateInvoiceApi = async ({ id, data }) => {
  const response = await axiosClient.put(`/invoices/${id}`, data);
  return response.data;
};

export const deleteInvoiceApi = async (id) => {
  const response = await axiosClient.delete(`/invoices/${id}`);
  return response.data;
};

export const updateInvoiceStatusApi = async ({ id, status }) => {
  const response = await axiosClient.patch(`/invoices/${id}/status`, { status });
  return response.data;
};

export const downloadInvoicePdfApi = async (id, invoiceNumber = 'invoice') => {
  const response = await axiosClient.get(`/invoices/${id}/pdf`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', `${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

export const sendInvoiceEmailApi = async (id) => {
  const response = await axiosClient.post(`/invoices/${id}/send`);
  return response.data;
};
