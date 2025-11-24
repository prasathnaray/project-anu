import axios from 'axios';
import APP_URL from './config';
function CreateLearningModuleAPI(token, moduleData){
    const result = axios.post(APP_URL+'/api/v1/create-learning-module', moduleData, {
        headers: 
        {   
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    return result;
}
export default CreateLearningModuleAPI;