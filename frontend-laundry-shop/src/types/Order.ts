export interface ServiceItem {
  id?: number;
  serviceName: string;
  weight: number;
  price: number;
  total: number; // frontend computed
}

export interface OrderPayload {
  customerName: string;
  contactNumber: string;
  services: ServiceItem[];
}

export interface OrderItem {
  id: number;
  serviceName: string;
  weight: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  customer_name: string;
  contact_number: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
}
