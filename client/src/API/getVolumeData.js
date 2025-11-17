import axios from "axios";
import APP_URL from './config';
function GetVolumeData(token){
    const result = axios.get(APP_URL+'/api/v1/get-volumes', 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetVolumeData;