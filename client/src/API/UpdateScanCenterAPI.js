import APP_URL from "./config";
import axios from "axios";

function UpdateScanCenterAPI(token, scanCenterData) {
    return axios.put(`${APP_URL}/api/v1/update-scan-center`, scanCenterData, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(response => response.data);
}

export default UpdateScanCenterAPI;
