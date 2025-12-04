import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import SecretarySidebar from "../components/SecretarySidebar";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data));
  }, []);

  // --- STATS ---
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const ongoingCount = orders.filter((o) => o.status === "ongoing").length;

  const today = new Date().toISOString().slice(0, 10);
  const ordersToday = orders.filter(
    (o) => o.created_at?.slice(0, 10) === today
  ).length;

  // --- LATEST ORDERS ---
  const latestOrders = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  const getStatusColor = (status) => {
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
      <SecretarySidebar />

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        {/* STATS */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {/* Pending */}
          <div className="p-6 rounded-2xl bg-white shadow">
            <div className="text-sm font-medium text-gray-500">
              Pending Orders
            </div>
            <div className="text-3xl font-bold">{pendingCount}</div>
          </div>

          {/* Ongoing */}
          <div className="p-6 rounded-2xl bg-white shadow">
            <div className="text-sm font-medium text-gray-500">
              Ongoing Orders
            </div>
            <div className="text-3xl font-bold">{ongoingCount}</div>
          </div>

          {/* Orders Today */}
          <div className="p-6 rounded-2xl bg-white shadow">
            <div className="text-sm font-medium text-gray-500">
              Orders Today
            </div>
            <div className="text-3xl font-bold">{ordersToday}</div>
          </div>
        </div>

        {/* TABLE */}
        <div className="shadow-lg rounded-lg overflow-hidden bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-4 px-6 text-left">Order ID</th>
                <th className="py-4 px-6 text-left">Customer</th>
                <th className="py-4 px-6 text-left">Service</th>
                <th className="py-4 px-6 text-left">Total</th>
                <th className="py-4 px-6 text-left">Status</th>
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

                  <td className="py-4 px-6">
                    {order.items.length === 1
                      ? order.items[0].serviceName
                      : `${order.items.length} services`}
                  </td>

                  <td className="py-4 px-6">₱{order.total_amount}</td>

                  <td className="py-4 px-6">
                    <span
                      className={`${getStatusColor(
                        order.status
                      )} text-white py-1 px-3 rounded-full text-xs`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
