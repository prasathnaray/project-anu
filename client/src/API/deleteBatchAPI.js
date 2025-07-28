// http://localhost:4004/api/v1/delete-batch/
import axios from "axios";
import APP_URL from "./config";
const DeleteBatchAPI = (token, batch_id) => {
    const result = axios.delete(APP_URL+`/api/v1/delete-batch/${batch_id}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default DeleteBatchAPI;