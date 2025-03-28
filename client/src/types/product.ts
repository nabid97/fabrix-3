export interface ClothingProduct {
  id: string;
  name: string;
  basePrice: number;
  description?: string;
  imageUrl: string;
  images?: string[];  // Add this line for additional images
  gender: string[];
  availableSizes: string[];
  availableColors: string[];
  fabricOptions: string[];
  minOrderQuantity: number;
}