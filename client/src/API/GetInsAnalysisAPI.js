import axios from 'axios';
import APP_URL from './config';
function GetInsAnalysisAPI(token, people_id){
    const response = axios.get(APP_URL+`/api/v1/instructor-ind?people_id=${people_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response;
}
export default GetInsAnalysisAPI;
