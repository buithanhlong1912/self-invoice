import axios from "axios";
import { Product, Brand, Invoice, CreateInvoiceRequest } from "@/types";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_API_URL || "/api"
    : "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products API
export const productsApi = {
  getAll: () => api.get<Product[]>("/products"),
  getById: (id: string) => api.get<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>("/products", data),
  update: (id: string, data: Partial<Product>) =>
    api.put<Product>(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Brands API
export const brandsApi = {
  getAll: () => api.get<Brand[]>("/brands"),
  getById: (id: string) => api.get<Brand>(`/brands/${id}`),
  create: (data: Partial<Brand>) => api.post<Brand>("/brands", data),
  update: (id: string, data: Partial<Brand>) =>
    api.put<Brand>(`/brands/${id}`, data),
  delete: (id: string) => api.delete(`/brands/${id}`),
};

// Invoices API
export const invoicesApi = {
  getAll: () => api.get<Invoice[]>("/invoices"),
  getById: (id: string) => api.get<Invoice>(`/invoices/${id}`),
  create: (data: CreateInvoiceRequest) => api.post<Invoice>("/invoices", data),
  downloadPdf: (id: string) =>
    api.get(`/invoices/${id}/pdf`, {
      responseType: "blob",
    }),
};

export default api;
