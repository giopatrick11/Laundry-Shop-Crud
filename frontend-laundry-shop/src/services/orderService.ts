import axios from "axios";
import type { Order, OrderPayload } from "../types/Order";

const API_URL = "http://backend-laundry-shop.test/api";

// Create a new order
export const createOrder = (payload: OrderPayload) =>
  axios.post(`${API_URL}/orders`, payload);

// Get all orders (with items)
export const getOrders = () => axios.get<Order[]>(`${API_URL}/orders`);

export const updateOrderStatus = (id: number, status: string) =>
  axios.patch(`${API_URL}/orders/${id}/status`, { status });

export const updateOrder = (id: number, payload: OrderPayload) =>
  axios.put(`${API_URL}/orders/${id}`, payload);

export const deleteOrder = (id: number) =>
  axios.delete(`${API_URL}/orders/${id}`);
