import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { Product } from "@/types";

const API_URL = "/api";

// 1. Create the instance
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 2. Add the interceptor logic to that instance
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 3. Auth service
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

// 4. Product service
const mapProduct = (data: any): Product => ({
  ...data,
  id: data._id ?? data.id,
});

export const adminProductService = {
  // GET /products — public
  async getProducts(): Promise<Product[]> {
    try {
      const response = await api.get("/products");
      const items = response.data?.data ?? response.data;
      return Array.isArray(items) ? items.map(mapProduct) : [];
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[getProducts] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },

  // GET /products/:id — public
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get(`/products/${id}`);
      return mapProduct(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[getProductById] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },

  // GET /products/bulk?ids=id1,id2 — public
  async getBulkProducts(ids: string[]): Promise<Product[]> {
    if (!ids.length) return [];
    try {
      const response = await api.get("/products/bulk", {
        params: { ids: ids.join(",") },
      });
      const items = response.data?.data ?? response.data;
      return Array.isArray(items) ? items.map(mapProduct) : [];
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[getBulkProducts] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },

  // POST /products — requires JWT
  async createProduct(productData: Omit<Product, "id">): Promise<Product> {
    try {
      const response = await api.post("/products", productData);
      return mapProduct(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[createProduct] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },

  // PATCH /products/:id — requires JWT
  async updateProduct(
    id: string,
    productData: Partial<Omit<Product, "id">>,
  ): Promise<Product> {
    try {
      const response = await api.patch(`/products/${id}`, productData);
      return mapProduct(response.data);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[updateProduct] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },

  // DELETE /products/:id — requires JWT
  async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`/products/${id}`);
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[deleteProduct] ${status ?? "NETWORK"}: ${message}`);
      throw error;
    }
  },
};
