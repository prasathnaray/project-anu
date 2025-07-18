import axios from "axios";
import APP_URL from './config';
function GetBatchesAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-batches', 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default GetBatchesAPI;
