import axios from 'axios';
import APP_URL from './config'
function GetAdminsAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-admins', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default GetAdminsAPI