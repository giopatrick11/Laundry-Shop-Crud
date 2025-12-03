// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getOrders } from "../../services/orderService";
import type { Order } from "../../types/Order";

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = () => {
    getOrders().then((res) => setOrders(res.data || []));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // === ADMIN METRICS ===

  // Completed revenue
  const totalSales = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Today's date in YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  // Orders created today
  const ordersToday = orders.filter(
    (o) => o.created_at?.slice(0, 10) === today
  ).length;

  // Total order count
  const totalOrders = orders.length;

  // Latest 7 orders
  const latestOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.created_at || "").getTime() -
        new Date(a.created_at || "").getTime()
    )
    .slice(0, 7);

  const badgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-400";
      case "ongoing":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* TOP METRICS */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {/* Total Sales */}
          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="text-sm text-gray-600">Total Sales</div>
            <div className="text-3xl font-bold">₱{totalSales.toFixed(2)}</div>
          </div>

          {/* Orders Today */}
          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="text-sm text-gray-600">Orders Today</div>
            <div className="text-3xl font-bold">{ordersToday}</div>
          </div>

          {/* Total Orders */}
          <div className="p-6 bg-white rounded-2xl shadow">
            <div className="text-sm text-gray-600">Total Orders</div>
            <div className="text-3xl font-bold">{totalOrders}</div>
          </div>
        </div>

        {/* LATEST ORDERS */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-4 px-6">{order.id}</td>

                  <td className="py-4 px-6">
                    {order.customer_name}
                    <div className="text-gray-500 text-sm">
                      {order.contact_number}
                    </div>
                  </td>

                  <td className="py-4 px-6">₱{order.total_amount}</td>

                  <td className="py-4 px-6">
                    <span
                      className={`${badgeColor(
                        order.status
                      )} text-white py-1 px-3 rounded-full text-xs`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="py-4 px-6">
                    {order.created_at?.slice(0, 10) ?? "—"}
                  </td>
                </tr>
              ))}

              {latestOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
