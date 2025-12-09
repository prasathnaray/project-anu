import axios from 'axios';
import APP_URL from './config';
function updateInstructorAPI(token, instructorDataUpdate) {
    const url = `${APP_URL}/api/v1/instructor/update`;
    const config = {
        headers: {  
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }   
    };
    return axios.put(url, instructorDataUpdate, config)
        .then(response => response.data)
        .catch(error => {
            throw error;
        }
    );
}
export default updateInstructorAPI;