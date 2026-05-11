import axios from "axios";
import APP_URL from "./config";

function getActivityLastScores() {
    return axios.get(`${APP_URL}/api/v1/activity-last-scores`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching activity last scores:', error);
        throw error;
    });
}

export default getActivityLastScores;
