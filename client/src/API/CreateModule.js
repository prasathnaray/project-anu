import axios from 'axios';
import APP_URL from './config';
function CreateModuleApi(token, formData){
   const result = axios.post(APP_URL+'/api/v1/create-module', formData, {
        headers: 
        {
            'Authorization': `Bearer ${token}`
        }
   });
   return result;
}
export default CreateModuleApi;