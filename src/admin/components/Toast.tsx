import { CheckCircle2, AlertCircle } from "lucide-react";

const Toast = ({ msg, type }: { msg: string; type: "success" | "error" }) => (
  <div
    className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium border
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

export default Toast;
