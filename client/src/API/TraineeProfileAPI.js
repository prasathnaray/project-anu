// import axios from 'axios';
// import APP_URL from './config';
import api from './api';
function TraineeProfileAPI(people_id){
    const result = api.get('/api/v1/trainee/'+people_id,);    
    return result;
}
export default TraineeProfileAPI;