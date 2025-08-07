import axios from 'axios';
import APP_URL from './config';
const GetCoursesByCuriculumAPI = async (token, curiculumId) => {
  const response = await axios.get(`${APP_URL}/api/v1/get-cours-cur/${curiculumId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default GetCoursesByCuriculumAPI;