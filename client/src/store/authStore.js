import { create } from "zustand";
import Cookies from "js-cookie";
import {
  logIn as apiLogIn,
  signUp as apiSignUp,
  logOut as apiLogOut,
  refreshTokenAction as apiRefreshTokenAction,
} from "../services/authService";

const useAuthStore = create((set) => ({
  employee: JSON.parse(localStorage.getItem("employeeDetails")) || null,
  accessToken: !!localStorage.getItem("accessToken") || null,
  refreshToken: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  signUp: async (userData) => {
    try {
      const response = await apiSignUp(userData);
      console.log(response, `inside AuthStore`);
      set({
        employee: response.data.employeeDetails,
        accessToken: response.data.accessToken,
        // refreshToken: response.data.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  logIn: async (userData) => {
    try {
      const response = await apiLogIn(userData);
      console.log(response, `inside AuthStore`);
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      const employeeDetails = response.data.employeeDetails;
      console.log(employeeDetails);
      // Store access token in localStorage and refresh token in cookies
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("employeeDetails", JSON.stringify(employeeDetails));

      Cookies.set("refreshToken", refreshToken, { expires: 7 }); // Set refresh token in cookies (expires in 7 days)

      // Set the state for authenticated user and tokens
      set({
        employee: employeeDetails,
        accessToken: accessToken,
        refreshToken: refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logOut: async () => {
    try {
      const response = await apiLogOut();
      console.log(response);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("employeeDetails");
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  },
  refreshTokenAction: async () => {
    try {
      const { refreshToken } = get();
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await apiRefreshTokenAction(refreshToken);
      console.log(response);

      set({ accessToken: response.data.accessToken, isAuthenticated: true });
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("accessToken");
      Cookies.remove("refreshToken"); // Remove refresh token from cookie

      throw error;
    }
  },

  initialize: async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = Cookies.get("refreshToken"); // Get refresh token from cookies

    if (accessToken) {
      set({ accessToken, isAuthenticated: true });
    } else if (refreshToken) {
      try {
        // If there's no access token, use the refresh token to get a new access token
        const newAccessToken = await get().refreshTokenAction();
        set({ accessToken: newAccessToken, isAuthenticated: true });
      } catch (error) {
        set({ isAuthenticated: false });
      }
    } else {
      set({ isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
