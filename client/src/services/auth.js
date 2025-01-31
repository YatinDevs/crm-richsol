import api from "./api";
import useAuthStore from "../store/authStore";

export const signUp = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    const { accessToken, userDetails } = response.data;
    useAuthStore.getState().login(userDetails, accessToken);
    return response.data;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const logIn = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { accessToken, userDetails } = response.data;
    useAuthStore.getState().login(userDetails, accessToken);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh-token");
    return response.data.accessToken; // Only return the token
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await api.post("/auth/logout");
    useAuthStore.getState().logout();
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
