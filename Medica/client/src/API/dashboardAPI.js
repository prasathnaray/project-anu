import axios from "axios";
import APP_URL from './config';
const getDashboardAPI = (token) => {
    const result = axios.get(APP_URL+'/api/v1/get-dashboard-data',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    );
    return result;
}
export default getDashboardAPI