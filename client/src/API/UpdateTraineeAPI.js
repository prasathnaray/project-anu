import axios from 'axios';
import APP_URL from './config';
function UpdateTraineeAPI(token, instructorDataUpdate) {
    return axios.put(
        `${APP_URL}/api/v1/trainee/update`,
        {}, 
        {
            params: {
                user_id: instructorDataUpdate.user_id,
                batch_id: instructorDataUpdate.batch_id
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then(response => response.data);
}
export default UpdateTraineeAPI;