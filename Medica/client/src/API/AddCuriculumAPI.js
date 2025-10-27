import React from "react";
import APP_URL from "./config";
import axios from "axios";
function AddCuriculumAPI(token, curriculumData){
    const result = axios.post(APP_URL+'/api/v1/create-curiculum', curriculumData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default AddCuriculumAPI;