// src/admin/pages/Signup.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail, Shield, KeyRound, User } from "lucide-react";

type Step = "form" | "otp";

const Signup = () => {
  const navigate = useNavigate();

  // ── Form state ───────────────────────────────────────────────
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Shared input style (matches Login.tsx exactly) ───────────
  const inputCls =
    "w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#C89A3D]/60 transition-all duration-200";

  // ── Step 1: Submit signup form ───────────────────────────────
  async function handleSignup() {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ───────────────────────────────────────
  async function handleVerifyOTP() {
    if (!otpCode || otpCode.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, otpCode }),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "OTP verification failed");
        return;
      }
      // success → go to login
      navigate("/admin/login?signup=success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ───────────────────────────────────────────────
  async function handleResendOTP() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to resend OTP");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0c1117] flex items-center justify-center px-4">
      {/* Background effects — matches Login.tsx */}
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
          {/* ── Step 1: Signup Form ── */}
          {step === "form" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg">
                  Request Admin Access
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Your request will be reviewed by the superadmin
                </p>
              </div>

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className={`${inputCls} pl-10`}
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
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
                  onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                  placeholder="Password (min. 6 characters)"
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

              {/* Error */}
              {error && <p className="text-red-400 text-xs">{error}</p>}

              {/* Submit */}
              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>

              {/* Login link */}
              <p className="text-center text-slate-500 text-xs pt-2">
                Already have access?{" "}
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-[#C89A3D] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {/* ── Step 2: OTP Verification ── */}
          {step === "otp" && (
            <div className="space-y-4">
              <div className="mb-6">
                <h2 className="text-white font-bold text-lg">
                  Verify your email
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

              {/* Resend + Back */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => {
                    setStep("form");
                    setError("");
                  }}
                  className="text-slate-500 text-xs hover:text-slate-300 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-[#C89A3D] text-xs hover:underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step indicator — matches Login.tsx */}
        <div className="flex justify-center gap-2 mt-6">
          {["form", "otp"].map((s, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                step === s ? "w-6 bg-[#C89A3D]" : "w-2 bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
