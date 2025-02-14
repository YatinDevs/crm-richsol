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
      const response = await axiosInstance.post("/auth/login", formData);
      await useAuthStore.getState().checkAuth();
      return response.data;
    } catch (error) {
      // console.error("Login failed:", error);
      return error;
    }
  },

  signup: async (formData) => {
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      await useAuthStore.getState().checkAuth();
      return response.data;
    } catch (error) {
      console.error("Signup failed:", error);
      return error;
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log(res);
      set({ employee: res.data.employee, isAuthenticated: true });
      return res.data;
    } catch (error) {
      set({ employee: null, isAuthenticated: false });
      return error;
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
