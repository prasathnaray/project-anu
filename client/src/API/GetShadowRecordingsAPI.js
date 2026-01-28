import axios from 'axios';
import APP_URL from './config.js';

function GetShadowRecordingsAPI(volume_id) {
    const response = axios.get(APP_URL+`/api/v1/shadow-recordings?volume_id=${volume_id}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    });
    return response;
}
export default GetShadowRecordingsAPI;