import mongoose from 'mongoose';
import { config } from 'dotenv';
import ClothingProduct from '../models/Product'; // Adjust to your actual model

// Load environment variables
config();

const fixImageUrls = async () => {
  try {
    // Hardcode connection string for this one-time script
    // ⚠️ Replace with your actual MongoDB connection string
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fabrix';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get all products
    const products = await ClothingProduct.find();
    console.log(`Found ${products.length} products to fix`);
    
    // Process each product
    for (const product of products) {
      // Fix main imageUrl
      if (product.imageUrl) {
        const originalUrl = product.imageUrl;
        product.imageUrl = product.imageUrl
          .replace(/^https:\/\/https:\/\//, 'https://')
          .replace(/\.s3\.us-east-1\.amazonaws\.com\.s3\.us-east-1\.amazonaws\.com/, 
                  '.s3.us-east-1.amazonaws.com');
        
        if (originalUrl !== product.imageUrl) {
          console.log(`Fixed imageUrl for ${product.name}: ${product.imageUrl}`);
        }
      }
      
      // Fix images array
      if (product.images && product.images.length) {
        product.images = product.images.map(url => {
          const originalUrl = url;
          const fixedUrl = url
            .replace(/^https:\/\/https:\/\//, 'https://')
            .replace(/\.s3\.us-east-1\.amazonaws\.com\.s3\.us-east-1\.amazonaws\.com/, 
                    '.s3.us-east-1.amazonaws.com');
          
          if (originalUrl !== fixedUrl) {
            console.log(`Fixed image in array: ${fixedUrl}`);
          }
          
          return fixedUrl;
        });
      }
      
      // Save fixed product
      await product.save();
      console.log(`Fixed product: ${product.name}`);
    }
    
    console.log('All image URLs fixed successfully');
  } catch (error) {
    console.error('Error fixing image URLs:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

fixImageUrls();