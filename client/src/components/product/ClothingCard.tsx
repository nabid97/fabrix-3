import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getS3ImageUrl, getImageWithFallback } from '../../utils/imageUtils';
import { ClothingProduct } from '../../types/product';

interface ClothingCardProps {
  product: ClothingProduct;
  onClick?: (product: ClothingProduct) => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ product, onClick }) => {
  const navigate = useNavigate();
  
  // Protect against null/undefined product
  if (!product) {
    return null;
  }

  // Format price safely with fallback
  const formatPrice = (price: number | undefined): string => {
    if (typeof price !== 'number') return '0.00';
    return price.toFixed(2);
  };

  // Ensure proper S3 URL
  const productImageUrl = product.imageUrl?.startsWith('http')
    ? product.imageUrl
    : getS3ImageUrl(`clothing/${product.imageUrl || 'business-shirt.jpg'}`);

  // Use fallbacks both for the primary image and the S3 URL construction
  const imageProps = getImageWithFallback(
    productImageUrl,
    product.name || 'Product'
  );

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else if (product.id) {
      // Default behavior if no onClick provided
      navigate(`/clothing/${product.id}`);
    }
  };

  // In your component, add better error logging
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`Failed to load image: ${e.currentTarget.src}`);
    
    // Check if we're already using a data URI (to avoid infinite loops)
    if (e.currentTarget.src.startsWith('data:')) return;
    
    // Set to a data URI as final fallback
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' text-anchor='middle' dominant-baseline='middle' fill='%23666666'%3EProduct%3C/text%3E%3C/svg%3E";
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
      onClick={handleClick}
    >
      <div className="h-64 overflow-hidden">
        <img
          src={imageProps.src}
          alt={product.name || 'Product'}
          onError={imageProps.onError}
          className="w-full h-full object-cover"
          loading="lazy" // Add lazy loading for better performance
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm h-12 overflow-hidden">
          {product.description && product.description.length > 60
            ? `${product.description.substring(0, 60)}...`
            : (product.description || 'No description available')}
        </p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-teal-600 font-bold">${formatPrice(product.basePrice)}</span>
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex">
              {product.availableColors.slice(0, 3).map((color, index) => (
                <div 
                  key={`${product.id}-color-${index}`} 
                  className="w-4 h-4 rounded-full ml-1"
                  style={{ 
                    backgroundColor: color.toLowerCase(),
                    boxShadow: color.toLowerCase() === 'white' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                  }}
                  title={color}
                />
              ))}
              {product.availableColors.length > 3 && (
                <span className="text-xs text-gray-500 ml-1">+{product.availableColors.length - 3}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {product.gender && product.gender.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {product.gender.join('/')}
            </span>
          )}
          
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            Min: {product.minOrderQuantity || 1}
          </span>
          
          {/* Show a few sizes if available */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <span 
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {product.availableSizes.slice(0, 2).join(', ')}
              {product.availableSizes.length > 2 ? '...' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;