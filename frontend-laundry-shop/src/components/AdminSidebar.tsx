import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();
  const active = (path) =>
    location.pathname === path ? "bg-gray-100 text-gray-900" : "text-gray-600";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  return (
    <aside className="flex flex-col w-64 h-screen px-4 py-8 bg-white ">
      {/* LOGO */}
      <div className="text-center mb-6">
        <span className="text-xl font-semibold">Admin Panel</span>
      </div>

      {/* PROFILE */}
      <div className="flex flex-col items-center">
        <img
          className="w-20 h-20 rounded-full object-cover"
          src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=634&q=80"
          alt="Admin"
        />
        <h4 className="mt-2 font-medium text-gray-800">
          {localStorage.getItem("name")}
        </h4>
        <p className="text-sm text-gray-600">{localStorage.getItem("email")}</p>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col flex-1 gap-2 mt-8">
        <Link
          to="/admin"
          className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${active(
            "/admin"
          )}`}
        >
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${active(
            "/admin/users"
          )}`}
        >
          Users
        </Link>

        <Link
          to="/admin/reports"
          className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${active(
            "/admin/reports"
          )}`}
        >
          Reports
        </Link>

        <Link
          to="/admin/orders"
          className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${active(
            "/admin/orders"
          )}`}
        >
          Orders
        </Link>

        <Link
          to="/admin/customers"
          className={`px-4 py-2 rounded-lg hover:bg-gray-100 ${active(
            "/admin/customers"
          )}`}
        >
          Customers
        </Link>
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full text-left px-4 py-2 text-red-600 
             hover:bg-red-100 rounded-lg transition"
      >
        Logout
      </button>
    </aside>
  );
}
