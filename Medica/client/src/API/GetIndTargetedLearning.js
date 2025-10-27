import axios from 'axios';
import APP_URL from './config';

function GetIndTargetedLearning(token)
{
    const response = axios.get(APP_URL+'/api/v1/tllist-ind', {
        headers: {
            'Authorization':  `Bearer ${token}`
        }
    })
    return response;
}
export default GetIndTargetedLearning;