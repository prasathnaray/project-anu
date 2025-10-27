import axios from "axios";
import APP_URL from "./config";

function getChapterAPI(token, course_id) {
    const result = axios.get(APP_URL+`/api/v1/get-chapter?course_id=${course_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return result;
}
export default getChapterAPI;