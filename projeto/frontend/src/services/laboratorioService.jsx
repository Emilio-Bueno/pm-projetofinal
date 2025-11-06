import api from './api.jsx';

export const laboratorioService = {
  getAll: () => api.get('/laboratorios'),
  create: (data) => api.post('/laboratorios', data),
  update: (id, data) => api.put(`/laboratorios/${id}`, data),
  remove: (id) => api.delete(`/laboratorios/${id}`)
};