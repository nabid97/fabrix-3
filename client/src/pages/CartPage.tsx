import {useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Trash2, ChevronLeft, AlertCircle } from 'lucide-react';

const CartPage = () => {
  const { items, updateItem, removeItem, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  
  // Show warning if cart is empty when user tries to proceed to checkout
  const handleCheckoutClick = () => {
    if (items.length === 0) {
      setShowEmptyWarning(true);
      setTimeout(() => setShowEmptyWarning(false), 5000);
    } else if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=checkout');
    } else {
      // Proceed to checkout
      navigate('/checkout');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-800 text-white rounded-xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Your Cart</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
          <h2 className="text-2xl font-medium mb-4 text-white">Your cart is empty</h2>
          <p className="text-gray-300 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/clothing"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Browse Clothing
            </Link>
            <Link
              to="/fabrics"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Browse Fabrics
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-gray-700 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-gray-600">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">Cart Items ({items.length})</h2>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to empty your cart?')) {
                        clearCart();
                      }
                    }}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Empty Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-600">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row">
                      {/* Product Image */}
                      <div className="md:w-32 h-32 mb-4 md:mb-0 bg-gray-600 rounded-md overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="md:ml-6 flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                            <p className="text-gray-300 text-sm mb-2">
                              {item.type === 'clothing' ? (
                                <>
                                  Size: {item.size} | Color: {item.color} | Fabric: {item.fabric}
                                </>
                              ) : (
                                <>
                                  Type: {item.fabricType} | Color: {item.color} | Length: {item.length}m
                                </>
                              )}
                            </p>
                          </div>
                          <div className="font-semibold text-teal-300 mt-2 md:mt-0">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>
                        
                        {/* Additional Info for Clothing */}
                        {item.type === 'clothing' && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-300">
                              Order Quantity: {item.orderQuantity} pcs
                              {item.logoUrl && item.logoPosition && 
                                ` | Logo: ${item.logoPosition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
                              }
                            </p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center mt-4">
                          {/* Quantity Control */}
                          <div className="flex items-center">
                            <span className="text-sm text-gray-300 mr-2">Qty:</span>
                            <select
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                              className="border border-gray-500 bg-gray-600 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          {/* Remove Item */}
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-400 hover:text-red-300 text-sm flex items-center"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-teal-300 hover:text-teal-200"
              >
                <ChevronLeft size={16} className="mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gray-700 rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6 text-white">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-600 pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-white">Estimated Total</span>
                    <span className="text-teal-300">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {showEmptyWarning && (
                <div className="mt-4 bg-yellow-900 text-yellow-200 p-3 rounded-md flex items-start">
                  <AlertCircle size={18} className="flex-shrink-0 mr-2 mt-0.5" />
                  <p className="text-sm">Your cart is empty. Add some items before proceeding to checkout.</p>
                </div>
              )}
              
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors mt-6"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-300">
                  Need help? <Link to="/contact" className="text-teal-300 hover:underline">Contact us</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;