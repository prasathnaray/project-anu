import axios from 'axios';
import APP_URL from './config';

function getConvertedVolumeListApi(){
    const result = axios.get(APP_URL+'/api/v1/converted-volumes', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
        },
    })
    return result;
}
export default getConvertedVolumeListApi;