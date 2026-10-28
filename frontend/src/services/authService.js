import { api } from './apiClient';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials), // -> { token, user }
  register: (data) => api.post('/auth/register', data), // -> { token, user }
  me: () => api.get('/auth/me'),
  updateMe: (changes) => api.put('/auth/me', changes),
  changePassword: (data) => api.put('/auth/me/password', data),
};
