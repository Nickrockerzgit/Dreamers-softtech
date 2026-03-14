import { useState, useEffect } from "react";
import {
  BarChart2,
  Users,
  Briefcase,
  Star,
  Clock,
  Code2,
  Save,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { statsApi } from "../../api/dashboardApi";

interface StatsForm {
  projectsCompleted: number;
  happyClients: number;
  yearsExperience: number;
  satisfactionRate: number;
  teamMembersCount: number;
  technologiesCount: number;
}

type ToastType = "success" | "error" | null;

const FIELDS: {
  key: keyof StatsForm;
  label: string;
  icon: React.ElementType;
  description: string;
  suffix?: string;
  color: string;
}[] = [
  {
    key: "projectsCompleted",
    label: "Projects Completed",
    icon: Briefcase,
    description: "Total number of projects delivered to clients",
    color: "from-amber-400 to-orange-500",
  },
  {
    key: "happyClients",
    label: "Happy Clients",
    icon: Users,
    description: "Number of satisfied clients we've worked with",
    color: "from-emerald-400 to-teal-500",
  },
  {
    key: "yearsExperience",
    label: "Years of Experience",
    icon: Clock,
    description: "Years the company has been in operation",
    color: "from-blue-400 to-indigo-500",
  },
  {
    key: "satisfactionRate",
    label: "Satisfaction Rate",
    icon: Star,
    description: "Client satisfaction percentage (e.g. 98 → shows as 98%)",
    suffix: "%",
    color: "from-purple-400 to-pink-500",
  },
  {
    key: "teamMembersCount",
    label: "Team Members",
    icon: Users,
    description: "Total number of team members in the company",
    color: "from-rose-400 to-red-500",
  },
  {
    key: "technologiesCount",
    label: "Technologies",
    icon: Code2,
    description: "Number of technologies / tools the team works with",
    color: "from-cyan-400 to-sky-500",
  },
];

const OverviewAdmin = () => {
  const [form, setForm] = useState<StatsForm>({
    projectsCompleted: 0,
    happyClients: 0,
    yearsExperience: 1,
    satisfactionRate: 98,
    teamMembersCount: 0,
    technologiesCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string }>({
    type: null,
    message: "",
  });

  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await statsApi.getPublicStats();
        if (res.data.success) {
          const d = res.data.data;
          setForm({
            projectsCompleted: d.projectsCompleted,
            happyClients: d.happyClients,
            yearsExperience: d.yearsExperience,
            satisfactionRate: d.satisfactionRate,
            teamMembersCount: d.teamMembersCount,
            technologiesCount: d.technologiesCount,
          });
        }
      } catch {
        showToast("error", "Failed to load current stats");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: null, message: "" }), 4000);
  };

  const handleChange = (key: keyof StatsForm, value: string) => {
    const num = parseInt(value, 10);
    setForm((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await statsApi.updateStats(form);
      if (res.data.success) {
        showToast("success", "Site stats updated successfully!");
      } else {
        showToast("error", "Update failed. Please try again.");
      }
    } catch {
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSyncProjects = async () => {
    setSyncing(true);
    try {
      const res = await statsApi.syncProjects();
      if (res.data.success) {
        setForm((prev) => ({
          ...prev,
          projectsCompleted: res.data.data.projectsCompleted,
        }));
        showToast(
          "success",
          `Synced! ${res.data.data.projectsCompleted} published projects found.`,
        );
      }
    } catch {
      showToast("error", "Failed to sync project count.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C89A3D] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">
            Loading site stats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-6 lg:p-8">
      {/* Toast */}
      {toast.type && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all duration-300 ${
            toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#C89A3D]/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-[#C89A3D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Overview</h1>
            <p className="text-gray-500 text-sm">
              Manage the statistics shown on your public home page
            </p>
          </div>
        </div>

        {/* Live preview strip */}
        <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-4">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">
            Live Preview
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {FIELDS.map(({ key, label, suffix, color }) => (
              <div key={key} className="text-center">
                <p
                  className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${color}`}
                >
                  {form[key]}
                  {suffix ?? "+"}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium leading-tight">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {FIELDS.map(
          ({ key, label, icon: Icon, description, suffix, color }) => (
            <div
              key={key}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#C89A3D]/20 transition-all duration-300 group"
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {label}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-tight">
                    {description}
                  </p>
                </div>
                {/* Refresh button — only for projectsCompleted */}
                {key === "projectsCompleted" && (
                  <button
                    onClick={handleSyncProjects}
                    disabled={syncing}
                    title="Sync from portfolio database"
                    className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-500 hover:text-amber-600 transition-all duration-200 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`}
                    />
                  </button>
                )}
              </div>

              {/* Input */}
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={key === "satisfactionRate" ? 100 : 9999}
                  value={form[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full text-2xl font-extrabold text-gray-900 border-0 border-b-2 border-gray-200 focus:border-[#C89A3D] focus:outline-none bg-transparent pb-1 pr-8 transition-colors duration-200"
                />
                {suffix && (
                  <span className="absolute right-0 bottom-1 text-2xl font-extrabold text-gray-400">
                    {suffix}
                  </span>
                )}
                {!suffix && (
                  <span className="absolute right-0 bottom-1 text-xl font-extrabold text-gray-300">
                    +
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2.5 px-8 py-3 bg-[#C89A3D] hover:bg-[#b78930] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg hover:shadow-[#C89A3D]/30 hover:shadow-xl"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OverviewAdmin;
