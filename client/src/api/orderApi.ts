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
export const getOrderDetails = async (orderNumber: string) => {
  try {
    // Validate orderNumber parameter
    if (!orderNumber) {
      throw new Error('Order number is required');
    }
    
    const token = localStorage.getItem('token');
    
    // Try to get from localStorage first if it matches
    const localOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
    if (localOrder && localOrder.orderNumber === orderNumber) {
      console.log('Found matching order in localStorage');
      return localOrder;
    }
    
    // If not in localStorage, try API
    console.log(`Fetching order ${orderNumber} from API with auth token: ${token ? 'Yes' : 'No'}`);
    
    const response = await axios.get(`/api/orders/${orderNumber}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error: any) {
    // If API call fails, check localStorage one more time as fallback
    const localOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
    if (localOrder) {
      console.log('API call failed, using localStorage order as fallback');
      return localOrder;
    }
    
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
      console.error('No authentication token found');
      throw new Error('Authentication required');
    }
    
    console.log('Fetching orders with token:', token.substring(0, 10) + '...');
    
    // Ensure correct headers are being sent
    const response = await axios.get('/api/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Orders API response status:', response.status);
    console.log('Orders data structure:', response.data);
    
    return response.data;
  } catch (error: any) {
    // Add better error logging
    console.error('Error fetching orders:', error.response?.data || error.message);
    
    // Try to build orders from localStorage as fallback
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
    if (lastOrder) {
      console.log('Using localStorage order as fallback');
      return [lastOrder];
    }
    
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

