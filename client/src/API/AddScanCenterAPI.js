import React from "react";
import APP_URL from "./config";
import axios from "axios";
function AddScanCenterAPI(token, ScanCenterData){
    const result = axios.post(APP_URL+'/api/v1/create-scan-center', JSON.stringify(ScanCenterData), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default AddScanCenterAPI;