import mongoose from 'mongoose';
import { ClothingProduct } from '../models/Product';
import config from '../config';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Get S3 bucket details from environment variables
const S3_BUCKET = process.env.S3_BUCKET || 'fabrix-assets';
const S3_REGION = process.env.S3_REGION || 'us-east-1';

// Use the standard S3 URL format that doesn't rely on DNS resolution
const getS3Url = (path: string) => `https://s3.${S3_REGION}.amazonaws.com/${S3_BUCKET}/${path}`;

const updateClothingProductImages = async () => {
  // Connect to database
  await connectDB();
  
  // Clothing name to image mapping - using direct S3 URL format
  const clothingImages: Record<string, string> = {
    'Premium Polo Shirt': getS3Url('clothing/premium-polo-shirt.jpg'),
    'Business Oxford Shirt': getS3Url('clothing/business-shirt.jpg'),
    'Custom T-Shirt': getS3Url('clothing/classic-tshirt.jpg'),
    'Branded Hoodie': getS3Url('clothing/pullover-hoodie.jpg'),
    'Corporate Softshell Jacket': getS3Url('clothing/softshell-jacket.jpg'),
    'Embroidered Cap': getS3Url('clothing/structured-cap.jpg'),
    'Quarter-Zip Pullover': getS3Url('clothing/quarter-zip-pullover.jpg'),
    'Performance Vest': getS3Url('clothing/performance-vest.jpg')
  };
  
  try {
    // Find all clothing products
    const clothingProducts = await ClothingProduct.find();
    console.log(`Found ${clothingProducts.length} clothing products`);
    
    let updatedCount = 0;
    
    for (const product of clothingProducts) {
      // Use product name instead of type
      const productName = product.name;
      
      // Check if we have an image for this product name
      if (clothingImages[productName]) {
        // Update the images array
        product.images = [clothingImages[productName]];
        // If we need imageUrl, we should use a more type-safe approach
        (product as any).imageUrl = clothingImages[productName]; // Type assertion as a workaround
        await product.save();
        updatedCount++;
        console.log(`✅ Updated images for ${productName}`);
      } else {
        console.log(`❓ No image found for product name: "${productName}"`);
      }
    }
    
    console.log(`Clothing product image update complete! Updated ${updatedCount} products.`);
  } catch (error) {
    console.error('Error updating clothing products:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateClothingProductImages();