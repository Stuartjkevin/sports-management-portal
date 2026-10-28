// One small service per backend resource. Pages call these instead of using fetch directly.
import { api, toQuery } from './apiClient';

// Standard list/get/create/update/remove calls for a REST resource.
function crud(basePath) {
  return {
    list: (filters) => api.get(`${basePath}${toQuery(filters)}`),
    get: (id) => api.get(`${basePath}/${id}`),
    create: (data) => api.post(basePath, data),
    update: (id, changes) => api.patch(`${basePath}/${id}`, changes),
    remove: (id) => api.delete(`${basePath}/${id}`),
  };
}

export const clubService = crud('/clubs');

export const teamService = {
  ...crud('/teams'),
  roster: (teamId) => api.get(`/teams/${teamId}/players`),
};

export const playerService = {
  ...crud('/players'),
  me: () => api.get('/players/me'),
};

export const matchService = crud('/matches');

export const tournamentService = {
  ...crud('/tournaments'),
  standings: (id) => api.get(`/tournaments/${id}/standings`),
};

export const trainingService = {
  ...crud('/training'),
  attendance: (sessionId) => api.get(`/training/${sessionId}/attendance`),
  saveAttendance: (sessionId, records) => api.put(`/training/${sessionId}/attendance`, { records }),
  myAttendance: () => api.get('/training/me/attendance'),
};

export const notificationService = {
  list: () => api.get('/notifications'), // -> { unreadCount, notifications }
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  remove: (id) => api.delete(`/notifications/${id}`),
};

export const analyticsService = {
  overview: () => api.get('/analytics/overview'),
  sport: (sport) => api.get(`/analytics/sport/${sport}`),
};

export const selectionService = {
  recommend: (data) => api.post('/team-selection', data),
};
