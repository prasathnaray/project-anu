import axios from 'axios';
import APP_URL from './config.js';

function GetShadowRecordingCountsAPI() {
    const response = axios.get(APP_URL+'/api/v1/volume-recording-counts', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    });
    return response;
}

export default GetShadowRecordingCountsAPI;
