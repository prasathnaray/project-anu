import axios from "axios";
import APP_URL from './config';
function GetCertificateByCurAPI(token, curiculum_id){
    const result = axios.get(APP_URL+`/api/v1/get-cert/${curiculum_id}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetCertificateByCurAPI;
