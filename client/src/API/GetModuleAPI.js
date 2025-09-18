import axios from 'axios';
import APP_URL from './config';

function GetModuleApi(token, urlId){
    const result = axios.get(APP_URL+`/api/v1/get-module?course_id=${urlId}` , {
        headers: {
            'Authorization' : `Bearer ${token}`
        }
    })
    return result;
}
export default GetModuleApi;