import axios from 'axios';
import APP_URL from './config';

function getResourceAPI(token, l_module_id) {
  return axios.get(APP_URL+`/api/v1/get-resources?learning_module_id=${l_module_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export default getResourceAPI;