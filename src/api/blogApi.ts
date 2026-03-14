import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ── BLOG APIs ──────────────────────────────────────────────────
export const blogApi = {
  getAll: () => api.get("/api/blogs"),

  getById: (id: string) => api.get(`/api/blogs/${id}`),

  getBySlug: (slug: string) => api.get(`/api/blogs/slug/${slug}`),

  create: (data: object) => api.post("/api/blogs", data),

  update: (id: string, data: object) => api.put(`/api/blogs/${id}`, data),

  delete: (id: string) => api.delete(`/api/blogs/${id}`),
};
