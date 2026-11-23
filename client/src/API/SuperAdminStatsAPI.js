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

export function getSystemHealthHistoryAPI(params = {}) {
    return api.get('/api/v1/superadmin/system-health-history', { params });
}

export function getSecurityAlertsAPI(params = {}) {
    return api.get('/api/v1/superadmin/security-alerts', { params });
}

export function handleSecurityAlertActionAPI(id, data) {
    return api.post(`/api/v1/superadmin/security-alerts/${id}/action`, data);
}

export function getInstitutionRankingsAPI(params = {}) {
    return api.get('/api/v1/superadmin/institution-rankings', { params });
}

export function getSystemMaintenanceAPI() {
    return api.get('/api/v1/superadmin/system-maintenance');
}

export function exportReportAPI(params = {}) {
    return api.get('/api/v1/superadmin/export-report', {
        params,
        responseType: params.format === 'csv' ? 'blob' : 'json'
    });
}

export default SuperAdminStatsAPI;
