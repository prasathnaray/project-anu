// import axios from "axios";
// import APP_URL from './config';
import api from './api';
const getDashboardAPI = () => {
    const result = api.get('/api/v1/get-dashboard-data');
    return result;
}
export default getDashboardAPI