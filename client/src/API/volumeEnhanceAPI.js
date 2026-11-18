import axios from 'axios';
import APP_URL from './config';

const volumeEnhanceAPI = (volumeId) => axios.post(
  `${APP_URL}/api/v1/volumes/${volumeId}/enhance`,
  {},
  { headers: { Authorization: `Bearer ${localStorage.getItem('user_token')}` } }
);

export default volumeEnhanceAPI;
