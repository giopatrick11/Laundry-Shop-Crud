import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders, updateCustomer } from "../../services/orderService";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const loadCustomers = () => {
    getOrders().then((res) => {
      const orders = res.data || [];

      const validOrders = orders.filter((o) =>
        ["pending", "ongoing", "completed"].includes(o.status)
      );

      const grouped = {};

      validOrders.forEach((order) => {
        const key = order.customer_name + "|" + order.contact_number;

        if (!grouped[key]) {
          grouped[key] = {
            id: key,
            name: order.customer_name,
            phone: order.contact_number,
            totalOrders: 0,
          };
        }

        grouped[key].totalOrders += 1;
      });

      setCustomers(Object.values(grouped));
    });
  };

  useEffect(() => {
    loadCustomers();
  }, []);

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

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setEditName(customer.name);
    setEditPhone(customer.phone);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCustomer) return;

    try {
      await updateCustomer(
        editingCustomer.name,
        editingCustomer.phone,
        editName,
        editPhone
      );

      setIsEditModalOpen(false);
      setEditingCustomer(null);

      loadCustomers(); // refresh UI from backend
    } catch (err) {
      alert("Failed to update customer.");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Customers
        </h1>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search customer..."
            className="w-full px-5 py-3 rounded-xl bg-white shadow"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/4 py-4 px-6 text-left">Customer Name</th>
                <th className="w-1/4 py-4 px-6 text-left">Phone</th>
                <th className="w-1/4 py-4 px-6 text-left">Total Orders</th>
                <th className="w-1/6 py-4 px-6"></th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {paginatedCustomers.map((c) => (
                <tr key={c.id}>
                  <td className="py-4 px-6 border-b">{c.name}</td>
                  <td className="py-4 px-6 border-b">{c.phone}</td>
                  <td className="py-4 px-6 border-b">{c.totalOrders}</td>

                  <td className="py-4 px-6 border-b text-right">
                    <div className="inline-flex gap-2">
                      <button
                        className="px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-700"
                        onClick={() => openEditModal(c)}
                      >
                        Edit
                      </button>

                      <Link
                        to={`/customer/${c.phone}`}
                        className="px-3 py-1 text-blue-600 hover:underline text-xs"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-white shadow disabled:bg-gray-300 disabled:text-gray-500"
          >
            Previous
          </button>

          <span className="px-3 py-1 bg-white shadow rounded">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-white shadow disabled:bg-gray-300 disabled:text-gray-500"
          >
            Next
          </button>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow w-[380px]">
              <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

              <label className="block text-sm mb-1">Name</label>
              <input
                className="w-full border rounded px-3 py-2 mb-4"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <label className="block text-sm mb-1">Phone</label>
              <input
                className="w-full border rounded px-3 py-2 mb-6"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
