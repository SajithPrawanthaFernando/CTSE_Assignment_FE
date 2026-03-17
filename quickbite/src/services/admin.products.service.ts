// src/services/admin.products.service.ts
import { api } from "./auth.service";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types";

const mapProduct = (data: any): Product => ({
  ...data,
  id: data._id ?? data.id,
});

export const adminProductService = {
  async getProducts(): Promise<Product[]> {
    const response = await api.get(`/products`);
    const items = response.data?.data ?? response.data;
    return Array.isArray(items) ? items.map(mapProduct) : [];
  },

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return mapProduct(response.data);
  },

  async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    const token = useAuthStore.getState().token;
    console.log('[createProduct] token:', token ? 'EXISTS' : 'NULL');
    const response = await api.post(`/products`, productData);
    return mapProduct(response.data);
  },

  async updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id">>
  ): Promise<Product> {
    const token = useAuthStore.getState().token;
    console.log('[updateProduct] token:', token ? 'EXISTS' : 'NULL');
    const response = await api.patch(`/products/${id}`, productData);
    return mapProduct(response.data);
  },

  async deleteProduct(id: string): Promise<void> {
    const token = useAuthStore.getState().token;
    console.log('[deleteProduct] token:', token ? 'EXISTS' : 'NULL');
    await api.delete(`/products/${id}`);
  },

  async getBulkProducts(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    const response = await api.get(`/products/bulk`, {
      params: { ids: ids.join(",") },
    });
    const items = response.data?.data ?? response.data;
    return Array.isArray(items) ? items.map(mapProduct) : [];
  },
};