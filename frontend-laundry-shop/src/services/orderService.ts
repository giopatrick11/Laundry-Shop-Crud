import axios from "axios";
import type { Order, OrderPayload } from "../types/Order";

const API_URL = "http://backend-laundry-shop.test/api";

// Helper: always attach token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* =========================
   ORDERS
   ========================= */

// Create a new order
export const createOrder = (payload: OrderPayload) =>
  axios.post(`${API_URL}/orders`, payload, authHeader());

// Get all orders (with items)
export const getOrders = () =>
  axios.get<Order[]>(`${API_URL}/orders`, authHeader());

// Update order status
export const updateOrderStatus = (id: number, status: string) =>
  axios.patch(`${API_URL}/orders/${id}/status`, { status }, authHeader());

// Update entire order (customer info + service items)
export const updateOrder = (id: number, payload: OrderPayload) =>
  axios.put(`${API_URL}/orders/${id}`, payload, authHeader());

// Delete order
export const deleteOrder = (id: number) =>
  axios.delete(`${API_URL}/orders/${id}`, authHeader());

/* =========================
   CUSTOMER UPDATES
   ========================= */

// Update customer name + phone across all their orders
export const updateCustomer = (
  oldName: string,
  oldPhone: string,
  newName: string,
  newPhone: string
) =>
  axios.put(
    `${API_URL}/customers/update`,
    {
      old_name: oldName,
      old_phone: oldPhone,
      new_name: newName,
      new_phone: newPhone,
    },
    authHeader()
  );
