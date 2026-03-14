import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../components/AdminHeader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  CheckCircle2,
  AlertCircle,
  Save,
  LogOut,
  Shield,
  ShieldCheck,
  ShieldOff,
  QrCode,
  KeyRound,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminProfile {
  name: string;
  email: string;
  role: string;
  photo: string;
}

interface ContactDetails {
  phone: string;
  altPhone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium border
      ${
        type === "success"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-red-50 text-red-600 border-red-200"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
      {msg}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
function Section({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-7 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="w-6 h-px bg-[#C89A3D]" />
          <span className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold">
            {label}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const SettingsAdmin = () => {
  const { logout, admin, setAdmin } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<AdminProfile>({
    name: "Dreamers Admin",
    email: "admin@dreamerssofttech.com",
    role: "Administrator",
    photo: "",
  });

  const [contact, setContact] = useState<ContactDetails>({
    phone: "+91 98765 43210",
    altPhone: "",
    email: "hello@dreamerssofttech.com",
    address: "123, Tech Park, Ring Road",
    city: "Raipur",
    state: "Chhattisgarh",
    pincode: "492001",
  });

  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [profileDirty, setProfileDirty] = useState(false);
  const [contactDirty, setContactDirty] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // ── 2FA state ──────────────────────────────────────────────────────────────
  const [twoFAEnabled, setTwoFAEnabled] = useState<boolean>(
    admin?.twoFactorEnabled || false,
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [confirmToken, setConfirmToken] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [twoFALoading, setTwoFALoading] = useState<boolean>(false);
  const [disableConfirm, setDisableConfirm] = useState<boolean>(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/admin/login");
    } catch {
      showToast("Logout failed", "error");
    } finally {
      setLoggingOut(false);
    }
  }

  function updateProfile(key: keyof AdminProfile, val: string) {
    setProfile((p) => ({ ...p, [key]: val }));
    setProfileDirty(true);
  }

  function updateContact(key: keyof ContactDetails, val: string) {
    setContact((c) => ({ ...c, [key]: val }));
    setContactDirty(true);
  }

  function saveProfile() {
    if (!profile.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    if (!profile.email.trim()) {
      showToast("Email is required", "error");
      return;
    }
    setProfileDirty(false);
    showToast("Profile saved successfully!");
  }

  function saveContact() {
    if (!contact.phone.trim()) {
      showToast("Phone is required", "error");
      return;
    }
    if (!contact.email.trim()) {
      showToast("Contact email is required", "error");
      return;
    }
    setContactDirty(false);
    showToast("Contact details saved successfully!");
  }

  // ── 2FA: Step 1 — get QR code ──────────────────────────────────────────────
  async function handleSetup2FA() {
    setTwoFALoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/2fa/setup`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to setup 2FA", "error");
        return;
      }
      setQrCode(data.data.qrCode);
      setSecret(data.data.secret);
      setShowQR(true);
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setTwoFALoading(false);
    }
  }

  // ── 2FA: Step 2 — confirm token → enable ──────────────────────────────────
  async function handleEnable2FA() {
    if (!confirmToken || confirmToken.length !== 6) {
      showToast("Enter the 6-digit code from Google Authenticator", "error");
      return;
    }
    setTwoFALoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/2fa/enable`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: confirmToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Invalid code", "error");
        return;
      }
      setTwoFAEnabled(true);
      setShowQR(false);
      setQrCode("");
      setSecret("");
      setConfirmToken("");
      // update admin context so sidebar/header reflects change
      if (admin) setAdmin({ ...admin, twoFactorEnabled: true });
      showToast("2FA enabled successfully ✅");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setTwoFALoading(false);
    }
  }

  // ── 2FA: Disable ──────────────────────────────────────────────────────────
  async function handleDisable2FA() {
    setTwoFALoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/2fa/disable`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.message || "Failed to disable 2FA", "error");
        return;
      }
      setTwoFAEnabled(false);
      setDisableConfirm(false);
      if (admin) setAdmin({ ...admin, twoFactorEnabled: false });
      showToast("2FA disabled");
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setTwoFALoading(false);
    }
  }

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C89A3D]/60 focus:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-800";
  const labelCls =
    "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <AdminHeader
        title="Settings"
        subtitle="Manage your profile and business contact details"
      />

      <div className="flex-1 p-6 space-y-6 max-w-3xl w-full mx-auto">
        {/* ── Admin Profile ── */}
        <Section label="Account" title="Admin Profile">
          <div className="flex items-center gap-5 mb-7 pb-6 border-b border-gray-100">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-[#C89A3D]/10 border-2 border-[#C89A3D]/20 flex items-center justify-center overflow-hidden">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-[#C89A3D]">
                    {profile.name?.[0]?.toUpperCase() || "A"}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-[#C89A3D] rounded-xl flex items-center justify-center shadow-md">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <label className={labelCls}>Profile Photo URL</label>
              <input
                value={profile.photo}
                onChange={(e) => updateProfile("photo", e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className={inputCls}
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                Paste any image URL — avatar will update instantly above.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Full Name *
                </span>
              </label>
              <input
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                placeholder="Your name"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Role
                </span>
              </label>
              <input
                value={profile.role}
                onChange={(e) => updateProfile("role", e.target.value)}
                placeholder="e.g. Administrator"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address *
                </span>
              </label>
              <input
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                placeholder="admin@dreamerssofttech.com"
                className={inputCls}
                type="email"
              />
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={saveProfile}
              disabled={!profileDirty}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${profileDirty ? "bg-[#C89A3D] hover:bg-[#b78930] text-white shadow hover:shadow-lg hover:shadow-[#C89A3D]/25" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </Section>

        {/* ── Contact Details ── */}
        <Section label="Business" title="Contact Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Primary Phone *
                </span>
              </label>
              <input
                value={contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="+91 98765 43210"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Alternate Phone
                </span>
              </label>
              <input
                value={contact.altPhone}
                onChange={(e) => updateContact("altPhone", e.target.value)}
                placeholder="+91 00000 00000"
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Contact Email *
                </span>
              </label>
              <input
                value={contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="hello@dreamerssofttech.com"
                className={inputCls}
                type="email"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Street Address
                </span>
              </label>
              <input
                value={contact.address}
                onChange={(e) => updateContact("address", e.target.value)}
                placeholder="123, Tech Park, Ring Road"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>City</label>
              <input
                value={contact.city}
                onChange={(e) => updateContact("city", e.target.value)}
                placeholder="Raipur"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>State</label>
              <input
                value={contact.state}
                onChange={(e) => updateContact("state", e.target.value)}
                placeholder="Chhattisgarh"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Pincode</label>
              <input
                value={contact.pincode}
                onChange={(e) => updateContact("pincode", e.target.value)}
                placeholder="492001"
                className={inputCls}
                maxLength={6}
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-[#C89A3D]/5 border border-[#C89A3D]/15 rounded-2xl">
            <p className="text-[10px] uppercase tracking-widest text-[#C89A3D] font-semibold mb-3">
              Preview
            </p>
            <div className="space-y-1.5">
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#C89A3D]" />
                {contact.phone || "—"}
                {contact.altPhone && ` · ${contact.altPhone}`}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <Mail className="w-3 h-3 text-[#C89A3D]" />
                {contact.email || "—"}
              </p>
              <p className="text-xs text-gray-600 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-[#C89A3D]" />
                {[contact.address, contact.city, contact.state, contact.pincode]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={saveContact}
              disabled={!contactDirty}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${contactDirty ? "bg-[#C89A3D] hover:bg-[#b78930] text-white shadow hover:shadow-lg hover:shadow-[#C89A3D]/25" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              <Save className="w-4 h-4" /> Save Contact Details
            </button>
          </div>
        </Section>

        {/* ── 2FA Section ── */}
        <Section label="Security" title="Two-Factor Authentication">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${twoFAEnabled ? "bg-green-50" : "bg-gray-50"}`}
              >
                {twoFAEnabled ? (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <Shield className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {twoFAEnabled ? "2FA is Enabled" : "2FA is Disabled"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {twoFAEnabled
                    ? "Google Authenticator is required at every login"
                    : "Add an extra layer of security to your account"}
                </p>
              </div>
            </div>

            {/* Action button */}
            {twoFAEnabled ? (
              !disableConfirm ? (
                <button
                  onClick={() => setDisableConfirm(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all duration-200"
                >
                  <ShieldOff className="w-4 h-4" /> Disable 2FA
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-xs text-gray-400">Are you sure?</p>
                  <button
                    onClick={() => setDisableConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDisable2FA}
                    disabled={twoFALoading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-60"
                  >
                    <ShieldOff className="w-3.5 h-3.5" />
                    {twoFALoading ? "Disabling..." : "Yes, Disable"}
                  </button>
                </div>
              )
            ) : (
              !showQR && (
                <button
                  onClick={handleSetup2FA}
                  disabled={twoFALoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white text-sm font-semibold shadow hover:shadow-lg hover:shadow-[#C89A3D]/25 transition-all duration-200 disabled:opacity-60"
                >
                  <QrCode className="w-4 h-4" />
                  {twoFALoading ? "Loading..." : "Enable 2FA"}
                </button>
              )
            )}
          </div>

          {/* QR Setup flow */}
          {showQR && !twoFAEnabled && (
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-5">
              {/* Steps */}
              <div className="flex items-center gap-3">
                {["Scan QR Code", "Enter Code", "Confirm"].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#C89A3D]/10 border border-[#C89A3D]/30 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#C89A3D]">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {s}
                    </span>
                    {i < 2 && <div className="w-6 h-px bg-gray-200" />}
                  </div>
                ))}
              </div>

              {/* QR Code */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 p-3 bg-white border-2 border-[#C89A3D]/20 rounded-2xl shadow-sm">
                  <img src={qrCode} alt="2FA QR Code" className="w-36 h-36" />
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Open <strong>Google Authenticator</strong> on your phone,
                    tap <strong>+</strong> and scan this QR code.
                  </p>
                  {/* Backup secret */}
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">
                      Backup Key
                    </p>
                    <p className="text-xs font-mono text-gray-600 break-all">
                      {secret}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    Save the backup key somewhere safe in case you lose your
                    phone.
                  </p>
                </div>
              </div>

              {/* Confirm token input */}
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3 h-3" /> Enter 6-digit code to
                    confirm
                  </span>
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={confirmToken}
                    onChange={(e) => setConfirmToken(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEnable2FA()}
                    placeholder="000000"
                    maxLength={6}
                    className={`${inputCls} tracking-widest text-center text-lg max-w-[160px]`}
                  />
                  <button
                    onClick={handleEnable2FA}
                    disabled={twoFALoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C89A3D] hover:bg-[#b78930] text-white text-sm font-semibold shadow transition-all duration-200 disabled:opacity-60"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {twoFALoading ? "Verifying..." : "Confirm & Enable"}
                  </button>
                  <button
                    onClick={() => {
                      setShowQR(false);
                      setQrCode("");
                      setSecret("");
                      setConfirmToken("");
                    }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ── Logout Section ── */}
        <Section label="Session" title="Sign Out">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Signed in as{" "}
                <span className="font-semibold text-gray-800">
                  {admin?.email}
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">
                Role: {admin?.role}
              </p>
            </div>

            {!logoutConfirm ? (
              <button
                onClick={() => setLogoutConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <p className="text-xs text-gray-400">Are you sure?</p>
                <button
                  onClick={() => setLogoutConfirm(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {loggingOut ? "Signing out..." : "Yes, Sign Out"}
                </button>
              </div>
            )}
          </div>
        </Section>

        <div className="h-4" />
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
};

export default SettingsAdmin;
