import axios from 'axios';
import APP_URL from './config';

function DeleteCourseAPI(token, course_id)
{
    const result = axios.delete(APP_URL+`/api/v1/delete-course/${course_id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    //console.log(course_id)
    return result;
}
export default DeleteCourseAPI;