import axios from "axios";
import APP_URL from "./config";
function DeleteCurAPI(token, curiculum_id){
    const result = axios.delete(APP_URL+`/api/v1/delete-cur/${curiculum_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default DeleteCurAPI;