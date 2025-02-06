import axiosInstance from "./api";
import useAuthStore from "../store/authStore";

export const signUp = async (userData) => {
  try {
    const response = await axiosInstance.post("api/v1/auth/signup", userData);

    return response;
  } catch (error) {
    console.error("Error signing up:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to sign up");
  }
};

export const logIn = async (userData) => {
  try {
    console.log(userData);
    const response = await axiosInstance.post("api/v1/auth/login", userData);
    // const { accessToken, userDetails } = response.data;
    console.log(response, `inside AuthServices`);
    return response;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to log in");
  }
};

export const logOut = async () => {
  try {
    const response = await axiosInstance.post("api/v1/auth/logout");

    // Remove access token from localStorage
    localStorage.removeItem("accessToken");

    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const refreshTokenAction = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh-token", {
      refreshToken,
    });
    return response.data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const { accessToken } = useAuthStore.getState();
//     if (accessToken) {
//       config.headers["Authorization"] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newAccessToken = await useAuthStore.getState().refreshToken();
//         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         console.error("Failed to refresh token:", refreshError);
//         useAuthStore.getState().logout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
