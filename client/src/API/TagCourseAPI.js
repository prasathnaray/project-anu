import axios from 'axios';
import APP_URL from './config';

function TagCourseAPI(token, tagCourseForm){
    const result = axios.post(APP_URL+'/api/v1/tag-course',  tagCourseForm, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return result;
}
export default TagCourseAPI;