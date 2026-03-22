import { api } from "./auth.service";

export const adminService = {
  // ── Users ──────────────────────────────────────────
  async getAllUsers() {
    const response = await api.get("/users/all");
    return response.data;
  },

  async changeRole(userId: string, role: string) {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // ── Orders (Admin Only) ────────────────────────────
  //    Get ALL orders
  async getAllOrders() {
    const response = await api.get("/orders");
    return response.data;
  },

  //    Get orders by specific user
  async getOrdersByUser(userId: string) {
    const response = await api.get(`/orders/by-user/${userId}`);
    return response.data;
  },

  //    Get single order
  async getOrderById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  //    Update order status (Admin only)
  async updateOrderStatus(id: string, status: string) {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  //    Delete order (Admin only)
  async deleteOrder(id: string) {
    await api.delete(`/orders/${id}`);
  },
};