export interface ClothingProductApiResponse {
  id?: string;
  name: string;
  price?: number;
  basePrice?: number;
  description?: string;
  images?: string[];
  gender?: string[];
  availableSizes?: string[];
  availableColors?: string[];
  fabricOptions?: string[];
  minOrderQuantity?: number;
}