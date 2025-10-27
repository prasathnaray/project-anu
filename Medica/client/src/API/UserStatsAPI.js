import axios from "axios";
import APP_URL from "./config";

function UserStatsAPI(token){
    const result = axios.get(APP_URL + `/api/v1/user-stats`, {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
    return result;
}
export default UserStatsAPI;