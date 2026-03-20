import { api } from './auth.service';

export interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

export const productService = {
  // ← Get all products
  async getAllProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  },

  // ← Get single product by ID
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};