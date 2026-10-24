import api from './api';

export const GetClustersAPI = () => api.get('/api/v1/clusters');

export const CreateClusterAPI = (data) => api.post('/api/v1/clusters', data);

export const UpdateClusterAPI = (clusterId, data) => api.put(`/api/v1/clusters/${clusterId}`, data);

export const DeleteClusterAPI = (clusterId) => api.delete(`/api/v1/clusters/${clusterId}`);

export default {
  GetClustersAPI,
  CreateClusterAPI,
  UpdateClusterAPI,
  DeleteClusterAPI,
};
