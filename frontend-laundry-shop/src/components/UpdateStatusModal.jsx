import { useState } from "react";

export default function UpdateStatusModal({
  isOpen,
  onClose,
  currentStatus,
  onSave,
}) {
  const [status, setStatus] = useState(currentStatus);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[380px] p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Status</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        >
          <option value="pending">Pending</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <div className="flex justify-end gap-3 mt-3">
          <button
            className="px-5 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => {
              onSave(status);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
