import axios from 'axios';
import APP_URL from './config';
function ModuleNewAPI(token, formData){
   const result = axios.post(APP_URL+'/api/v1/create-new-module', formData, {
        headers: 
        {
            'Authorization': `Bearer ${token}`
        }
   });
   return result;
}
export default ModuleNewAPI;