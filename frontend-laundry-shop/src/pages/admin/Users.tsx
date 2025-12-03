// src/pages/admin/Users.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";

const API_URL = "http://backend-laundry-shop.test/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const authHeader = {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  const loadUsers = () => {
    axios
      .get(`${API_URL}/users`, authHeader)
      .then((res) => setUsers(res.data || []))
      .catch(() => console.warn("Failed to load users"));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("All fields are required.");
      return;
    }

    axios
      .post(
        `${API_URL}/users`,
        {
          name,
          email,
          password,
          role: "secretary",
        },
        authHeader
      )
      .then(() => {
        setName("");
        setEmail("");
        setPassword("");
        loadUsers();
      })
      .catch(() => alert("Error creating user."));
  };

  const handleDelete = (id: number, role: string) => {
    if (role === "admin") return alert("You cannot delete an admin.");
    if (!confirm("Delete this user?")) return;

    axios
      .delete(`${API_URL}/users/${id}`, authHeader)
      .then(loadUsers)
      .catch(() => alert("Error deleting user."));
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="bg-gray-200 min-h-screen w-full p-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        {/* Create User Form */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-6 rounded-lg shadow mb-10 max-w-md"
        >
          <h2 className="text-xl font-semibold mb-4">Add New Secretary</h2>

          <input
            type="text"
            className="w-full p-2 border rounded mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="w-full p-2 border rounded mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full p-2 border rounded mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Create Secretary
          </button>
        </form>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4 capitalize">{u.role}</td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== "admin" ? (
                      <button
                        onClick={() => handleDelete(u.id, u.role)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-500 italic">Protected</span>
                    )}
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
