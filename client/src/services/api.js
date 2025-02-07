import axios from "axios";
import Cookies from "js-cookie"; // For reading cookies
import useAuthStore from "../store/authStore";
// const API_BASE_URL = "http://192.168.0.241:8098/";
const API_BASE_URL = "http://localhost:8098/";

// const API_BASE_URL = ":8088/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// Request Interceptor to attach the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If the access token is expired (401 error) and we haven't tried refreshing yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // ✅ Extract actions from Zustand store
      const { refreshTokenAction, logOut } = useAuthStore();
      try {
        const newAccessToken = await refreshTokenAction();
        if (!newAccessToken) throw new Error("No new access token received");

        // ✅ Store new token in Cookies
        Cookies.set("accessToken", newAccessToken, {
          httpOnly: false, // 🔸 Frontend needs access
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          expires: 1 / 24, // 1 hour (fraction of a day)
        });

        // ✅ Attach new token and retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        logOut(); // ✅ Ensure user logs out only once
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
