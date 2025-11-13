import axios from "axios";
import APP_URL from "./config";
function GetVolumeDataAPI(token){
    const resp = axios.get(APP_URL+'/api/v1/get-volumes', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return resp;
}
export default GetVolumeDataAPI;