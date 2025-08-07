import axios from 'axios';
import APP_URL from './config';

function GetCoursesAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-courses', {
        headers: 
        {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default GetCoursesAPI;