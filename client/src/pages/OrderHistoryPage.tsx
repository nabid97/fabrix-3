import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrders } from '../api/orderApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AlertCircle, Package } from 'lucide-react';
import Recommendations from '../components/Recommendations';

// Update the Order and OrderItem interfaces

interface OrderItem {
  id?: string;
  name: string;
  quantity: number;
  price?: number;
  [key: string]: any; // Allow other properties
}

interface Order {
  id?: string;
  orderNumber: string;
  createdAt: string | number | Date;
  status: string;
  total: number;
  items: OrderItem[];
  customer?: any;
  shipping?: any;
  payment?: any;
  [key: string]: any; // Allow other properties
}

// Add this function to normalize orders data

function normalizeOrder(order: any): Order {
  return {
    ...order,
    // Ensure total is a number
    total: typeof order.total === 'number' ? order.total :
           typeof order.total === 'string' ? parseFloat(order.total) :
           typeof order.payment?.total === 'number' ? order.payment.total :
           typeof order.payment?.total === 'string' ? parseFloat(order.payment.total) :
           0,
    // Ensure other required fields
    orderNumber: order.orderNumber || `FB-${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    status: order.status || 'pending',
    items: Array.isArray(order.items) ? order.items : []
  };
}

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use try-catch to avoid router context errors
  const safeNavigate = (path: string) => {
    try {
      navigate(path);
    } catch (err) {
      console.error('Navigation error:', err);
      // Fallback to window.location if navigate fails
      window.location.href = path;
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // IMPORTANT: Check localStorage for recent orders first as fallback
        const localOrderJson = localStorage.getItem('lastOrder');
        let localOrder = null;
        if (localOrderJson) {
          try {
            localOrder = JSON.parse(localOrderJson);
            console.log('Found order in localStorage:', localOrder);
          } catch (e) {
            console.error('Error parsing localStorage order:', e);
          }
        }

        const token = localStorage.getItem('token');
        if (token) {
          console.log('Found token in localStorage:', token.substring(0, 15) + '...');
          
          try {
            // Fetch orders for authenticated users
            const response = await getOrders();
            console.log('API response:', response);
            
            // Handle different response structures
            if (response.orders && Array.isArray(response.orders)) {
              setOrders(response.orders.map(normalizeOrder));
            } else if (Array.isArray(response)) {
              setOrders(response.map(normalizeOrder));
            } else if (response && typeof response === 'object') {
              // Try to find orders array in response
              const possibleOrders = Object.values(response).find(val => Array.isArray(val)) as unknown;
              
              if (possibleOrders && Array.isArray(possibleOrders)) {
                setOrders((possibleOrders as Order[]).map(normalizeOrder));
              } else if ('orderNumber' in response) {
                setOrders([normalizeOrder(response as Order)]);
              } else if (localOrder) {
                // Use localStorage order if API doesn't return proper orders
                setOrders([normalizeOrder(localOrder)]);
              } else {
                setError('No orders found in the response.');
              }
            } else if (localOrder) {
              // Use localStorage order if API doesn't return proper orders
              setOrders([normalizeOrder(localOrder)]);
            } else {
              setError('No orders found or invalid response format.');
            }
          } catch (apiError: any) {
            console.error('API error:', apiError);
            // If API fails, fallback to localStorage
            if (localOrder) {
              setOrders([normalizeOrder(localOrder)]);
              console.log('Using localStorage order after API failure');
            } else {
              throw apiError;
            }
          }
        } else {
          // Guest user - use localStorage order
          if (localOrder) {
            setOrders([normalizeOrder(localOrder)]);
          } else {
            setError('No orders found. Please log in to view your order history.');
          }
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(`Failed to load order history: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log('Updated orders state:', orders);
  }, [orders]);

  useEffect(() => {
    if (orders.length > 0) {
      // Log the structure of the first order
      console.log('Sample order structure:', {
        id: orders[0].id,
        orderNumber: orders[0].orderNumber,
        createdAt: orders[0].createdAt,
        total: orders[0].total,
        status: orders[0].status,
        hasItems: Array.isArray(orders[0].items),
        itemsCount: Array.isArray(orders[0].items) ? orders[0].items.length : 'N/A'
      });
      
      // Check for missing required fields
      const problematicOrders = orders.filter(order => 
        !order.orderNumber || 
        !order.createdAt || 
        typeof order.total !== 'number'
      );
      
      if (problematicOrders.length > 0) {
        console.warn('Found problematic orders:', problematicOrders);
      }
      
      // Verify handleViewOrder function is working
      console.log('First order ID for navigation:', orders[0].orderNumber);
    }
  }, [orders]);

  const handleViewOrder = (orderNumber: string) => {
    if (!orderNumber) {
      console.error('Cannot view order: orderNumber is undefined');
      return;
    }
    
    console.log(`Navigating to order details: ${orderNumber}`);
    safeNavigate(`/order-confirmation/${orderNumber}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
          <AlertCircle size={20} className="mr-2 mt-0.5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center text-gray-600">
          <Package size={48} className="mx-auto mb-4" />
          <p>You have no orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    {(typeof order.total === 'number' && !isNaN(order.total)) 
                      ? `$${order.total.toFixed(2)}`
                      : (typeof order.payment?.total === 'number' && !isNaN(order.payment?.total))
                        ? `$${order.payment.total.toFixed(2)}` 
                        : (typeof order.total === 'string' && !isNaN(parseFloat(order.total)))
                          ? `$${parseFloat(order.total).toFixed(2)}`
                          : 'Price not available'}
                  </p>
                  <button
                    onClick={() => {
                      console.log("View button clicked for order:", order);
                      console.log("Order number value:", order.orderNumber);
                      handleViewOrder(order.orderNumber);
                    }}
                    className="text-teal-600 hover:underline text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Items:</h3>
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  <ul className="text-sm text-gray-600">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item?.quantity || 1}x {item?.name || 'Unknown item'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No items available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <Recommendations />
    </div>
  );
};

export default OrderHistoryPage;