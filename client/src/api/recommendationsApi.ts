/**
 * Fetches product recommendations from the API
 */
export interface Recommendation {
  id: string;
  name: string;
  price?: number;
  imageUrl?: string;
  availableColors?: string[];
  availableSizes?: string[];
  gender?: string[];
  description?: string;
}

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  try {
    console.log('Fetching recommendations from API...');
    const response = await fetch('/api/recommendations');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Recommendations data received:', data);

    // Debug all image URLs
    data.forEach((item: Recommendation) => {
      console.log(`Image URL for ${item.name}: ${item.imageUrl}`);
    });

    data.forEach((item: Recommendation) => {
      fetch(item.imageUrl || '', { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            console.error(`❌ Missing image for ${item.name}: ${item.imageUrl}`);
          } else {
            console.log(`✅ Image exists for ${item.name}: ${item.imageUrl}`);
          }
        })
        .catch(() => {
          console.error(`❌ Error checking image for ${item.name}: ${item.imageUrl}`);
        });
    });

    return data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    
    // Return fallback data if API fails
    return [
      {
        id: '1',
        name: 'Premium Polo Shirt',
        price: 24.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo-shirt.jpg', // Correct file name
        availableColors: ['White', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '2',
        name: 'Branded Hoodie',
        price: 39.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/pullover-hoodie.jpg', // Correct file name
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '3',
        name: 'Performance Vest',
        price: 34.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/performance-vest.jpg', // Correct file name
        availableColors: ['Black', 'Navy', 'Red'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '4',
        name: 'Quarter-Zip Pullover',
        price: 49.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/quarter-zip-pullover.jpg', // Correct file name
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '5',
        name: 'Softshell Jacket',
        price: 59.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/softshell-jacket.jpg', // Correct file name
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '6',
        name: 'Structured Cap',
        price: 19.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/structured-cap.jpg', // Correct file name
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['One Size']
      },
      {
        id: '7',
        name: 'Classic T-Shirt',
        price: 14.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/classic-tshirt.jpg', // Correct file name
        availableColors: ['White', 'Black', 'Gray'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '8',
        name: 'Business Shirt',
        price: 34.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/business-shirt.jpg', // Correct file name
        availableColors: ['White', 'Blue', 'Gray'],
        availableSizes: ['S', 'M', 'L', 'XL']
      }
    ];
  }
};