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

    // Auto compute total
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
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/20 backdrop-blur-sm z-50">
      <div className="bg-white w-[550px] p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

        {/* CUSTOMER INFO */}
        <input
          type="text"
          placeholder="Customer Name"
          className="w-full border px-3 py-2 rounded mb-3"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Contact Number"
          className="w-full border px-3 py-2 rounded mb-4"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        {/* SERVICE ITEMS */}
        <h3 className="font-semibold mb-2">Services</h3>

        {services.map((s, index) => (
          <div key={index} className="border p-4 rounded-lg mb-4">
            {/* SERVICE NAME (Dropdown) */}
            <select
              value={services[index].serviceName}
              onChange={(e) =>
                updateService(index, "serviceName", e.target.value)
              }
              className="w-full px-3 py-2 border rounded-lg mb-3"
            >
              <option value="">Select service</option>
              <option value="Wash">Wash</option>
              <option value="Dry">Dry</option>
              <option value="Fold">Fold</option>
              <option value="Wash & Fold">Wash & Fold</option>
              <option value="Iron">Iron</option>
            </select>

            {/* WEIGHT + PRICE + TOTAL */}
            <div className="grid grid-cols-3 gap-3">
              {/* WEIGHT */}
              <input
                type="number"
                step="0.01"
                value={services[index].weight}
                onChange={(e) =>
                  updateService(index, "weight", Number(e.target.value))
                }
                className="px-3 py-2 border rounded-lg"
              />

              {/* PRICE */}
              <input
                type="number"
                step="0.01"
                value={services[index].price}
                onChange={(e) =>
                  updateService(index, "price", Number(e.target.value))
                }
                className="px-3 py-2 border rounded-lg"
              />

              {/* TOTAL (Read Only) */}
              <input
                type="number"
                value={services[index].total}
                readOnly
                className="px-3 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
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

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() =>
              onSave({
                customerName,
                contactNumber,
                services,
              })
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
