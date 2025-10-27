import axios from "axios";
import APP_URL from './config';
function GetgenderRatioAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-gender-ratio', 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetgenderRatioAPI;