import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Order } from "../types/Order";

import OrderActionsMenu from "../components/OrderActionsMenu";
import UpdateStatusModal from "../components/UpdateStatusModal";
import EditOrderModal from "../components/EditOrderModal";
import ViewServicesModal from "../components/ViewServicesModal";
import SecretarySidebar from "../components/SecretarySidebar";

import {
  getOrders,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
} from "../services/orderService";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load all orders
  useEffect(() => {
    getOrders().then((res) => {
      const sorted = [...res.data].sort((a, b) => b.id - a.id); // newest first
      setOrders(sorted);
    });
  }, []);

  // Reset to page 1 when user searches
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Filter + sort
  const filteredOrders = [...orders]
    .sort((a, b) => b.id - a.id)
    .filter((order) => {
      const q = search.toLowerCase();
      const idMatch = order.id.toString().includes(q);
      const nameMatch = order.customer_name.toLowerCase().includes(q);
      const numberMatch = order.contact_number.toLowerCase().includes(q);
      const serviceMatch = order.items.some((item) =>
        item.serviceName?.toLowerCase().includes(q)
      );
      return idMatch || nameMatch || numberMatch || serviceMatch;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <SecretarySidebar />

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full px-5 py-3 rounded-xl bg-white shadow text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shadow-lg rounded-2xl bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-4 px-6 w-[10%]">Order ID</th>
                <th className="py-4 px-6 w-[25%]">Customer</th>
                <th className="py-4 px-6 w-[25%]">Service</th>
                <th className="py-4 px-6 w-[15%]">Total</th>
                <th className="py-4 px-6 w-[15%]">Status</th>
                <th className="py-4 px-6 w-[10%]"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 px-6">{order.id}</td>

                  <td className="py-4 px-6">
                    {order.customer_name}
                    <br />
                    <span className="text-gray-500 text-sm">
                      {order.contact_number}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {order.items.length === 1 ? (
                      order.items[0].serviceName
                    ) : (
                      <button
                        className="text-blue-600 underline text-sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsServiceModalOpen(true);
                        }}
                      >
                        {order.items.length} services
                      </button>
                    )}

                    <div className="text-gray-400 text-xs">
                      {order.items.length > 1 ? order.items[0].serviceName : ""}
                    </div>
                  </td>

                  <td className="py-4 px-6">₱{order.total_amount}</td>

                  <td className="py-4 px-6">
                    <span
                      className={
                        "py-1 px-3 rounded-full text-xs font-medium " +
                        ({
                          pending: "bg-gray-300 text-gray-700",
                          ongoing: "bg-yellow-500 text-white",
                          completed: "bg-green-500 text-white",
                          cancelled: "bg-red-500 text-white",
                        }[order.status] ?? "bg-gray-300 text-gray-700")
                      }
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <OrderActionsMenu
                      status={order.status}
                      onEdit={() => {
                        setSelectedOrder(order);
                        setIsEditModalOpen(true);
                      }}
                      onDelete={() => {
                        if (
                          order.status !== "pending" &&
                          order.status !== "ongoing"
                        ) {
                          alert(
                            "You can only delete pending or ongoing orders."
                          );
                          return;
                        }
                        setSelectedOrder(order);
                        setIsDeleteModalOpen(true);
                      }}
                      onStatus={() => {
                        setSelectedOrder(order);
                        setIsStatusModalOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white shadow"
            }`}
          >
            Previous
          </button>

          <span className="px-3 py-1 bg-white shadow rounded">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white shadow"
            }`}
          >
            Next
          </button>
        </div>

        {/* UPDATE STATUS MODAL */}
        <UpdateStatusModal
          isOpen={isStatusModalOpen}
          currentStatus={selectedOrder?.status ?? "pending"}
          onClose={() => setIsStatusModalOpen(false)}
          onSave={(newStatus) => {
            if (!selectedOrder) return;

            updateOrderStatus(selectedOrder.id, newStatus).then(() => {
              getOrders().then((res) => setOrders(res.data));
            });

            setIsStatusModalOpen(false);
          }}
        />
        <ViewServicesModal
          isOpen={isServiceModalOpen}
          order={selectedOrder}
          onClose={() => setIsServiceModalOpen(false)}
        />

        {/* EDIT ORDER MODAL */}
        <EditOrderModal
          isOpen={isEditModalOpen}
          order={selectedOrder}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedData) => {
            if (!selectedOrder) return;

            updateOrder(selectedOrder.id, updatedData).then(() => {
              getOrders().then((res) => setOrders(res.data));
            });

            setIsEditModalOpen(false);
          }}
        />

        {/* DELETE MODAL */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[350px]">
              <h2 className="text-xl font-bold mb-3">Delete Order</h2>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this order?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded"
                  onClick={() => {
                    if (!selectedOrder) return;

                    deleteOrder(selectedOrder.id).then(() => {
                      getOrders().then((res) => setOrders(res.data));
                    });

                    setIsDeleteModalOpen(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
