import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const proposalApi = {
  // Public: Create a proposal (from web quote form)
  create: (data: any) => api.post("/api/proposals", data),

  // Public: Verify a magic token
  verifyToken: (token: string) => api.get(`/api/proposals/verify/${token}`),

  // Public: Confirm a proposal
  confirm: (token: string) => api.post(`/api/proposals/confirm/${token}`),

  // Public: Reject a proposal
  reject: (token: string) => api.post(`/api/proposals/reject/${token}`),

  // Admin: Get all proposals
  getAll: () => api.get("/api/proposals"),

  // Admin: Update status
  updateStatus: (id: string, status: string) => 
    api.put(`/api/proposals/${id}/status`, { status }),

  // Admin: Delete a proposal
  delete: (id: string) => api.delete(`/api/proposals/${id}`),
};
