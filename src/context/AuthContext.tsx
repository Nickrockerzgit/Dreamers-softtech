import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi } from "../api/authApi";

// ── Types ─────────────────────────────────────────────────────
interface Admin {
  id: string;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

type LoginStep = "credentials" | "otp" | "2fa" | "done";

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  loginStep: LoginStep;
  setLoginStep: (step: LoginStep) => void;
  setAdmin: (admin: Admin | null) => void;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

// ── Context ───────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ──────────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginStep, setLoginStep] = useState<LoginStep>("credentials");

  // ── Check session on app load ────────────────────────────────
  // calls /api/auth/me → if session valid → sets admin
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      setIsLoading(true);
      const res = await authApi.getMe();
      setAdmin(res.data.data);
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Logout ───────────────────────────────────────────────────
  async function logout() {
    try {
      await authApi.logout();
    } catch {
      // ignore error
    } finally {
      setAdmin(null);
      setLoginStep("credentials");
    }
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        loginStep,
        setLoginStep,
        setAdmin,
        logout,
        isLoggedIn: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook ──────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
