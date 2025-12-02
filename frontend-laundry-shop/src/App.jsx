import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewOrder from "./pages/NewOrder.tsx";
import Orders from "./pages/Orders.tsx";
import Customers from "./pages/Customers";
import PostList from "./pages/PostList";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-order" element={<NewOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/" element={<PostList />} />

        {/* Optional: redirect root → dashboard */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
