import mongoose from 'mongoose';
import { config } from 'dotenv';
import ClothingProduct from '../models/Product'; // Adjust to your actual model

// Load environment variables
config();

const setImageUrls = async () => {
  try {
    // Hardcode connection string for this one-time script
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fabrix';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get all products
    const products = await ClothingProduct.find();
    console.log(`Found ${products.length} products to update`);
    
    // Process each product
    for (const product of products) {
      // Use the first image in the images array for imageUrl
      if (product.images && product.images.length > 0) {
        product.imageUrl = product.images[0];
        await product.save();
        console.log(`Updated imageUrl for ${product.name}: ${product.imageUrl}`);
      }
    }
    
    console.log('All imageUrls updated successfully');
  } catch (error) {
    console.error('Error updating imageUrls:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

setImageUrls();