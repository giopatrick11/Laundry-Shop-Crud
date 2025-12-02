import { Link, useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { id } = useParams();

  return (
    <div className="flex">
      {/* SIDEBAR — same as before */}
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

      {/* MAIN */}
      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Customer Details
        </h1>

        {/* CUSTOMER INFO CARD */}
        <div className="p-6 bg-white shadow rounded-2xl mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Maria Santos</h2>

          <p className="text-gray-700 mb-1">📞 09123456789</p>
          <p className="text-gray-700 mb-1">🏠 Quezon City</p>
          <p className="text-gray-700">📝 VIP Customer</p>
        </div>

        {/* ORDER HISTORY TABLE */}
        <div className="shadow-lg rounded-2xl overflow-hidden bg-white">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100">
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Order ID
                </th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Date
                </th>
                <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Service
                </th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Status
                </th>
                <th className="w-1/6 py-4 px-6 text-left text-gray-600 font-bold uppercase">
                  Payment
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="py-4 px-6 border-b border-gray-200">
                  ORD-00123
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  Dec 4, 2025
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  Wash & Fold
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="bg-yellow-500 text-white py-1 px-3 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  ₱200 – Unpaid
                </td>
              </tr>

              <tr>
                <td className="py-4 px-6 border-b border-gray-200">
                  ORD-00109
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  Nov 20, 2025
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  Dry Clean
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  <span className="bg-green-500 text-white py-1 px-3 rounded-full text-xs">
                    Done
                  </span>
                </td>
                <td className="py-4 px-6 border-b border-gray-200">
                  ₱360 – Paid
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
