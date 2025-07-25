import axios from "axios";
import APP_URL from './config';
function GetIntructorsAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-instructors', 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetIntructorsAPI;