import axios from "axios";
import APP_URL from "./config";
import clearLocalSession from '../Auth/clearLocalSession';
const api = axios.create({
  baseURL: APP_URL,
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (localStorage.getItem("isVr") === "true") {
    config.headers["x-device-type"] = "VR";
  }
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ([401, 403].includes(error.response?.status) && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${APP_URL}/api/v1/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("user_token", newToken);
        if (refreshRes.data.isVr !== undefined) {
          localStorage.setItem("isVr", String(refreshRes.data.isVr));
        }
        if (refreshRes.data.device) {
          localStorage.setItem("device", refreshRes.data.device);
        }
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        if (localStorage.getItem("isVr") === "true") {
          originalRequest.headers["x-device-type"] = "VR";
        }
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr);
        clearLocalSession();
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);
export default api;
