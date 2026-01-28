import axios from 'axios';
import APP_URL from './config';

function AssoVolumeAPI(data){
    const result = axios.post(APP_URL+`/api/v1/associateVolume` , data, {
        headers: {
            'Authorization' : `Bearer ${localStorage.getItem('user_token')}`
        }
    });
    return result;
}
export default AssoVolumeAPI;