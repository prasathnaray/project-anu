import axios from 'axios';
import APP_URL from './config';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('user_token')}`,
});

function GetCourseMappingsAPI(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const query = params.toString();
  return axios.get(`${APP_URL}/api/v1/course-mappings${query ? `?${query}` : ''}`, {
    headers: authHeaders(),
  });
}

function CreateCourseMappingAPI(mappingData) {
  return axios.post(`${APP_URL}/api/v1/course-mappings`, mappingData, {
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
  });
}

export { GetCourseMappingsAPI, CreateCourseMappingAPI };
