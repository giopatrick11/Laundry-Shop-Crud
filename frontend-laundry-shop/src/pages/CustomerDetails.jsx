// src/pages/CustomerDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";

export default function CustomerDetails() {
  const { phone } = useParams();
  const [orders, setOrders] = useState([]);
  const [customerName, setCustomerName] = useState("");

  // detect user role → admin or secretary
  const role = localStorage.getItem("role");
  const backPath = role === "admin" ? "/admin/customers" : "/customers";

  useEffect(() => {
    getOrders().then((res) => {
      const all = res.data || [];

      // Filter all orders belonging to this phone number
      const filtered = all.filter((o) => o.contact_number === phone);

      setOrders(filtered);

      if (filtered.length > 0) {
        setCustomerName(filtered[0].customer_name);
      }
    });
  }, [phone]);

  return (
    <div className="flex">
      {/* MAIN SCREEN ONLY (we do NOT show sidebar here) */}
      <main className="bg-gray-200 min-h-screen w-full p-10 pt-20">
        {/* BACK BUTTON */}
        <Link
          to={backPath}
          className="inline-block px-5 py-2 mb-6 bg-white shadow rounded-lg 
          text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          ← Back to Customers
        </Link>

        {/* CUSTOMER HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{customerName}</h1>
          <p className="text-lg text-gray-600 mt-1">{phone}</p>

          <div className="mt-4 flex gap-8">
            <div className="text-gray-700">
              <span className="font-semibold text-xl">{orders.length}</span>{" "}
              total orders
            </div>
          </div>
        </div>

        {/* ORDER HISTORY TABLE */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Order History
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              This customer has no orders yet.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Services</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b">
                    <td className="py-4 px-4 font-medium">{o.id}</td>

                    <td className="py-4 px-4">
                      {o.items.map((item) => (
                        <div key={item.id} className="text-gray-700">
                          • {item.serviceName} — {item.weight}kg (₱{item.total})
                        </div>
                      ))}
                    </td>

                    <td className="py-4 px-4 font-semibold text-gray-900">
                      ₱{o.total_amount}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={
                          "px-3 py-1 rounded-full text-xs font-medium capitalize " +
                          {
                            pending: "bg-gray-300 text-gray-700",
                            ongoing: "bg-yellow-500 text-white",
                            completed: "bg-green-500 text-white",
                            cancelled: "bg-red-500 text-white",
                          }[o.status]
                        }
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
