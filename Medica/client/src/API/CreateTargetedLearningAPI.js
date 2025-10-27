import axios from 'axios';
import APP_URL from './config';

function CreateTargetedLearningAPI(token, formData) {
    const response = axios.post(APP_URL+'/api/v1/create-targeted-learning', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return response;
}
export default CreateTargetedLearningAPI;