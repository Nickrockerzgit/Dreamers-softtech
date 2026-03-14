const StatCard = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) => (
  <div
    className={`bg-white rounded-2xl border shadow-sm px-5 py-5 flex-1 min-w-[120px] hover:shadow-md transition-all duration-300 group
    ${accent ? "border-[#C89A3D]/20 hover:border-[#C89A3D]/40" : "border-gray-100 hover:border-gray-200"}`}
  >
    <p
      className={`text-3xl font-extrabold leading-none group-hover:scale-105 transition-transform origin-left duration-300
      ${accent ? "text-[#C89A3D]" : "text-gray-800"}`}
    >
      {value}
    </p>
    <p className="text-xs text-gray-400 mt-2 font-medium">{label}</p>
  </div>
);

export default StatCard;
