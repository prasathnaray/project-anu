import axios from 'axios';
import APP_URL from './config';
function AddTraineeAPI(token, traineeData){
    const result = axios.post(APP_URL+'/api/v1/create-trainee', traineeData,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        }
);
    return result;
}
export default AddTraineeAPI;