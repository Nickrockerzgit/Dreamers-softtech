import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, KeyRound } from "lucide-react";
import { authApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAdmin, setLoginStep, loginStep } = useAuth();

  const [searchParams] = useSearchParams();
  const signupSuccess = searchParams.get("signup") === "success";

  // ── Form state ───────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [token2FA, setToken2FA] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Shared input style ───────────────────────────────────────
  const inputCls =
    "w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 transition-all duration-200";

  // ── Step 1: Login ────────────────────────────────────────────
  async function handleLogin() {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await authApi.login(email, password);
      // ── 2FA BYPASS: Check if 2FA is already enabled on backend ──
      if (res.data.data.twoFactorEnabled) {
        setLoginStep("2fa");
      } else {
        setLoginStep("otp");
      }
      // ────────────────────────────────────────────────────────────
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────
  async function handleVerifyOTP() {
    if (!otpCode) {
      setError("Please enter OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await authApi.verifyOTP(otpCode);
      if (res.data.requires2FA) {
        setLoginStep("2fa");
      } else {
        const me = await authApi.getMe();
        setAdmin(me.data.data);
        setLoginStep("done");
        navigate("/admin");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 3: Verify 2FA ───────────────────────────────────────
  async function handleVerify2FA() {
    if (!token2FA) {
      setError("Please enter authenticator code");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await authApi.verify2FA(token2FA);
      const me = await authApi.getMe();
      setAdmin(me.data.data);
      setLoginStep("done");
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid authenticator code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1117] flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#C89A3D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] bg-[#C89A3D]/06 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C89A3D]/10 border border-[#C89A3D]/20 mb-4">
            <Shield className="w-7 h-7 text-[#C89A3D]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Dreamers Softtech</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl">
          {signupSuccess && (
            <div className="mb-4 px-4 py-3 bg-[#C89A3D]/10 border border-[#C89A3D]/20 rounded-xl text-[#C89A3D] text-xs">
              ✅ Email verified! Your request is pending superadmin approval.
            </div>
          )}
          {/* ── Step 1: Credentials ── */}
          {loginStep === "credentials" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg">Sign In</h2>
                <p className="text-slate-500 text-xs mt-1">
                  Enter your admin credentials
                </p>
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Admin email"
                  className={`${inputCls} pl-10`}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Password"
                  className={`${inputCls} pl-10 pr-10`}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-center text-slate-500 text-xs pt-2">
                Don't have access?{" "}
                <button
                  onClick={() => navigate("/admin/signup")}
                  className="text-[#C89A3D] hover:underline"
                >
                  Request Admin Access
                </button>
              </p>

              {/* Error */}
              {error && <p className="text-red-400 text-xs">{error}</p>}

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Signing in..." : "Continue"}
              </button>
            </div>
          )}

          {/* ── Step 2: OTP ── */}
          {loginStep === "otp" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg">
                  Check your email
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  OTP sent to <span className="text-[#C89A3D]">{email}</span>
                </p>
                <p className="text-slate-600 text-xs mt-0.5">
                  Expires in 5 minutes
                </p>
              </div>

              {/* OTP Input */}
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerifyOTP()}
                  placeholder="Enter 6 digit OTP"
                  maxLength={6}
                  className={`${inputCls} pl-10 tracking-widest text-center text-lg`}
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={() => {
                  setLoginStep("credentials");
                  setError("");
                }}
                className="w-full py-2 text-slate-500 text-xs hover:text-slate-300 transition-colors"
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* ── Step 3: 2FA ── */}
          {loginStep === "2fa" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg">
                  Two Factor Auth
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Open Google Authenticator and enter the 6 digit code
                </p>
              </div>

              {/* 2FA Input */}
              <div className="relative">
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={token2FA}
                  onChange={(e) => setToken2FA(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify2FA()}
                  placeholder="Enter 6 digit code"
                  maxLength={6}
                  className={`${inputCls} pl-10 tracking-widest text-center text-lg`}
                />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                onClick={handleVerify2FA}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>

              <button
                onClick={() => {
                  setLoginStep("credentials");
                  setError("");
                }}
                className="w-full py-2 text-slate-500 text-xs hover:text-slate-300 transition-colors"
              >
                ← Back to login
              </button>
            </div>
          )}
        </div>

        {/* Step indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {["credentials", "otp", "2fa"].map((step, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                loginStep === step ? "w-6 bg-[#C89A3D]" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
