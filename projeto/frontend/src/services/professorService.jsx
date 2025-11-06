import api from './api.jsx';

export const professorService = {
  getAll: () => api.get('/professores'),
  create: (data) => api.post('/professores', data),
  update: (id, data) => api.put(`/professores/${id}`, data),
  remove: (id) => api.delete(`/professores/${id}`)
};