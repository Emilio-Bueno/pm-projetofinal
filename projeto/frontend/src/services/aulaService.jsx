import api from './api.jsx';

export const aulaService = {
  getAll: () => api.get('/aulas'),
  create: (data) => api.post('/aulas', data)
};