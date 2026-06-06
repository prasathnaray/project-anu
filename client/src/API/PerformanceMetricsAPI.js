import axios from "axios";
import APP_URL from "./config";

function getPerformanceMetrics() {
    return axios.get(`${APP_URL}/api/v1/performance-metrics`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching performance metrics:', error);
        throw error;
    });
}

export default getPerformanceMetrics;
