import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
  getSummary: (params) => api.get('/transactions/summary', { params }),
  exportCSV: (params) => api.get('/transactions/export', {
    params,
    responseType: 'blob',
  }),
};

export const budgetAPI = {
  getAll: (params) => api.get('/budgets', { params }),
  upsert: (data) => api.post('/budgets', data),
  delete: (id) => api.delete(`/budgets/${id}`),
};
