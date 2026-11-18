import axios from 'axios';
import APP_URL from './config';

const getEnhancedFilesAPI = async (volumeId) => {
  const response = await axios.get(`${APP_URL}/api/v1/volumes/${volumeId}/enhancement/files`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` },
  });
  return response.data;
};

export default getEnhancedFilesAPI;
