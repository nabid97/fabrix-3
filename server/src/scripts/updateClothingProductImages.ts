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

const updateClothingProductImages = async () => {
  // Connect to database
  await connectDB();
  
  // Clothing name to image mapping - using name instead of type
  const clothingImages: Record<string, string> = {
    'Premium Polo Shirt': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/premium-polo-shirt.jpg`,
    'Business Oxford Shirt': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/business-shirt.jpg`,
    'Custom T-Shirt': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/classic-tshirt.jpg`,
    'Branded Hoodie': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/pullover-hoodie.jpg`,
    'Corporate Softshell Jacket': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/softshell-jacket.jpg`,
    'Embroidered Cap': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/structured-cap.jpg`,
    'Quarter-Zip Pullover': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/quarter-zip-pullover.jpg`,
    'Performance Vest': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/clothing/performance-vest.jpg`
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
        // Update images array - your schema uses images (plural) not imageUrl
        product.images = [clothingImages[productName]];
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