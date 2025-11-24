import axios from "axios";
import APP_URL from './config';
function GetLearningModuleByIdAPI(token, certificate_id){
    const result = axios.get(APP_URL+`/api/v1/get-lmid/${certificate_id}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetLearningModuleByIdAPI;