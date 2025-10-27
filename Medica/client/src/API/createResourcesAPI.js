import axios from 'axios';
import APP_URL from './config';
function CreateResourceApi(token, formData){
   const result = axios.post(APP_URL+'/api/v1/create-resource', formData, {
        headers: 
        {
            'Authorization': `Bearer ${token}`
        }
   });
   return result;
}
export default CreateResourceApi;