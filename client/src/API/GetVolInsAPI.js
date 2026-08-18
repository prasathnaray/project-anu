import axios from 'axios';
import APP_URL from './config';

const GetVolInsAPI = () => axios.get(APP_URL + '/api/v1/get-volumes-by-instructor', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('user_token')}`
    }
});

export default GetVolInsAPI;
