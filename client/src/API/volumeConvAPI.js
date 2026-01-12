import axios from 'axios';
import APP_URL from './config';

function volumeConvAPI(volume_id) {
    const result = axios.put(APP_URL+`/api/v1/convert-vol/${volume_id}`, {}, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    })
    return result;
}
export default volumeConvAPI;