import axios from 'axios';

const GetScanCentersAPI = async (token, page = 1, limit = 5) => {
    try {
        const response = await axios.get(
            `http://localhost:4004/api/v1/get-scan-centers`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    page,
                    limit
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching scan centers:', error);
        throw error;
    }
};

export default GetScanCentersAPI;