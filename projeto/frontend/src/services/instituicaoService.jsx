import api from './api.jsx';

export const instituicaoService = {
  getAll: () => api.get('/instituicoes'),
  create: (data) => api.post('/instituicoes', data),
  update: (id, data) => api.put(`/instituicoes/${id}`, data),
  remove: (id) => api.delete(`/instituicoes/${id}`)
};