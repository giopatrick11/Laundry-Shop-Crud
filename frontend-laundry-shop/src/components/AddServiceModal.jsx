import { useState } from "react";

export default function AddServiceModal({ isOpen, onClose, onAddCustomer }) {
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 bg-white/20 backdrop-blur-sm">
      <div className="bg-white w-[420px] p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Information
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
            onClick={() => {
              onAddCustomer({ customerName, contactNumber });
              onClose();
            }}
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}
