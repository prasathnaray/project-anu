import api from './api';

export const getActivityStatistics = (params = {}) => api.get('/api/v1/super-admin/statistics', { params });

export const getActivitySummary = (params = {}) => api.get('/api/v1/super-admin/activity-summary', { params });

export const getRecentActivities = (params = {}) => api.get('/api/v1/super-admin/recent-activities', { params });

export const trackAction = (payload) => api.post('/api/v1/activity-logs/track', payload);

export default {
  getActivityStatistics,
  getActivitySummary,
  getRecentActivities,
  trackAction
};
