import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recommendation, fetchRecommendations } from '../api/recommendationsApi';
import LoadingSpinner from './common/LoadingSpinner';
import ClothingCard from './product/ClothingCard';
import { ClothingProduct } from '../types/product';

const S3_BUCKET_URL = 'https://fabrix-assets.s3.us-east-1.amazonaws.com';
const DEFAULT_PLACEHOLDER = `${S3_BUCKET_URL}/clothing/clothing-fallback.png`;

// Add this function to fix image URLs
const getCorrectImageUrl = (product: Recommendation): string => {
  if (!product || !product.name) {
    return DEFAULT_PLACEHOLDER;
  }
  
  // If the URL is missing or incorrect, replace with the correct file name
  const productNameMap: Record<string, string> = {
    'Premium Polo Shirt': 'premium-polo-shirt.jpg',
    'Branded Hoodie': 'pullover-hoodie.jpg',
    'Performance Vest': 'performance-vest.jpg',
    'Business Oxford Shirt': 'business-shirt.jpg',
    'Custom T-Shirt': 'classic-tshirt.jpg',
    'Quarter-Zip Pullover': 'quarter-zip-pullover.jpg',
    'Corporate Softshell Jacket': 'softshell-jacket.jpg',
    'Embroidered Cap': 'structured-cap.jpg',
  };
  
  // Find the correct filename for this product
  const filename = productNameMap[product.name] || 
                  product.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
  
  return `${S3_BUCKET_URL}/clothing/${filename}`;
};

const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setLoading(true);
        const data = await fetchRecommendations();
        console.log('Received recommendations:', data);
        setRecommendations(data);
        setError(null);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const handleProductClick = (product: Recommendation) => {
    if (!product.id) {
      console.error('Product has no ID:', product);
      return;
    }

    navigate(`/clothing/${product.id}`);
  };

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map(product => (
            <ClothingCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                description: product.description || '',
                imageUrl: getCorrectImageUrl(product),
                images: [getCorrectImageUrl(product)],
                price: product.price,
                // Add all required properties for ClothingProduct
                basePrice: product.price || 0,
                availableSizes: product.availableSizes || ['S', 'M', 'L'],
                availableColors: product.availableColors || ['Black', 'White'],
                fabricOptions: ['Cotton', 'Polyester'],
                // Add additional required properties
                type: 'clothing',
                minOrderQuantity: 25,
                gender: Array.isArray(product.gender) ? product.gender : ['unisex']
              }}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;