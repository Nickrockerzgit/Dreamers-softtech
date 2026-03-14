import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const dashboardApi = {
  // Fetch overall dashboard statistics (admin)
  getStats: () => api.get("/api/dashboard/stats"),
};

export const statsApi = {
  // Public — home page
  getPublicStats: () => api.get("/api/stats"),
  syncProjects: () => api.patch("/api/stats/sync-projects"),
  // Protected — admin only
  updateStats: (data: {
    projectsCompleted?: number;
    happyClients?: number;
    yearsExperience?: number;
    satisfactionRate?: number;
    teamMembersCount?: number;
    technologiesCount?: number;
  }) => api.put("/api/stats", data),
};
