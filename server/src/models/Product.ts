import mongoose, { Document, Schema } from 'mongoose';

// Base product interface
export interface IBaseProduct extends Document {
  name: string;
  description: string;
  images: string[];
  imageUrl?: string;  // Added for compatibility
  price: number;
  basePrice?: number; // Added for compatibility with seeder
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  type: string;
}

// Clothing product interface
export interface IClothingProduct extends IBaseProduct {
  type: 'clothing';
  availableSizes?: string[];
  availableColors?: string[];
  fabricOptions?: string[];
  gender?: string[];
  minOrderQuantity?: number;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  customizationOptions?: {
    allowsLogo?: boolean;
    logoPositions?: string[];
    allowsCustomColors?: boolean;
  };
}

// Fabric product interface
export interface IFabricProduct extends IBaseProduct {
  type: 'fabric';
  fabricType: string;
  pattern: string;
  composition: string;
  weight: string; // e.g., "200 GSM"
  width: number; // in cm
  availableColors: string[];
  styles: string[];
  minOrderLength: number;
  careInstructions: string;
  certifications: string[];
}

// Base product schema
const baseProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: function (this: any) {
        return this.images.length === 0;
      },
      default: 'https://via.placeholder.com/300x300?text=No+Image',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    basePrice: {
      type: Number,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['clothing', 'fabric']
    }
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  }
);

baseProductSchema.index({ type: 1, isActive: 1 });

baseProductSchema.virtual('formattedPrice').get(function () {
  return `$${this.price.toFixed(2)}`;
});

// Create the base model
const Product = mongoose.model<IBaseProduct>('Product', baseProductSchema);

// Clothing product schema
const ClothingProduct = Product.discriminator<IClothingProduct>(
  'clothing',
  new Schema({
    availableSizes: {
      type: [String],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one size must be available.',
      },
      default: [],
    },
    availableColors: {
      type: [String],
      default: [],
    },
    fabricOptions: {
      type: [String],
      default: [],
    },
    gender: {
      type: [String],
      default: ['Unisex'],
    },
    minOrderQuantity: {
      type: Number,
      min: [1, 'Minimum order quantity must be at least 1'],
      default: 1,
    },
    weight: {
      type: Number,
      min: 0,
      default: 0,
    },
    dimensions: {
      length: {
        type: Number,
        min: 0,
        default: 0,
      },
      width: {
        type: Number,
        min: 0,
        default: 0,
      },
      height: {
        type: Number,
        min: 0,
        default: 0,
      },
    },
    customizationOptions: {
      allowsLogo: {
        type: Boolean,
        default: false,
      },
      logoPositions: {
        type: [String],
        default: [],
      },
      allowsCustomColors: {
        type: Boolean,
        default: false,
      },
    },
  })
);

// Fabric product schema
const FabricProduct = Product.discriminator<IFabricProduct>(
  'fabric',
  new Schema({
    fabricType: {
      type: String,
      required: true,
      trim: true,
    },
    pattern: {
      type: String,
      required: true,
      default: 'Plain',
    },
    width: {
      type: Number,
      required: true,
      min: 0,
      default: 150,
    },
    composition: {
      type: String,
      required: true,
      default: 'Unknown',
    },
    weight: {
      type: String,
      required: true,
      trim: true,
      default: 'Medium',
    },
    availableColors: {
      type: [String],
      default: [],
    },
    styles: {
      type: [String],
      default: ['Regular'],
    },
    minOrderLength: {
      type: Number,
      min: 1,
      default: 1,
    },
    careInstructions: {
      type: String,
      required: true,
      default: 'Machine wash cold, tumble dry low',
    },
    certifications: {
      type: [String],
      default: [],
    },
  })
);

// Export the model and its discriminators
export { ClothingProduct, FabricProduct };
export default Product;