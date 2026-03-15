import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = "http://localhost:3009";

// 1. Create the instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 2. Add the interceptor logic to that instance
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Get token from Zustand
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Define the service using the intercepted 'api' instance
export const authService = {
  async login(credentials: any) {
    const response = await api.post(`/auth/login`, credentials);
    document.cookie = "is_logged_in=true; path=/; max-age=86400";
    return response.data;
  },
  async register(userData: any) {
    const response = await api.post(`/users`, userData);
    return response.data;
  },
  async logout() {
    try {
      await api.post(`/auth/logout`);
    } finally {
      document.cookie =
        "is_logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  },
  async updateProfile(userId: string, updateData: any) {
    const response = await api.put(`/users/${userId}`, updateData);
    return response.data;
  },
};
