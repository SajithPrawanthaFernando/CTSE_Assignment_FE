import { useAuthStore } from "./useAuthStore";
import { authService } from "@/services/auth.service";

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const login = async (credentials: any) => {
    const data = await authService.login(credentials);

    if (data && data.user && data.token) {
      // Save both pieces of data from the API response
      setAuth(data.user, data.token);
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearAuth();
      // Ensure the key matches your persist config name
      localStorage.removeItem("gusto-auth-storage");
    }
  };

  return { user, isAuthenticated, login, logout };
};
