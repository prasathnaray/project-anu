import axios from 'axios';
import APP_URL from './config';

function GetTarLearningAPI(token){
    const result = axios.get(APP_URL+'/api/v1/tllist', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default GetTarLearningAPI