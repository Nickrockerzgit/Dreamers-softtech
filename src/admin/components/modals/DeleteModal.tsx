interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal = ({ onConfirm, onCancel }: Props) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
        <svg
          className="w-6 h-6 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Delete this post?
      </h3>
      <p className="text-sm text-gray-400 mb-7">
        This action cannot be undone. The post will be permanently removed.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow hover:shadow-red-200"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default DeleteModal;
