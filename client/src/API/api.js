import axios from "axios";
import APP_URL from "./config";
const api = axios.create({
  baseURL: APP_URL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status == 401 || error.response?.status == 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${APP_URL}/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("user_token", newToken);
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        localStorage.removeItem("user_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
export default api;