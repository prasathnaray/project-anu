import axios from 'axios';
import APP_URL from './config';

export const GetQueriesAPI = async (token, page, limit) => {
    try {
        const response = await axios.get(`${APP_URL}/api/v1/queries`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: { page, limit },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching queries:', error);
        throw error;
    }
};

export const UpdateQueryStatusAPI = async (token, query_id, status) => {
    try {
        const response = await axios.put(`${APP_URL}/api/v1/queries/${query_id}/status`, { status }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating query status:', error);
        throw error;
    }
};

export const DeleteQueryAPI = async (token, query_id) => {
    try {
        const response = await axios.delete(`${APP_URL}/api/v1/queries/${query_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting query:', error);
        throw error;
    }
};
