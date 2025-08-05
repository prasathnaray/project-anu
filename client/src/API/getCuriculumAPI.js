import React from "react";
import axios from "axios";
import APP_URL from "./config";

function GetCuriculumAPI(token){
    const result = axios.get(APP_URL+'/api/v1/get-curiculum', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default GetCuriculumAPI;