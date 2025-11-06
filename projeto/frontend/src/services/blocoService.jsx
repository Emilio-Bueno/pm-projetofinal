import api from './api.jsx';

export const blocoService = {
  getAll: () => api.get('/blocos'),
  create: (data) => api.post('/blocos', data),
  update: (id, data) => api.put(`/blocos/${id}`, data),
  remove: (id) => api.delete(`/blocos/${id}`)
};