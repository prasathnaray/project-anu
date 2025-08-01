import axios from 'axios';
import APP_URL from './config';
function TraineeListAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-trainees', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return result;
}
export default TraineeListAPI;