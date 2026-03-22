import { api } from './auth.service';

export const cartService = {
  //    Get my cart from backend
  async getMyCart() {
    const response = await api.get('/cart/my-cart');
    return response.data;
  },

  //    Add item to backend cart
  async addItem(productId: string, quantity: number) {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  //    Update item quantity
  async updateItem(productId: string, quantity: number) {
    const response = await api.patch(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  //    Remove item
  async removeItem(productId: string) {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  //    Clear cart
  async clearCart() {
    const response = await api.delete('/cart');
    return response.data;
  },

  //    Checkout
  async checkout(shippingAddress?: string) {
    const response = await api.post('/cart/checkout', { shippingAddress });
    return response.data;
  },
};