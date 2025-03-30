import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClothingProduct } from '../../types/product';

const DEFAULT_PLACEHOLDER = 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/clothing-fallback.png';

// Simplified image loading hook without CORS-triggering HEAD requests
const useImage = (src: string, fallbackSrc: string) => {
  const [imgSrc, setImgSrc] = useState<string>(src || fallbackSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    // Reset state if src changes
    setIsLoaded(false);
    setIsError(false);

    if (!src) {
      setImgSrc(fallbackSrc);
      setIsError(true);
      return;
    }
    
    // Fix malformed URLs - single cleanup pass
    let cleanSrc = src;
    if (cleanSrc.startsWith('https://https://')) {
      cleanSrc = cleanSrc.replace('https://https://', 'https://');
    }
    
    if (cleanSrc.includes('.s3.us-east-1.amazonaws.com.s3.us-east-1.amazonaws.com')) {
      cleanSrc = cleanSrc.replace('.s3.us-east-1.amazonaws.com.s3.us-east-1.amazonaws.com', 
                                '.s3.us-east-1.amazonaws.com');
    }
    
    // Set initial source to the cleaned URL
    setImgSrc(cleanSrc);

    // Use the Image API directly - no CORS preflight checks
    const img = new Image();
    
    img.onload = () => {
      console.log(`✅ Successfully loaded: ${cleanSrc}`);
      setImgSrc(cleanSrc);
      setIsLoaded(true);
      setIsError(false);
    };
    
    img.onerror = () => {
      console.error(`❌ Failed to load image: ${cleanSrc}`);
      setImgSrc(fallbackSrc);
      setIsError(true);
    };
    
    img.src = cleanSrc;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, fallbackSrc]);

  return { imgSrc, isLoaded, isError };
};

interface ClothingCardProps {
  product: ClothingProduct;
  onClick?: (product: ClothingProduct) => void;
  // These props should be optional
  filteredProducts?: ClothingProduct[];
  navigateToProduct?: (product: ClothingProduct) => void;
}

const ClothingCard: React.FC<ClothingCardProps> = ({ 
  product, 
  onClick,
  // We don't actually use these props in the component
  filteredProducts, 
  navigateToProduct 
}) => {
  const navigate = useNavigate();
  const { imgSrc } = useImage(product.imageUrl, DEFAULT_PLACEHOLDER);

  // Format price safely with fallback
  const formatPrice = (price: number | undefined): string => {
    if (typeof price !== 'number') return '0.00';
    return price.toFixed(2);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(product);
    } else if (navigateToProduct) {
      navigateToProduct(product);
    } else if (product.id) {
      // Default behavior if no onClick provided
      navigate(`/clothing/${product.id}`);
    }
  };

  // Add debug logging to help identify issues
  console.log('Rendering product:', product.name, 'with image:', product.imageUrl);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-gray-200"
      onClick={handleClick}
    >
      <div className="h-64 overflow-hidden">
        <img 
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error(`Image failed to load for ${product.name}: ${product.imageUrl}`);
            e.currentTarget.src = DEFAULT_PLACEHOLDER;
            e.currentTarget.onerror = null; // Prevent infinite error loop
          }}
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
        
        <Link 
          to={`/clothing/${product.id}`} // Ensure product.id is valid
          className="block w-full bg-gray-700 hover:bg-gray-600 text-white text-center py-2 px-4 rounded transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ClothingCard;