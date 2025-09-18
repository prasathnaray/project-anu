import axios from "axios";

function getChapterAPI(token, course_id) {
    const result = axios.get(`http://localhost:4004/api/v1/get-chapter?course_id=${course_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return result;
}
export default getChapterAPI;