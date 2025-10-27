import axios from "axios";
import APP_URL from "./config";
function ForgotPasswordAPI(userData){
    const result = axios.post(APP_URL+'/api/v1/forgot-password', userData);
    return result;
}
export default ForgotPasswordAPI;