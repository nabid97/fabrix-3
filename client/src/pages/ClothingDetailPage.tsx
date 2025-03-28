import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getImageWithFallback } from '../utils/imageUtils';
import { fetchClothingProductById } from '../api/productApi'; // You'll need to create this function

interface ClothingProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  images?: string[];
  availableSizes: string[];
  availableColors: string[];
  fabricOptions: string[];
  gender: string[];
  minOrderQuantity: number;
}

const ClothingDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addItem } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ClothingProduct | null>(null);
  const navigate = useNavigate();
  
  // Form state for customization
  const [customization, setCustomization] = useState({
    size: '',
    color: '',
    fabric: '',
    quantity: 0,
    logoUrl: '',
    logoPosition: 'left-chest',
    notes: '',
  });
  
  // Fetch product data
  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const productData = await fetchClothingProductById(productId);
        setProduct(productData);
        
        // Set initial customization values
        setCustomization({
          size: productData.availableSizes[0] || '',
          color: productData.availableColors[0] || '',
          fabric: productData.fabricOptions[0] || '',
          quantity: productData.minOrderQuantity,
          logoUrl: '',
          logoPosition: 'left-chest',
          notes: '',
        });
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    const cartItem = {
      id: `${product.id}-${Date.now()}`,
      type: 'clothing' as const,
      name: product.name,
      price: product.basePrice * customization.quantity,
      quantity: 1, // This is one cart item, which contains multiple clothing items
      imageUrl: product.imageUrl || (product.images && product.images[0]) || '',
      size: customization.size,
      color: customization.color,
      fabric: customization.fabric,
      orderQuantity: customization.quantity,
      logoUrl: customization.logoUrl,
      logoPosition: customization.logoPosition,
      notes: customization.notes
    };
    
    addItem(cartItem);
    navigate('/cart', { state: { addedItem: cartItem } });
  };
  
  if (loading) return <LoadingSpinner message="Loading product details..." />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link to="/clothing" className="text-red-700 underline">
              Back to All Clothing
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p>Sorry, we couldn't find the product you're looking for.</p>
          <div className="mt-4">
            <Link to="/clothing" className="text-yellow-700 underline">
              Browse All Clothing
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Get image with fallback
  const imageProps = getImageWithFallback(
    product.imageUrl || (product.images && product.images[0]) || '',
    product.name
  );
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <Link
          to="/clothing"
          className="inline-flex items-center text-teal-600 hover:text-teal-800"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to All Clothing
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
            <img
              src={imageProps.src}
              alt={product.name}
              onError={imageProps.onError}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            
            <div className="flex items-center mb-6">
              <span className="text-2xl font-bold text-teal-600">${product.basePrice.toFixed(2)}</span>
              <span className="text-gray-500 ml-2">per unit</span>
            </div>
            
            <div className="space-y-6">
              {/* Size Selection */}
              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  id="size"
                  value={customization.size}
                  onChange={(e) => setCustomization({ ...customization, size: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {product.availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {product.availableColors.map((color) => (
                    <div 
                      key={color} 
                      className={`p-1 rounded-md cursor-pointer ${customization.color === color ? 'ring-2 ring-teal-500' : ''}`}
                      onClick={() => setCustomization({ ...customization, color })}
                    >
                      <div 
                        className="w-full h-8 rounded"
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      ></div>
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">Selected: {customization.color}</p>
              </div>
              
              {/* Fabric Selection */}
              <div>
                <label htmlFor="fabric" className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric
                </label>
                <select
                  id="fabric"
                  value={customization.fabric}
                  onChange={(e) => setCustomization({ ...customization, fabric: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {product.fabricOptions.map((fabric) => (
                    <option key={fabric} value={fabric}>
                      {fabric}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (Minimum {product.minOrderQuantity} pcs)
                </label>
                <div className="flex items-center">
                  <button 
                    onClick={() => setCustomization({
                      ...customization,
                      quantity: Math.max(product.minOrderQuantity, customization.quantity - 10)
                    })}
                    className="px-3 py-2 bg-gray-200 rounded-l-md"
                    disabled={customization.quantity <= product.minOrderQuantity}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min={product.minOrderQuantity}
                    step={10}
                    value={customization.quantity}
                    onChange={(e) => setCustomization({
                      ...customization,
                      quantity: Math.max(product.minOrderQuantity, parseInt(e.target.value) || product.minOrderQuantity)
                    })}
                    className="w-20 text-center p-2 border-y border-gray-300 focus:outline-none"
                  />
                  <button 
                    onClick={() => setCustomization({
                      ...customization,
                      quantity: customization.quantity + 10
                    })}
                    className="px-3 py-2 bg-gray-200 rounded-r-md"
                  >
                    +
                  </button>
                  <span className="ml-2">pcs</span>
                </div>
              </div>
              
              {/* Logo Position Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo Position
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['left-chest', 'right-chest', 'center-chest', 'back'].map((position) => (
                    <div 
                      key={position} 
                      className={`p-2 border rounded-md cursor-pointer ${customization.logoPosition === position ? 'bg-teal-50 border-teal-500' : 'border-gray-200'}`}
                      onClick={() => setCustomization({ ...customization, logoPosition: position })}
                    >
                      <div className="text-sm capitalize">{position.replace('-', ' ')}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Special Instructions */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions (Optional)
                </label>
                <textarea
                  id="notes"
                  value={customization.notes}
                  onChange={(e) => setCustomization({ ...customization, notes: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add any specific requirements for your order..."
                ></textarea>
              </div>
              
              {/* Total Price */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span>Price per unit:</span>
                  <span>${product.basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Quantity:</span>
                  <span>{customization.quantity} pcs</span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg border-t border-gray-300 pt-2 mt-2">
                  <span>Total Price:</span>
                  <span>${(product.basePrice * customization.quantity).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart size={20} className="mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothingDetailPage;