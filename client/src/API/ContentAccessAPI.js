import api from './api';

export const getCourses = (view = 'management') => api.get('/api/v1/courses', { params: { view } });
export const getMyCourses = () => api.get('/api/v1/me/courses');
export const createCourse = (payload) => api.post('/api/v1/courses', payload);
export const updateCourse = (courseId, payload) => api.patch(`/api/v1/courses/${courseId}`, payload);
export const setCourseState = (courseId, state) => api.post(`/api/v1/courses/${courseId}/${state}`);
export const setInstitutionAccess = (courseId, payload) => api.put(`/api/v1/courses/${courseId}/institution-access`, payload);
export const getAssignments = (courseId) => api.get(`/api/v1/courses/${courseId}/assignments`);
export const replaceAssignments = (courseId, payload) => api.put(`/api/v1/courses/${courseId}/assignments`, payload);
export const getInstitutions = () => api.get('/api/v1/institutions');
export const addInstitutionAdmin = (institutionId, payload) => api.post(`/api/v1/institutions/${institutionId}/admins`, payload);
export const getSuperAdmins = () => api.get('/api/v1/super-admins');
export const addSuperAdmin = (payload) => api.post('/api/v1/super-admins', payload);
export const getMigrationReview = () => api.get('/api/v1/migration-review');
export const resolveCourseOwnership = (courseId, payload) => api.put(`/api/v1/migration-review/courses/${courseId}`, payload);
export const resolveVolumeOwnership = (volumeId, payload) => api.put(`/api/v1/migration-review/volumes/${volumeId}`, payload);
export const migrateCourseMapping = (mappingId, payload) => api.post(`/api/v1/migration-review/course-mappings/${mappingId}`, payload);

export const getBatchesForAssignments = () => api.get('/api/v1/get-batches', { params: { page: 1, limit: 500 } });
export const getTraineesForAssignments = () => api.get('/api/v1/get-trainees', { params: { page: 1, limit: 500 } });
