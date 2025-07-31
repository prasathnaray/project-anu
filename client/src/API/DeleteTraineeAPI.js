import axios from 'axios';
import APP_URL from './config';
function DeleteTraineeAPI(token, user_mail)
{
    const response = axios.delete(APP_URL+`/api/v1/delete-trainee/${user_mail}`, {
        headers: {
                'Authorization': `Bearer ${token}`
        }
    })
    return response;
}
export default DeleteTraineeAPI;