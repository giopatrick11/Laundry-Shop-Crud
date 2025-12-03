import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import AddServiceModal from "../components/AddServiceModal";
import AddOrderModal from "../components/AddOrderModal";
import ServiceActionsMenu from "../components/ServiceActionsMenu";
import EditServiceModal from "../components/EditServiceModal";

import type { ServiceItem } from "../types/Order";
import { createOrder } from "../services/orderService";

export default function NewOrder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  // prevent submitting incomplete service items
  const handleSubmitOrder = async () => {
    if (!customerName || !contactNumber) {
      alert("Please enter customer details first.");
      return;
    }

    if (services.length === 0) {
      alert("You must add at least 1 service.");
      return;
    }

    for (let s of services) {
      if (!s.serviceName || !s.weight || !s.price) {
        alert("All service fields must be filled.");
        return;
      }
    }

    const payload = {
      customerName,
      contactNumber,
      services,
    };

    try {
      const res = await createOrder(payload);
      console.log("Order created:", res.data);

      alert("Order submitted successfully!");

      setCustomerName("");
      setContactNumber("");
      setServices([]);
    } catch (error) {
      console.error("Submit failed:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white">
        <a href="#" className="mx-auto">
          <span className="mx-4 font-medium text-lg">Laundry Shop</span>
        </a>

        <div className="flex flex-col items-center mt-6 -mx-2">
          <img
            className="object-cover w-24 h-24 mx-2 rounded-full"
            src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80"
            alt="avatar"
          />
          <h4 className="mx-2 mt-2 font-medium text-gray-800">John Doe</h4>
          <p className="mx-2 mt-1 text-sm font-medium text-gray-600">
            john@example.com
          </p>
        </div>

        <nav className="flex flex-col flex-1 mt-6">
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">Dashboard</span>
          </Link>

          <Link
            to="/new-order"
            className="flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">New Order</span>
          </Link>

          <Link
            to="/orders"
            className="flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">Orders</span>
          </Link>

          <Link
            to="/customers"
            className="flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">Customers</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        {/* TOP */}
        <div className="p-6 mb-8 rounded-2xl bg-gray-100 shadow flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              New Laundry Order
            </h2>

            <p className="text-gray-600 mt-1 text-lg">
              Customer:{" "}
              {customerName ? (
                <span className="font-semibold">
                  {customerName} — {contactNumber}
                </span>
              ) : (
                <span className="italic text-gray-500">Not set</span>
              )}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            Add Customer
          </button>
        </div>

        {/* TABLE */}
        <div className="shadow-lg rounded-2xl overflow-visible bg-white relative">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-left">Service</th>
                <th className="py-4 px-6 text-left">Weight (kg)</th>
                <th className="py-4 px-6 text-left">Price/kg</th>
                <th className="py-4 px-6 text-left">Total</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>

            <tbody>
              {services.map((s, i) => (
                <tr key={i}>
                  <td className="py-4 px-6 border-b">{s.serviceName}</td>
                  <td className="py-4 px-6 border-b">{s.weight} kg</td>
                  <td className="py-4 px-6 border-b">₱{s.price}</td>
                  <td className="py-4 px-6 border-b">₱{s.total}</td>

                  <td className="py-4 px-6 border-b text-right">
                    <ServiceActionsMenu
                      onEdit={() => {
                        setEditingIndex(i);
                        setEditingService(s);
                        setIsEditServiceModalOpen(true);
                      }}
                      onDelete={() => {
                        setServices(services.filter((_, idx) => idx !== i));
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY */}
        <div className="p-6 mt-8 rounded-2xl bg-white shadow">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 text-lg">
              Total Services: {services.length}
            </span>

            <span className="font-bold text-2xl text-gray-800">
              Grand Total: ₱{services.reduce((sum, s) => sum + s.total, 0)}
            </span>
          </div>

          <div className="flex justify-end gap-4">
            <button
              className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
              onClick={() => setIsOrderModalOpen(true)}
            >
              Add Order
            </button>

            <button
              className="px-5 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
              onClick={handleSubmitOrder}
            >
              Submit Order
            </button>
          </div>
        </div>

        {/* MODALS */}
        <AddServiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCustomer={(data) => {
            setCustomerName(data.customerName);
            setContactNumber(data.contactNumber);
          }}
        />

        <AddOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          onAddService={(item: ServiceItem) => setServices([...services, item])}
        />

        <EditServiceModal
          isOpen={isEditServiceModalOpen}
          service={editingService}
          onClose={() => setIsEditServiceModalOpen(false)}
          onSave={(updated) => {
            if (editingIndex === null) return;

            const updatedList = [...services];
            updatedList[editingIndex] = updated;
            setServices(updatedList);
          }}
        />
      </main>
    </div>
  );
}
