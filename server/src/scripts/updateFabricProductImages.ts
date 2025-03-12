import mongoose from 'mongoose';
import { FabricProduct } from '../models/Product';
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

const S3_BUCKET = process.env.S3_BUCKET || 'fabrix-assets';
const S3_REGION = process.env.S3_REGION || 'us-east-1';

const updateFabricProductImages = async () => {
  // Connect to database
  await connectDB();
  
  // Map product names to image URLs instead of types
  const fabricNameToImageMap: Record<string, string> = {
    'Premium Cotton Twill': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton.jpg`,
    'Performance Polyester': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Polyester.jpg`,
    'Cotton-Poly Blend Pique': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton-Poly.jpg`,
    'Organic Cotton Jersey': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Organic-Cotton.jpg`,
    'Technical Softshell': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Softshell.jpg`,
    'Heavyweight Oxford': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Oxford.jpg`,
    'Micro Fleece': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Fleece.jpg`,
    'Stretch Poplin': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Poplin.jpg`,
    'Recycled Polyester Canvas': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Recycled-Polyester.jpg`,
    'Bamboo Blend Jersey': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Bamboo.jpg`,
  };
  
  // Generic fabric keywords to images - used for fallback matching
  const fabricKeywordToImageMap: Record<string, string> = {
    'Cotton': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton.jpg`,
    'Polyester': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Polyester.jpg`,
    'Silk': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Silk.jpg`,
    'Wool': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Wool.jpg`,
    'Linen': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Linen.jpg`,
    'Blend': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton-Poly.jpg`,
    'Organic': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Organic-Cotton.jpg`,
    'Softshell': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Softshell.jpg`,
    'Oxford': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Oxford.jpg`,
    'Fleece': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Fleece.jpg`,
    'Poplin': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Poplin.jpg`,
    'Recycled': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Recycled-Polyester.jpg`,
    'Bamboo': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Bamboo.jpg`,
    'Jersey': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton.jpg`, // Default to cotton for jersey
    'Canvas': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Recycled-Polyester.jpg`, // Default to polyester for canvas
    'Twill': `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/Cotton.jpg`, // Default to cotton for twill
  };
  
  try {
    // Find all fabric products
    const fabricProducts = await FabricProduct.find();
    console.log(`Found ${fabricProducts.length} fabric products`);
    
    // Debug: Print the first product to see its structure
    if (fabricProducts.length > 0) {
      const sample = fabricProducts[0];
      console.log('Sample product structure:', JSON.stringify({
        id: sample._id,
        name: sample.name,
        type: sample.type, // This is the discriminator type
        fabricType: sample.fabricType // This should now be fabricType
      }, null, 2));
    }
    
    let updatedCount = 0;
    
    for (const product of fabricProducts) {
      // Use fabricType instead of type
      const fabricType = product.fabricType;
      
      const productName = product.name;
      
      // Step 1: Try direct match by product name
      if (fabricNameToImageMap[productName]) {
        product.images = [fabricNameToImageMap[productName]]; // Store in images array
        await product.save();
        updatedCount++;
        console.log(`✅ Updated image for ${productName} (direct match)`);
        continue;
      }
      
      // Step 2: Try to find a keyword match in the product name
      let matchFound = false;
      
      for (const [keyword, imageUrl] of Object.entries(fabricKeywordToImageMap)) {
        if (productName.includes(keyword)) {
          product.images = [imageUrl];
          await product.save();
          updatedCount++;
          console.log(`✅ Updated image for ${productName} (keyword match: ${keyword})`);
          matchFound = true;
          break;
        }
      }
      
      if (!matchFound) {
        // Step 3: Last resort - assign a default generic fabric image
        product.images = [`https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/fabrics/generic-fabric.jpg`];
        await product.save();
        updatedCount++;
        console.log(`⚠️ Updated with generic image for ${productName} (no specific match)`);
      }
    }
    
    console.log(`Fabric product image update complete! Updated ${updatedCount} products.`);
  } catch (error) {
    console.error('Error updating fabric products:', error);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
updateFabricProductImages();