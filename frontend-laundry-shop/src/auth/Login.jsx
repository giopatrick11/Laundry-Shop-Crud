import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("name", user.name);
      localStorage.setItem("email", user.email);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="mb-6 text-3xl font-semibold text-gray-900">
          Laundryhalay
        </h1>

        <form
          className="bg-white p-6 rounded shadow w-80"
          onSubmit={handleLogin}
        >
          <label>Email</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-3"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
