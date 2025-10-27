import axios from "axios";
import APP_URL from './config';
function CreateBatchAPI(token, batchData){
    const result = axios.post(APP_URL+'/api/v1/create-batch', batchData, 
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default CreateBatchAPI;
