import api from './api';
import axios from 'axios';
import APP_URL from './config';

export function SuperAdminStatsAPI(paramsOrToken, maybeParams) {
    const isToken = typeof paramsOrToken === 'string' && paramsOrToken.length > 25;
    const token = isToken ? paramsOrToken : null;
    const params = isToken ? maybeParams : paramsOrToken;

    if (token) {
        return axios.get(APP_URL + `/api/v1/superadmin/stats`, {
            params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    return api.get('/api/v1/superadmin/stats', { params });
}

export function getSystemHealthAPI() {
    return api.get('/api/v1/superadmin/system-health');
}

export default SuperAdminStatsAPI;
