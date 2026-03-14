import { X } from "lucide-react";

const TagBadge = ({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove?: () => void;
}) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#C89A3D]/8 text-[#C89A3D] text-xs font-medium border border-[#C89A3D]/15">
    {tag}
    {onRemove && (
      <button
        onClick={onRemove}
        className="ml-0.5 text-[#C89A3D]/60 hover:text-[#C89A3D] transition-colors"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    )}
  </span>
);

export default TagBadge;
