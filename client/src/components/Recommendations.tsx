import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recommendation, fetchRecommendations } from '../api/recommendationsApi';
import LoadingSpinner from './common/LoadingSpinner';
import ClothingCard from './product/ClothingCard';

const S3_BUCKET_URL = 'https://fabrix-assets.s3.us-east-1.amazonaws.com';
const DEFAULT_PLACEHOLDER = `${S3_BUCKET_URL}/placeholders/no-image.jpg`;

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
        
        // Transform the data to ensure image URLs exist and are valid
        const transformedData = data.map(item => {
          // If the item doesn't have an imageUrl or it's invalid
          if (!item.imageUrl) {
            // Create image URL based on product name
            const productName = item.name.toLowerCase().replace(/\s+/g, '-');
            item.imageUrl = `${S3_BUCKET_URL}/clothing/${productName}.jpg`;
          }
          return item;
        });
        
        setRecommendations(transformedData);
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
                ...product,
                type: 'clothing' as 'clothing', // Explicitly cast type to 'clothing' literal
                fabricOptions: ['Cotton', 'Polyester'],
                minOrderQuantity: 1,
                gender: Array.isArray(product.gender) ? product.gender : ['Unisex'],
                description: product.description || '',
                basePrice: product.price || 0,
                availableColors: product.availableColors || [],
                availableSizes: product.availableSizes || [],
                imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER, // Ensure imageUrl is always a string
              }}
              onClick={() => handleProductClick(product)}
              filteredProducts={recommendations.map(product => ({
                ...product,
                type: 'clothing',
                fabricOptions: ['Cotton', 'Polyester'],
                minOrderQuantity: 1,
                basePrice: product.price || 0,
                availableColors: product.availableColors || [],
                availableSizes: product.availableSizes || [],
                imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER,
                gender: product.gender || ['Unisex'], // Ensure gender is always a string[]
              }))} // Transform recommendations to match ClothingProduct[]
              navigateToProduct={handleProductClick} // Pass the handleProductClick function
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;