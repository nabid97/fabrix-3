export interface Product {
  id?: string;
  name: string;
  description?: string;
  imageUrl?: string;
  images?: string[];
  price?: number;
  basePrice?: number;
  type?: string;
}

export interface ClothingProduct {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  price?: number;
  basePrice: number;
  availableSizes: string[];
  availableColors: string[];
  fabricOptions: string[];
  gender: string[];
  minOrderQuantity: number;
  weight?: number;
  type: 'clothing';
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  customizationOptions?: {
    allowsLogo: boolean;
    logoPositions: string[];
    allowsCustomColors: boolean;
  };
}

export interface ClothingProductApiResponse {
  id?: string;
  name: string;
  price?: number;
  basePrice?: number;
  description?: string;
  imageUrl?: string;
  images?: string[];
  gender?: string[];
  availableSizes?: string[];
  availableColors?: string[];
  fabricOptions?: string[];
  minOrderQuantity?: number;
}

export interface FabricProduct {
  id: string; // Unique identifier for the fabric
  name: string; // Name of the fabric
  description: string; // Description of the fabric
  pricePerMeter: number; // Price per meter of the fabric
  availableColors: string[]; // List of available colors
  styles: string[]; // List of fabric styles (e.g., Regular, Patterned)
  composition: string; // Composition of the fabric (e.g., Cotton, Polyester)
  weight: string; // Weight of the fabric (e.g., Light, Medium, Heavy)
  minOrderLength: number; // Minimum order length in meters
  type: string; // Type of the fabric (e.g., Cotton, Silk)
  imageUrl?: string; // Optional URL for the fabric image
}