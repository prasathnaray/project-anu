// src/api/volumeUpload.js
import axios from 'axios';
import APP_URL from './config';

function VolumeUploadAPI(token, data) {
  return axios.post(`${APP_URL}/api/v1/sv-upload`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default VolumeUploadAPI;