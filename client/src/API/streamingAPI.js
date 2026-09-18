import axios from 'axios';
import APP_URL from './config';

const authorization = () => ({
  Authorization: `Bearer ${localStorage.getItem('user_token') || ''}`
});

export const createViewerSession = async () => {
  const response = await axios.post(
    `${APP_URL}/api/v1/streaming/viewer-session`,
    {},
    { headers: authorization() }
  );
  return response.data;
};

export const createSelfViewerSession = async () => {
  const response = await axios.post(
    `${APP_URL}/api/v1/streaming/self-viewer-session`,
    {},
    { headers: authorization() }
  );
  return response.data;
};
