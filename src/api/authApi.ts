import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ← sends cookies with every request ✅
});

export const authApi = {
  // ── LOGIN ────────────────────────────────────────────────────
  // Step 1 → email + password → sends OTP to email
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  // ── VERIFY OTP ───────────────────────────────────────────────
  // Step 2 → verify email OTP
  verifyOTP: (otpCode: string) => api.post("/api/auth/verify-otp", { otpCode }),

  // ── VERIFY 2FA ───────────────────────────────────────────────
  // Step 3 → verify Google Authenticator code (only if 2FA on)
  verify2FA: (token: string) => api.post("/api/auth/verify-2fa", { token }),

  // ── LOGOUT ───────────────────────────────────────────────────
  logout: () => api.post("/api/auth/logout"),

  // ── GET ME ───────────────────────────────────────────────────
  // checks if session is valid → returns current admin info
  getMe: () => api.get("/api/auth/me"),

  // ── 2FA SETUP ────────────────────────────────────────────────
  setup2FA: () => api.post("/api/auth/2fa/setup"),

  enable2FA: (token: string) => api.post("/api/auth/2fa/enable", { token }),

  disable2FA: () => api.post("/api/auth/2fa/disable"),

  // ── ADMIN MANAGEMENT ─────────────────────────────────────────
  addAdmin: (email: string, password: string, role: string) =>
    api.post("/api/auth/add-admin", { email, password, role }),

  getAllAdmins: () => api.get("/api/auth/admins"),

  deleteAdmin: (id: string) => api.delete(`/api/auth/admins/${id}`),
};
