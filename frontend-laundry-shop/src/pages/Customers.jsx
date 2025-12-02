import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService"; // import API

export default function Customers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getOrders().then((res) => {
      const orders = res.data;

      // Group by customer_name + contact_number
      const grouped = {};

      orders.forEach((order) => {
        const key = order.customer_name + "|" + order.contact_number;

        if (!grouped[key]) {
          grouped[key] = {
            name: order.customer_name,
            phone: order.contact_number,
            totalOrders: 0,
          };
        }

        grouped[key].totalOrders += 1;
      });

      setCustomers(Object.values(grouped));
    });
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

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
            className="flex items-center px-4 py-2 mt-5 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">Orders</span>
          </Link>

          <Link
            to="/customers"
            className="flex items-center px-4 py-2 mt-5 text-gray-700 bg-gray-100 rounded-lg"
          >
            <span className="mx-4 font-medium">Customers</span>
          </Link>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Customers</h1>

        {/* SEARCH */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search customer..."
            className="w-full px-5 py-3 rounded-xl bg-white shadow text-gray-700 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Customer Name
                </th>
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Phone
                </th>
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Total Orders
                </th>
                <th className="w-1/6 py-4 px-6"></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {filtered.map((c, index) => (
                <tr key={index}>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {c.name}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {c.phone}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-200">
                    {c.totalOrders}
                  </td>

                  <td className="py-4 px-6 border-b border-gray-200 text-right">
                    <Link
                      to={`/customer/${c.phone}`}
                      className="px-3 py-1 text-blue-600 hover:underline"
                    >
                      View
                    </Link>
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
