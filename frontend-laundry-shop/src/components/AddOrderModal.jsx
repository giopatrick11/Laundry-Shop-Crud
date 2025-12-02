import { useState, useEffect } from "react";

export default function AddOrderModal({ isOpen, onClose, onAddService }) {
  const [serviceName, setServiceName] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);

  // Compute total automatically
  useEffect(() => {
    const w = parseFloat(weight) || 0;
    const p = parseFloat(price) || 0;
    setTotal(w * p);
  }, [weight, price]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Add Service Item
        </h2>

        <div className="space-y-4">
          {/* SERVICE DROPDOWN */}
          <select
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select Service</option>
            <option value="Wash & Fold">Wash & Fold</option>
            <option value="Wash & Iron">Wash & Iron</option>
            <option value="Dry Cleaning">Dry Cleaning</option>
            <option value="Press Only">Press Only</option>
          </select>

          {/* WEIGHT */}
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price per kg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          {/* AUTO TOTAL */}
          <div className="text-lg font-semibold">Total: ₱{total}</div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-5 py-2 bg-green-600 text-white rounded-lg"
            onClick={() => {
              onAddService({
                serviceName,
                weight: Number(weight),
                price: Number(price),
                total,
              });
              onClose();
            }}
          >
            Add Item
          </button>
        </div>
      </div>
    </div>
  );
}
