import axios from 'axios';
import APP_URL from './config';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

function GetReattDataAPI(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return axios.get(`${APP_URL}/api/v1/reatt-data${query ? `?${query}` : ''}`, {
    headers: authHeaders(),
  });
}

function CreateReattDataAPI(reattData) {
  return axios.post(`${APP_URL}/api/v1/reatt-data`, reattData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export { GetReattDataAPI, CreateReattDataAPI };
