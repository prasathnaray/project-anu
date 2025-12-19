import axios from "axios";
import APP_URL from './config';
function getResourceBylmandrtAPI(token, l_module_id, resource_type) {
    const result = axios.get(APP_URL+`/api/v1/get-resource-lmandrt?learning_module_id=${l_module_id}&r_type=${resource_type}`, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default getResourceBylmandrtAPI;