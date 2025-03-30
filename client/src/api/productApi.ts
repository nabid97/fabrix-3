import axios from 'axios';
import { ClothingProductApiResponse } from '../types/product';
import { ClothingProduct, FabricProduct } from '../types/product'; // Import the centralized interface

// Set the base API URL based on environment
const API_URL = 'http://localhost:5000/api';  // This will use the proxy settings in package.json


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
export const fetchClothingProducts = async (): Promise<ClothingProductApiResponse[]> => {
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
// Removed duplicate definition of fetchFabrics

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
export async function fetchClothingProductById(id: string): Promise<ClothingProduct> {
  try {
    const response = await fetch(`/api/products/clothing/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
}

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

export async function fetchFabrics(): Promise<FabricProduct[]> {
  try {
    const response = await fetch('/api/products/fabric');
    if (!response.ok) {
      throw new Error('Failed to fetch fabrics');
    }
    const data = await response.json();
    return data.map((fabric: any) => ({
      id: fabric._id,
      name: fabric.name,
      description: fabric.description || '',
      pricePerMeter: fabric.pricePerMeter || 0,
      availableColors: fabric.availableColors || [],
      styles: fabric.styles || [],
      composition: fabric.composition || 'Unknown',
      weight: fabric.weight || 'Medium',
      minOrderLength: fabric.minOrderLength || 1,
      imageUrl: fabric.imageUrl || '',
    }));
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    throw error;
  }
}