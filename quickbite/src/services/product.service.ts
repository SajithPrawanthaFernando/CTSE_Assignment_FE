import axios from "axios";
import { Product } from "@/types";

// Use Next.js API proxy to avoid CORS issues
const API_URL = "/api";

// Create an axios instance for product API
export const productApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Product service
export const productService = {
  async getProducts(): Promise<Product[]> {
    const response = await productApi.get(`/products`);
    return response.data;
  },
  async getProductById(id: string): Promise<Product> {
    const response = await productApi.get(`/products/${id}`);
    return response.data;
  },
  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await productApi.get(`/products?category=${category}`);
    return response.data;
  },
};
