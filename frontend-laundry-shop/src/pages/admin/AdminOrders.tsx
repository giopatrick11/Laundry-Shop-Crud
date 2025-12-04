// src/pages/admin/AdminOrders.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import type { Order } from "../../types/Order";

import UpdateStatusModal from "../../components/UpdateStatusModal";
import EditOrderModal from "../../components/EditOrderModal";
import ViewServicesModal from "../../components/ViewServicesModal";

import {
  getOrders,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../services/orderService";

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadOrders = () => {
    getOrders().then((res) => {
      const sorted = [...res.data].sort((a, b) => b.id - a.id);
      setOrders(sorted);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      order.id.toString().includes(q) ||
      order.customer_name.toLowerCase().includes(q) ||
      order.contact_number.toLowerCase().includes(q) ||
      order.items.some((i) => i.serviceName?.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedOrders = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full px-5 py-3 mb-6 bg-white rounded-xl shadow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Service</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 px-6">{order.id}</td>

                  <td className="py-4 px-6">
                    {order.customer_name}
                    <div className="text-gray-500 text-sm">
                      {order.contact_number}
                    </div>
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

                    {/* Show sample first service below (optional design) */}
                    <div className="text-gray-400 text-xs">
                      {order.items.length > 1 ? order.items[0].serviceName : ""}
                    </div>
                  </td>

                  <td className="py-4 px-6">₱{order.total_amount}</td>

                  <td className="py-4 px-6 capitalize">
                    <span className="px-3 py-1 rounded-full text-white text-xs bg-blue-600">
                      {order.status}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsStatusModalOpen(true);
                        }}
                      >
                        Status
                      </button>

                      <button
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-white shadow"
            }`}
          >
            Previous
          </button>

          <span className="px-3 py-1 bg-white shadow rounded">
            Page {currentPage} of {totalPages || 1}
          </span>

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-300 text-gray-500"
                : "bg-white shadow"
            }`}
          >
            Next
          </button>
        </div>

        {/* Modals */}
        <UpdateStatusModal
          isOpen={isStatusModalOpen}
          currentStatus={selectedOrder?.status || "pending"}
          onClose={() => setIsStatusModalOpen(false)}
          onSave={(status) => {
            if (!selectedOrder) return;
            updateOrderStatus(selectedOrder.id, status).then(loadOrders);
          }}
        />

        <EditOrderModal
          isOpen={isEditModalOpen}
          order={selectedOrder}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(data) => {
            if (!selectedOrder) return;
            updateOrder(selectedOrder.id, data).then(loadOrders);
          }}
        />
        <ViewServicesModal
          isOpen={isServiceModalOpen}
          order={selectedOrder}
          onClose={() => setIsServiceModalOpen(false)}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 shadow w-[350px]">
              <h2 className="text-xl font-bold mb-4">Delete Order</h2>

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
                    deleteOrder(selectedOrder.id).then(loadOrders);
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
