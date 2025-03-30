// Add this to a central types file

export interface ProductDocument {
  _id: any; // MongoDB ObjectId type
  name: string;
  description?: string;
  basePrice: number;
  availableColors?: string[];
  availableSizes?: string[];
  imageUrl?: string;
  type: string;
  gender?: string[];
  // Add other fields that might be in your MongoDB document
}
