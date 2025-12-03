import { useState, useEffect } from "react";

export default function EditOrderModal({ isOpen, order, onClose, onSave }) {
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [services, setServices] = useState(order?.items || []);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customer_name);
      setContactNumber(order.contact_number);

      setServices(
        order.items.map((item) => ({
          serviceName: item.serviceName,
          weight: item.weight,
          price: item.price,
          total: item.total,
        }))
      );
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const updateService = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    newServices[index].total =
      Number(newServices[index].weight) * Number(newServices[index].price);
    setServices(newServices);
  };

  const addService = () => {
    setServices([
      ...services,
      { serviceName: "", weight: 0, price: 0, total: 0 },
    ]);
  };

  const removeService = (index) => {
    if (services.length === 1) {
      alert("You must have at least one service. Cannot remove.");
      return;
    }
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!customerName.trim()) {
      alert("Customer name is required.");
      return;
    }
    if (!contactNumber.trim()) {
      alert("Contact number is required.");
      return;
    }
    for (const s of services) {
      if (!s.serviceName.trim()) {
        alert("Service name is required.");
        return;
      }
      if (s.weight <= 0) {
        alert("Weight must be greater than 0.");
        return;
      }
      if (s.price <= 0) {
        alert("Price must be greater than 0.");
        return;
      }
    }

    onSave({
      customerName,
      contactNumber,
      services,
    });

    onClose();
  };

  // RESET STATE WHEN CANCELLED
  const handleCancel = () => {
    if (order) {
      setCustomerName(order.customer_name);
      setContactNumber(order.contact_number);

      setServices(
        order.items.map((item) => ({
          serviceName: item.serviceName,
          weight: item.weight,
          price: item.price,
          total: item.total,
        }))
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white w-[550px] p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-3"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4"
          placeholder="Contact Number"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <h3 className="font-semibold mb-2">Services</h3>

        {services.map((s, index) => (
          <div key={index} className="border p-4 rounded-lg mb-4">
            <select
              value={services[index].serviceName}
              onChange={(e) =>
                updateService(index, "serviceName", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg mb-3"
            >
              <option value="">Select Service</option>
              <option value="Wash & Fold">Wash & Fold</option>
              <option value="Wash & Iron">Wash & Iron</option>
              <option value="Dry Cleaning">Dry Cleaning</option>
              <option value="Press Only">Press Only</option>
            </select>

            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                step="0.01"
                className="px-3 py-2 border rounded-lg"
                value={services[index].weight}
                onChange={(e) =>
                  updateService(index, "weight", Number(e.target.value))
                }
              />

              <input
                type="number"
                step="0.01"
                className="px-3 py-2 border rounded-lg"
                value={services[index].price}
                onChange={(e) =>
                  updateService(index, "price", Number(e.target.value))
                }
              />

              <input
                type="number"
                readOnly
                className="px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                value={services[index].total}
              />
            </div>

            <button
              className="text-red-500 mt-2 text-sm"
              onClick={() => removeService(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addService}
          className="bg-gray-200 px-3 py-1 rounded mb-4"
        >
          Add Service
        </button>

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
