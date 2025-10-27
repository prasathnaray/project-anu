import axios from "axios";
import APP_URL from './config';
function GetIntructorsAPI(token, page, limit){
    const result = axios.get(APP_URL+'/api/v1/get-instructors', 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {page, limit}
        }
    );
    return result;
}
export default GetIntructorsAPI;