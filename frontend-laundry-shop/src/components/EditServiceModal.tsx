import { useState, useEffect } from "react";
import type { ServiceItem } from "../types/Order";

interface EditServiceModalProps {
  isOpen: boolean;
  service: ServiceItem | null;
  onClose: () => void;
  onSave: (updated: ServiceItem) => void;
}

export default function EditServiceModal({
  isOpen,
  service,
  onClose,
  onSave,
}: EditServiceModalProps) {
  const [serviceName, setServiceName] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (service) {
      setServiceName(service.serviceName);
      setWeight(String(service.weight));
      setPrice(String(service.price));
      setTotal(service.total);
    }
  }, [service]);

  useEffect(() => {
    const w = Number(weight) || 0;
    const p = Number(price) || 0;
    setTotal(w * p);
  }, [weight, price]);

  if (!isOpen || !service) return null;

  const handleSave = () => {
    if (!serviceName.trim()) return alert("Please select a service.");
    if (!weight || Number(weight) <= 0)
      return alert("Weight must be greater than 0.");
    if (!price || Number(price) <= 0)
      return alert("Price must be greater than 0.");

    onSave({
      serviceName,
      weight: Number(weight),
      price: Number(price),
      total,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Edit Service</h2>

        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
        >
          <option value="">Select service</option>
          <option value="Wash & Fold">Wash & Fold</option>
          <option value="Wash & Iron">Wash & Iron</option>
          <option value="Dry Cleaning">Dry Cleaning</option>
          <option value="Press Only">Press Only</option>
        </select>

        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-3"
          placeholder="Weight (kg)"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
          placeholder="Price per kg"
        />

        <div className="text-lg font-semibold mb-4">Total: ₱{total}</div>

        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
