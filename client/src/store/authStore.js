import { create } from "zustand";

import {
  logIn as apiLogIn,
  signUp as apiSignUp,
  logOut as apiLogOut,
  refreshTokenAction as apiRefreshTokenAction,
} from "../services/authService";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  signUp: async (userData) => {
    try {
      const response = await apiSignUp(userData);
      console.log(response);
      set({
        user: response.data.userDetails,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isAuthenticated: true,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  logIn: async (userData) => {
    try {
      const response = await apiLogIn(userData);
      set({
        user: response.data.userDetails,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  logOut: async () => {
    try {
      const response = await apiLogOut(userData);
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      localStorage.removeItem("accessToken");
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
      set({ accessToken: response.data.accessToken });
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
      throw error;
    }
  },
}));

export default useAuthStore;

// initialize: async () => {
//   const token = localStorage.getItem("authToken");
//   if (token) {
//     try {
//       const isValid = await apiValidateToken(token);
//       if (isValid) {
//         const user = JSON.parse(localStorage.getItem("userDetails"));
//         set({ user, isAuthenticated: true });
//       } else {
//         localStorage.removeItem("authToken");
//         localStorage.removeItem("userDetails");
//       }
//     } catch (error) {
//       console.error("Error validating token:", error);
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("userDetails");
//     }
//   } else {
//     set({ user: null, isAuthenticated: false });
//   }
// },
