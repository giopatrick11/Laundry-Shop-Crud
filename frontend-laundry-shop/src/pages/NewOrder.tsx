import { useState } from "react";

import SecretarySidebar from "../components/SecretarySidebar";

import AddServiceModal from "../components/AddServiceModal";
import AddOrderModal from "../components/AddOrderModal";
import EditServiceModal from "../components/EditServiceModal";
import ServiceActionsMenu from "../components/ServiceActionsMenu";

import type { ServiceItem } from "../types/Order";
import { createOrder } from "../services/orderService";

export default function NewOrder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const handleSubmitOrder = async () => {
    if (!customerName || !contactNumber) {
      alert("Please enter customer details first.");
      return;
    }

    if (services.length === 0) {
      alert("You must add at least 1 service.");
      return;
    }

    const payload = { customerName, contactNumber, services };

    try {
      await createOrder(payload);
      alert("Order submitted successfully!");

      setCustomerName("");
      setContactNumber("");
      setServices([]);
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      {/* SIDEBAR COMPONENT */}
      <SecretarySidebar />

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        {/* TOP SECTION */}
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
