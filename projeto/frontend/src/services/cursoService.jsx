import api from './api.jsx';

export const cursoService = {
  getAll: () => api.get('/cursos'),
  create: (data) => api.post('/cursos', data),
  update: (id, data) => api.put(`/cursos/${id}`, data),
  remove: (id) => api.delete(`/cursos/${id}`)
};