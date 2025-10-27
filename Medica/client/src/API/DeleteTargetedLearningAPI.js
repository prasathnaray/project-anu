import axios from 'axios';
import APP_URL from './config';

function DeleteTargetedLearningAPI(token, targeted_learning_id){
    const result = axios.delete(APP_URL+`/api/v1/tl-delete/${targeted_learning_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default DeleteTargetedLearningAPI;