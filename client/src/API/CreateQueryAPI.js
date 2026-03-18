import axios from 'axios';
import APP_URL from './config';

export const CreateQueryAPI = async (token, queryData) => {
    try {
        const response = await axios.post(`${APP_URL}/api/v1/queries`, queryData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating query:', error);
        throw error;
    }
};
