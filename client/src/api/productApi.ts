import axios from 'axios';

// Set the base API URL based on environment
const API_URL = 'http://localhost:5000/api';  // This will use the proxy settings in package.json

// Product interfaces
export interface ClothingProduct {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  availableSizes: string[];
  availableColors: string[];
  fabricOptions: string[];
  gender: string[];
  minOrderQuantity: number;
  images?: string[];
}

// Update the FabricProduct interface
export interface FabricProduct {
  id: string;
  name: string;
  description: string;
  pricePerMeter: number;
  imageUrl: string;
  availableColors: string[];
  type: string;
  pattern?: string;
  width?: number;
  composition: string | string[];
  weight: string;
  minOrderQuantity: number;
  minOrderLength?: number;
  styles?: string[];
}

/**
 * Fetch all products
 */
export const fetchProducts = async (
  keyword: string = '',
  page: number = 1,
  pageSize: number = 10,
  type?: string
) => {
  try {
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (type) params.append('type', type);

    const response = await axios.get(`${API_URL}/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch clothing products
 */
export const fetchClothingProducts = async (): Promise<ClothingProduct[]> => {
  try {
    console.log(`Fetching clothing products from: ${API_URL}/products/clothing`);
    const response = await axios.get(`${API_URL}/products/clothing`, {
      // Add these options to help diagnose issues
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('API response:', response.status);
    return response.data;
  } catch (error: any) {
    // Better error logging
    console.error('Error fetching clothing products:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received');
    }
    throw error;  // Rethrow to let component handle it
  }
};

/**
 * Fetch fabric products
 */
export const fetchFabricProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/fabric`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch fabric products');
    }

    // Ensure `data` is an array
    if (!Array.isArray(result.data)) {
      throw new Error('API response is not an array');
    }

    return result.data; // Return the array of fabric products
  } catch (error) {
    console.error('Error fetching fabric products:', error);
    throw error;
  }
};

// Add alias for backward compatibility
export const fetchFabrics = fetchFabricProducts;

/**
 * Fetch a single product by ID
 */
export const fetchProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch a single clothing product by ID
 */
export const fetchClothingProductById = async (id: string): Promise<ClothingProduct> => {
  try {
    console.log(`Fetching clothing product with ID: ${id}`);
    const response = await axios.get(`${API_URL}/products/clothing/${id}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('API response status:', response.status);
    
    if (!response.data) {
      throw new Error('No product data received');
    }
    
    return response.data;
  } catch (error: any) {
    // Enhanced error logging
    console.error(`Error fetching clothing product with ID ${id}:`, error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      if (error.response.status === 404) {
        throw new Error(`Clothing product with ID ${id} not found`);
      }
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('Network error: No response received from server');
    }
    
    throw error;
  }
};

/**
 * Fetch a single fabric product by ID
 */
export const fetchFabricProductById = async (id: string): Promise<FabricProduct> => {
  try {
    const response = await axios.get(`${API_URL}/products/fabric/${id}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.data) {
      throw new Error('No fabric product data received');
    }
    
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching fabric product with ID ${id}:`, error);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      if (error.response.status === 404) {
        throw new Error(`Fabric product with ID ${id} not found`);
      }
    } else if (error.request) {
      console.error('No response received from server');
    }
    
    throw error;
  }
};

/**
 * Search products
 */
export const searchProducts = async (query: string) => {
  try {
    const response = await axios.get(`${API_URL}/products?keyword=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Filter products
 */
export const filterProducts = async (filters: Record<string, any>) => {
  try {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values
        value.forEach(v => params.append(`${key}[]`, v));
      } else if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await axios.get(`${API_URL}/products?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error filtering products:', error);
    throw error;
  }
};