import axios from "axios";
import APP_URL from "./config";

function UpdateVolumeAPI(token, data) {
    return axios.put(`${APP_URL}/api/v1/update-volume`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => response.data)
    .catch(error => {
        console.error('Error updating volume:', error);
        throw error;
    });
}

export default UpdateVolumeAPI;
