import axios from 'axios';
import APP_URL from './config';

function GetResourcesModuleIdsAPI(token, module_id){
    const result = axios.post(APP_URL+'/api/v1/resources-mId', {module_id}, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return result;
}
export default GetResourcesModuleIdsAPI;