import { useState, useEffect } from "react";

type AddServiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomer: (data: {
    customerName: string;
    contactNumber: string;
  }) => void;
};

export default function AddServiceModal({
  isOpen,
  onClose,
  onAddCustomer,
}: AddServiceModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // Reset fields when modal opens
  useEffect(() => {
    if (isOpen) {
      setCustomerName("");
      setContactNumber("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(customerName)) {
      alert("Customer name must contain letters only.");
      return;
    }

    if (!contactNumber.trim()) {
      alert("Contact number is required.");
      return;
    }

    if (!/^[0-9]+$/.test(contactNumber)) {
      alert("Contact number must contain digits only.");
      return;
    }

    onAddCustomer({
      customerName: customerName.trim(),
      contactNumber: contactNumber.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Customer Information</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Customer
          </button>
        </div>
      </div>
    </div>
  );
}
