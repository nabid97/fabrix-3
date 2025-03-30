import axios from 'axios';

/**
 * Fetches product recommendations from the API
 */
export interface Recommendation {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  availableColors?: string[];
  availableSizes?: string[];
  gender?: string[];
  description?: string;
}

// Add a file name mapping function to fix mismatched URLs
const correctImageFilename = (productName: string, originalUrl: string): string => {
  // Map of incorrect filenames to correct ones
  const filenameMap: Record<string, string> = {
    'hoodie.jpg': 'pullover-hoodie.jpg',
    'premium-polo.jpg': 'premium-polo-shirt.jpg',
    'performance-vest.jpg': 'performance-vest.jpg', // Already correct
  };
  
  // Extract the filename from the URL
  const urlParts = originalUrl.split('/');
  const originalFilename = urlParts[urlParts.length - 1];
  
  // Replace with correct filename if it exists in our map
  if (filenameMap[originalFilename]) {
    urlParts[urlParts.length - 1] = filenameMap[originalFilename];
    return urlParts.join('/');
  }
  
  // Use product name as fallback
  const fallbackFilename = productName.toLowerCase().replace(/\s+/g, '-') + '.jpg';
  
  // Check if we should use the fallback
  if (originalFilename !== fallbackFilename) {
    urlParts[urlParts.length - 1] = fallbackFilename;
    return urlParts.join('/');
  }
  
  return originalUrl;
};

export const fetchRecommendations = async (): Promise<Recommendation[]> => {
  try {
    const response = await axios.get('/api/recommendations');
    const data: Recommendation[] = response.data;
    
    // Fix image URLs before returning the data
    return data.map(product => ({
      ...product,
      imageUrl: correctImageFilename(product.name, product.imageUrl)
    }));
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};