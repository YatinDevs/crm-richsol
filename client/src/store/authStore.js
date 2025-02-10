import { create } from "zustand";
import Cookies from "js-cookie";
import {
  logIn as apiLogIn,
  signUp as apiSignUp,
  logOut as apiLogOut,
  refreshTokenAction as apiRefreshTokenAction,
} from "../services/authService";
import axiosInstance from "../services/api";

const useAuthStore = create((set) => ({
  employee: null,
  isAuthenticated: false,

  login: async (formData) => {
    try {
      await axiosInstance.post("/auth/login", formData);
      await useAuthStore.getState().checkAuth();
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  signup: async (formData) => {
    try {
      await axiosInstance.post("/auth/signup", formData);
      await useAuthStore.getState().checkAuth();
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      return false;
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log(res);
      set({ employee: res.data.employee, isAuthenticated: true });
    } catch (error) {
      set({ employee: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ employee: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
}));

export default useAuthStore;
