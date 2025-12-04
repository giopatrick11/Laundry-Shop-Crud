import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/orderService";

import SecretarySidebar from "../components/SecretarySidebar";

export default function Customers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load & group customers
  useEffect(() => {
    getOrders().then((res) => {
      const orders = res.data || [];

      const validOrders = orders.filter((o) =>
        ["pending", "ongoing", "completed"].includes(o.status)
      );

      const grouped = {};

      validOrders.forEach((order) => {
        const key = `${order.customer_name}|${order.contact_number}`;

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

  // Reset to page 1 when typing search
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <SecretarySidebar />

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
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Customer Name
                </th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Phone
                </th>
                <th className="py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Total Orders
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedCustomers.map((c, index) => (
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
                      className="inline-block px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-all"
                    >
                      View Orders
                    </Link>
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
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white shadow"
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
