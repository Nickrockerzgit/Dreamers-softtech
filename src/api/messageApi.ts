import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const messageApi = {
  // Public: Send a message from contact form
  createMessage: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) => 
    api.post("/api/messages", data),

  // Public: Send a quote request
  createQuote: (data: { 
    fullName: string; 
    email: string; 
    phone?: string; 
    company?: string; 
    projectType: string; 
    budgetRange: string; 
    timeline: string; 
    description: string;
    type: "quote";
  }) => api.post("/api/messages", data),

  // Admin: Get all messages
  getMessages: () => api.get("/api/messages"),

  // Admin: Update status (read/unread)
  updateStatus: (id: string, status: "read" | "unread") => 
    api.put(`/api/messages/${id}/status`, { status }),

  // Admin: Delete a message
  deleteMessage: (id: string) => api.delete(`/api/messages/${id}`),

  // Admin: Get unread count
  getUnreadCount: () => api.get("/api/messages/unread-count"),
};
