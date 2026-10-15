import axios from 'axios';
import APP_URL from './config';

export const uploadVolumePlacementAPI = (formData) => {
  return axios.post(`${APP_URL}/api/v1/volume-placement`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user_token')}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getVolumePlacementsAPI = (volumeId = null) => {
  const url = volumeId
    ? `${APP_URL}/api/v1/volume-placements?volume_id=${encodeURIComponent(volumeId)}`
    : `${APP_URL}/api/v1/volume-placements`;
  return axios.get(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user_token')}`,
    },
  });
};

export default {
  uploadVolumePlacementAPI,
  getVolumePlacementsAPI,
};
