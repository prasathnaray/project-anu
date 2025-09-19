import axios from 'axios';
import APP_URL from './config';

function getResourceAPI(token, module_id) {
  return axios.get(APP_URL+`/api/v1/get-resources?module_id=${module_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export default getResourceAPI;