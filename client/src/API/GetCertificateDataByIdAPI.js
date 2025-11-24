import axios from 'axios';
import APP_URL from './config';
function GetCertificateDataByIdAPI(token, certification_id){
    const result = axios.get(APP_URL+`/api/v1/get-certdetails/${certification_id}`, {
        headers: 
        {   
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default GetCertificateDataByIdAPI;