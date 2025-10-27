import axios from 'axios';
import APP_URL from './config';
function CreateCourseAPI(token, CourseData){
    const result = axios.post(APP_URL+'/api/v1/create-course',  CourseData, {
        headers : {
            'Authorization': `Bearer ${token}`
        }
    });
    return result;
}
export default CreateCourseAPI;