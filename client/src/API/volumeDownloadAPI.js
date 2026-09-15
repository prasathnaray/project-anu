import api from './api';

const volumeDownloadAPI = (volumeId, fileType) => api.get(
  `/api/v1/volumes/${encodeURIComponent(volumeId)}/download`,
  { params: { file: fileType } }
);

export const getVolumeRecordingFiles = (volumeId) => api.get(
  `/api/v1/volumes/${encodeURIComponent(volumeId)}/recordings`
);

export const downloadVolumeRecordingFile = (volumeId, recordingId, fileType, index) => api.get(
  `/api/v1/volumes/${encodeURIComponent(volumeId)}/recordings/${encodeURIComponent(recordingId)}/download`,
  { params: { file: fileType, ...(fileType === 'manifest' ? {} : { index }) } }
);

export default volumeDownloadAPI;
