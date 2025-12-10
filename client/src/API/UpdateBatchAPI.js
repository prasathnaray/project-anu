import axios from 'axios';  
import APP_URL from './config';
function UpdateBatchAPI(batchData) {
    const token = localStorage.getItem('user_token');
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    return axios.put(`${APP_URL}/api/v1/update-batch-data`, batchData, config)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            throw error;
        }); 
}
export default UpdateBatchAPI;