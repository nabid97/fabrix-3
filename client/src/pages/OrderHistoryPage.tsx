import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, getOrderByNumber } from '../api/orderApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AlertCircle, Package } from 'lucide-react';

// Define types for orders and items
interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const OrderHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        const token = localStorage.getItem('token');
        if (token) {
          // Fetch orders for authenticated users
          const response = await getOrders();
          if (response.orders && response.orders.length > 0) {
            setOrders(response.orders);
          } else {
            setError('No orders found.');
          }
        } else {
          // Fetch the last order for guest users
          const lastOrderNumber = localStorage.getItem('lastOrderNumber');
          if (lastOrderNumber) {
            const response = await getOrderByNumber(lastOrderNumber);
            if (response && response.orderNumber) {
              setOrders([{
                ...response,
                total: response.items.reduce((sum, item) => sum + (item.quantity * (item.price || 0)), 0) // Assuming each item has a price
              }]);
            } else {
              setError('No orders found.');
            }
          } else {
            setError('No orders found.');
          }
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    console.log('Updated orders state:', orders);
  }, [orders]);

  const handleViewOrder = (orderNumber: string) => {
    navigate(`/order-confirmation/${orderNumber}`);
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
      <h1 className="text-3xl font-bold mb-8 text-center">Order History</h1>

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
                  <p className="text-lg font-semibold">${order.total.toFixed(2)}</p>
                  <button
                    onClick={() => handleViewOrder(order.orderNumber)}
                    className="text-teal-600 hover:underline text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">Items:</h3>
                <ul className="text-sm text-gray-600">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.quantity}x {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;