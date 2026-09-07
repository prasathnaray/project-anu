import api from './api';
import axios from 'axios';
import APP_URL from './config';

export function SuperAdminStatsAPI(token) {
    if (token) {
        return axios.get(APP_URL + `/api/v1/superadmin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    return api.get('/api/v1/superadmin/stats');
}

export default SuperAdminStatsAPI;
