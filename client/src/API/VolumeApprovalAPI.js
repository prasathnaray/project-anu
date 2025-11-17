import axios from 'axios';
import APP_URL from './config';

function VolumeApprovalAPI(token, status){
    const result = axios.patch(APP_URL+`/api/v1/approve-volume/${status}`, {
        headers : {
            'Authorization':  `Bearer ${token}`
        }
    })
    return result;
}
export default VolumeApprovalAPI;