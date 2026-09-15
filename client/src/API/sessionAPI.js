import api from './api';

export const getMySessions = () => api.get('/api/v1/sessions/me');
export const searchSessionUsers = (search) => api.get('/api/v1/sessions/users', { params: { search } });
export const getUserSessions = (email) => api.get(`/api/v1/sessions/users/${encodeURIComponent(email)}`);
export const endSession = (email, id) => api.delete(
  `/api/v1/sessions/users/${encodeURIComponent(email)}/${encodeURIComponent(id)}`
);
export const endAllSessions = (email) => api.post(
  `/api/v1/sessions/users/${encodeURIComponent(email)}/logout-all`
);
export const logoutCurrentSession = () => api.post('/api/v1/sessions/logout');
