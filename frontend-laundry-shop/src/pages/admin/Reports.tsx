// src/pages/admin/Reports.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getOrders } from "../../services/orderService";
import type { Order } from "../../types/Order";

export default function Reports() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data || []));
  }, []);

  // Revenue from completed orders
  const revenue = orders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const completed = orders.filter((o) => o.status === "completed").length;
  const cancelled = orders.filter((o) => o.status === "cancelled").length;

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold mb-10">Reports</h1>

        {/* TOP CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Revenue */}
          <div className="p-6 bg-white rounded-lg shadow flex flex-col">
            <span className="text-gray-500">Total Revenue</span>
            <span className="text-3xl font-bold">
              ₱{isNaN(revenue) ? "0.00" : revenue.toFixed(2)}
            </span>
          </div>

          {/* Completed Orders */}
          <div className="p-6 bg-white rounded-lg shadow">
            <span className="text-gray-500">Completed Orders: </span>
            <span className="text-3xl font-bold">{completed}</span>
          </div>

          {/* Cancelled Orders */}
          <div className="p-6 bg-white rounded-lg shadow">
            <span className="text-gray-500">Cancelled Orders: </span>
            <span className="text-3xl font-bold">{cancelled}</span>
          </div>
        </div>

        {/* BREAKDOWN SECTION */}
        <h2 className="text-2xl font-semibold mb-4">Order Breakdown</h2>

        <div className="bg-white p-6 rounded-lg shadow max-w-md">
          <p className="mb-2">Completed: {completed}</p>
          <p className="mb-2">Cancelled: {cancelled}</p>
          <p className="font-semibold">Total Count: {completed + cancelled}</p>
        </div>
      </main>
    </div>
  );
}
