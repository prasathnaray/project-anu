import axios from 'axios';
import APP_URL from './config';

const GetVolInsAPI = async() => {
    try {
        const response = await axios.get(APP_URL+ '/api/v1/get-volumes-by-instructor', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user_token')}`
            }
        })
        return response;
    }
    catch (err){
        console.log(err)
    }
}
export default GetVolInsAPI;