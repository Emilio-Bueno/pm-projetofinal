import api from './api.jsx';

export const aulaService = {
  getAll: () => api.get('/aulas'),
  create: (data) => api.post('/aulas', data),
  update: (id, data) => api.put(`/aulas/${id}`, data),
  remove: (id) => api.delete(`/aulas/${id}`)
};