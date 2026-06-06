import axios from "axios";
import APP_URL from "./config";

function getSkillCompetency() {
    return axios.get(`${APP_URL}/api/v1/skill-competency`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error fetching skill competency:', error);
        throw error;
    });
}

export default getSkillCompetency;
