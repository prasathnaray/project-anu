import api from './api';

export const GetClustersAPI = () => api.get('/api/v1/clusters');

export const CreateClusterAPI = (data) => api.post('/api/v1/clusters', data);

export const UpdateClusterAPI = (clusterId, data) => api.put(`/api/v1/clusters/${clusterId}`, data);

export const DeleteClusterAPI = (clusterId) => api.delete(`/api/v1/clusters/${clusterId}`);

export const GetClusterRecordingCountsAPI = () => api.get('/api/v1/clusters/recording-counts');

export const GetClusterRecordingsAPI = (clusterId) => api.get(`/api/v1/clusters/${clusterId}/recordings`);

export const UploadClusterRecordingDirectAPI = async (clusterId, recording) => {
  const base = `/api/v1/clusters/${encodeURIComponent(clusterId)}/recordings`;
  const files = [
    ...recording.recording_files.map((file) => ({ field: 'recording_file', file })),
    ...recording.audio_files.map((file) => ({ field: 'audio_file', file })),
    ...recording.image_files.map((file) => ({ field: 'images', file })),
    { field: 'manifest_file', file: recording.manifest_file },
  ];
  const { data: prepared } = await api.post(`${base}/prepare`, {
    volume_id: recording.volume_id,
    recording_name: recording.recording_name,
    recording_type: recording.recording_type,
    files: files.map(({ field, file }) => ({ field, filename: file.name, size: file.size })),
  });

  for (const upload of prepared.uploads) {
    const file = files[upload.index]?.file;
    if (!file || upload.field !== files[upload.index].field || upload.filename !== file.name) {
      throw new Error('The upload instructions did not match the selected files.');
    }
    const response = await fetch(upload.uploadUrl, {
      method: 'PUT',
      headers: upload.headers,
      body: file,
    });
    if (!response.ok) {
      throw new Error(`Could not upload ${file.name} (${response.status}). Please retry.`);
    }
  }

  return api.post(`${base}/complete`, { uploadToken: prepared.uploadToken });
};

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
  UploadClusterRecordingDirectAPI,
  UploadClusterRecordingAPI,
  UploadRecordingAPI,
  ReplaceClusterRecordingAPI,
};
