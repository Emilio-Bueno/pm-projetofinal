import api from './api.jsx';

export const disciplinaService = {
  getAll: () => api.get('/disciplinas'),
  create: (data) => api.post('/disciplinas', data),
  update: (id, data) => api.put(`/disciplinas/${id}`, data),
  remove: (id) => api.delete(`/disciplinas/${id}`)
};