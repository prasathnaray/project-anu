// import axios from 'axios';
// import APP_URL from './config';
// function TraineeListAPI(token, page, limit){
//     const result = axios.get(APP_URL+'/api/v1/get-trainees', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         },
//         params: {page, limit}
//     });
//     return result;
// }
// export default TraineeListAPI;

import api from './api';
function TraineeListAPI(page, limit){
    const result = api.get('/api/v1/get-trainees', {
        params: {page, limit}
    });
    return result;
}
export default TraineeListAPI;
