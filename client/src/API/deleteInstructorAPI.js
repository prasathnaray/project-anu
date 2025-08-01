import axios from 'axios';
import APP_URL from './config'
function DeleteInstructorAPI(token, user_mail) 
{
    const result = axios.delete(APP_URL+`/api/v1/delete-ins/${user_mail}`, {
        headers : {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default DeleteInstructorAPI;