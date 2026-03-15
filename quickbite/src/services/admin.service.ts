import { api } from "./auth.service";

export const adminService = {
  // Users - Get All Users (Admin Only)
  async getAllUsers() {
    const response = await api.get("/users/all");
    return response.data;
  },

  // Users - Change Role (Admin Only)
  async changeRole(userId: string, role: string) {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Users - Delete User (Admin Only)
  async deleteUser(userId: string) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};
