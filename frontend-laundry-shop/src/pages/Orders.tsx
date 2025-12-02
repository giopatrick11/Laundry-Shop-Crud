import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Order } from "../types/Order";

import OrderActionsMenu from "../components/OrderActionsMenu";
import UpdateStatusModal from "../components/UpdateStatusModal";
import EditOrderModal from "../components/EditOrderModal";

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

  // Load all orders
  useEffect(() => {
    getOrders().then((res) => {
      const sorted = [...res.data].sort((a, b) => b.id - a.id); // newest first
      setOrders(sorted);
    });
  }, []);

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
            className="flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">New Order</span>
          </Link>

          <Link
            to="/orders"
            className="flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-lg"
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

        <div className="shadow-lg rounded-2xl  bg-white">
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  {/* Order ID */}
                  <td className="py-4 px-6">{order.id}</td>

                  {/* Customer */}
                  <td className="py-4 px-6">
                    {order.customer_name}
                    <br />
                    <span className="text-gray-500 text-sm">
                      {order.contact_number}
                    </span>
                  </td>

                  {/* Service */}
                  <td className="py-4 px-6">
                    {order.items.length === 1
                      ? order.items[0].serviceName
                      : `${order.items.length} services`}
                  </td>

                  {/* Total */}
                  <td className="py-4 px-6">₱{order.total_amount}</td>

                  {/* Status with Colors */}
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

                  {/* Action Menu */}
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
