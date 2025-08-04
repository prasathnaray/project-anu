import React from "react";
import APP_URL from "./config";
function AddCuriculumAPI(token, curiculumData){
    const result = axios.post(APP_URL+'/api/v1/create-curiculum',curiculumData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default AddCuriculumAPI;