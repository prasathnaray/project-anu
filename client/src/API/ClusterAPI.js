import api from './api';

export const GetClustersAPI = () => api.get('/api/v1/clusters');

export const CreateClusterAPI = (data) => api.post('/api/v1/clusters', data);

export const UpdateClusterAPI = (clusterId, data) => api.put(`/api/v1/clusters/${clusterId}`, data);

export const DeleteClusterAPI = (clusterId) => api.delete(`/api/v1/clusters/${clusterId}`);

export const GetClusterRecordingCountsAPI = () => api.get('/api/v1/clusters/recording-counts');

export const GetClusterRecordingsAPI = (clusterId) => api.get(`/api/v1/clusters/${clusterId}/recordings`);

export const UploadClusterRecordingAPI = (clusterId, formData) => api.post(`/api/v1/clusters/${clusterId}/recordings`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const UploadRecordingAPI = (formData) => api.post('/api/v1/uploadvolumerecording', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const ReplaceClusterRecordingAPI = (clusterId, recordingId, formData) => {
  const url = recordingId
    ? `/api/v1/clusters/${encodeURIComponent(clusterId)}/recordings/${encodeURIComponent(recordingId)}`
    : `/api/v1/clusters/${encodeURIComponent(clusterId)}/recordings/replace`;
  return api.put(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default {
  GetClustersAPI,
  CreateClusterAPI,
  UpdateClusterAPI,
  DeleteClusterAPI,
  GetClusterRecordingCountsAPI,
  GetClusterRecordingsAPI,
  UploadClusterRecordingAPI,
  UploadRecordingAPI,
  ReplaceClusterRecordingAPI,
};
