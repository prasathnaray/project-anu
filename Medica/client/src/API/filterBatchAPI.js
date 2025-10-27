import axios from "axios";
import APP_URL from "./config";

function filterBatchAPI(token, filterParams = {}) {
  const { batch_name, instructor_name } = filterParams;
  if (!batch_name && !instructor_name) {
    console.log("No filters applied, skipping API call");
    return Promise.resolve({ data: [] });
  }
  return axios.get(`${APP_URL}/api/v1/batch-filter`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { batch_name, instructor_name },
  });
}

export default filterBatchAPI;
