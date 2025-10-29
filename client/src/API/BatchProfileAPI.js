import axios from 'axios';
import APP_URL from './config';
function BatchProfileAPI(token, batch_id)
{
    const result = axios.get(APP_URL+`/api/v1/batch-individual/${batch_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    return result
}
export default BatchProfileAPI;