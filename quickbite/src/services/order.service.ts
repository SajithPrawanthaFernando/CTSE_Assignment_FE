import { api } from './auth.service';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export const orderService = {
  // ← Create order directly from items
  async createOrder(items: CartItem[], shippingAddress?: string) {
    const response = await api.post('/orders', {
      items: items.map((item) => ({
        productId: item.id, // ← cart item id = productId
        quantity: item.quantity,
      })),
      shippingAddress,
    });
    return response.data;
  },

  // ← Get my orders
  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // ← Get order by ID
  async getOrderById(id: string) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // ← Delete order
  async deleteOrder(id: string) {
    await api.delete(`/orders/${id}`);
  },
};