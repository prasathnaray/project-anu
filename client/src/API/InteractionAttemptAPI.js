import axios from "axios";
import APP_URL from "./config";

function getInteractionsAttemptStats() {
    return axios.get(`${APP_URL}/api/v1/interactions-attempt-stats`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching interactions attempt stats:', error);
        throw error;
    });
}

export default getInteractionsAttemptStats;