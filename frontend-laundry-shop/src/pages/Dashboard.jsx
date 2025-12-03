import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

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

  // --- LATEST 7 ORDERS ---
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
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg"
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

        {/* LOGOUT BUTTON */}

        <div className="mt-auto ml-6 pt-6">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

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
