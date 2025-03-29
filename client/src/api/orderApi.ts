import axios from 'axios';

// Re-export the types from OrderConfirmationPage for consistency
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: 'clothing' | 'fabric';
  size?: string;
  color?: string;
  orderQuantity?: number;
  length?: number;
  fabricType?: string;
  logoUrl?: string;
  logoPosition?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

export interface Shipping {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  method: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Payment {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  cardBrand?: string;
  lastFour?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer: Customer;
  shipping: Shipping;
  payment: Payment;
  items: OrderItem[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: 'clothing' | 'fabric';
  color?: string;
  size?: string;
  orderQuantity?: number;
  logoUrl?: string;
  logoPosition?: string;
  fabricType?: string;
  length?: number;
  [key: string]: any; // For flexibility
}

// API Functions
// Get order details by ID
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  try {
    const response = await axios.get(`/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// Create new order
export const createOrder = async (orderData: any): Promise<{ id: string }> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  const data = await response.json();
  return data; // Ensure the returned data includes the order ID
};

// Update order status
export const updateOrderStatus = async (orderId: string, status: string): Promise<Order> => {
  try {
    const response = await axios.patch(`/api/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// Cancel order
export const cancelOrder = async (orderId: string, reason?: string): Promise<Order> => {
  try {
    const response = await axios.post(`/api/orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// Get user's order history
export const getOrderHistory = async (userId: string): Promise<Order[]> => {
  try {
    const response = await axios.get(`/api/users/${userId}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
};

// Fetch all orders for authenticated users
export const getOrders = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing.');
    }

    const response = await fetch('/api/orders/myorders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders');
    }

    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Fetch a single order by order number (for guest users)
export interface OrderResponse {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  customer: Customer;
  shipping: Shipping;
  payment: Payment;
  items: OrderItem[];
}

export const getOrderByNumber = async (orderNumber: string): Promise<OrderResponse> => {
  try {
    const response = await fetch(`/api/orders/number/${orderNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: OrderResponse = await response.json();
    if (!response.ok) {
      throw new Error((data as any).message || 'Failed to fetch order');
    }

    return data;
  } catch (error) {
    console.error('Error fetching order by number:', error);
    throw error;
  }
};

