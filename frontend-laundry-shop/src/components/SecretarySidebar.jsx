import { Link, useLocation } from "react-router-dom";
import image from "../assets/ggg.jpg";
export default function SecretarySidebar() {
  const name = localStorage.getItem("name") || "Secretary";
  const email = localStorage.getItem("email") || "secretary@example.com";
  const location = useLocation();

  // Helper to highlight the active link
  const isActive = (path) =>
    location.pathname.startsWith(path)
      ? "bg-gray-100 text-gray-900"
      : "text-gray-600 hover:bg-gray-100";

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-white">
      {/* APP NAME */}
      <div className="mx-auto text-lg font-semibold">Laundry Shop</div>

      {/* USER INFO */}
      <div className="flex flex-col items-center mt-6 -mx-2">
        <img
          className="object-cover w-24 h-24 mx-2 rounded-full"
          src={image}
          alt="avatar"
        />

        <h4 className="mx-2 mt-2 font-medium text-gray-800 truncate w-full text-center px-2">
          {name}
        </h4>

        <p className="mx-2 mt-1 text-sm font-medium text-gray-600 truncate w-full text-center px-2">
          {email}
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col flex-1 mt-8 gap-3">
        <Link
          to="/dashboard"
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${isActive(
            "/dashboard"
          )}`}
        >
          Dashboard
        </Link>

        <Link
          to="/new-order"
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${isActive(
            "/new-order"
          )}`}
        >
          New Order
        </Link>

        <Link
          to="/orders"
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${isActive(
            "/orders"
          )}`}
        >
          Orders
        </Link>

        <Link
          to="/customers"
          className={`flex items-center px-4 py-2 rounded-lg font-medium ${isActive(
            "/customers"
          )}`}
        >
          Customers
        </Link>
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="w-full text-left px-4 py-2 mt-4 text-red-600 hover:bg-red-100 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
