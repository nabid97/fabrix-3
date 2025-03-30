import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Product from './models/Product';
import Order from './models/Order';
import config from './config';

// Sample data
import users from './data/users';
import clothingProducts from './data/clothingProducts';
import fabricProducts from './data/fabricProducts';

// Load environment variables
dotenv.config();

// Connect to database
mongoose.connect(config.mongoURI);

// Import data into the database
const importData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    // Add admin user reference and ensure unique IDs for products
    const clothingProductsWithUser = clothingProducts.map(product => {
      return {
        ...product,
        user: adminUser,
        basePrice: product.price, // Map `price` to `basePrice` for consistency
        type: 'clothing', // Add type for clothing products
        // Ensure imageUrl exists by using the first image from the images array or a default value
        imageUrl: product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      };
    });

    const fabricProductsWithUser = fabricProducts.map(product => {
      return {
        ...product,
        user: adminUser,
        basePrice: product.price, // Map `price` to `basePrice` for consistency
        type: 'fabric', // Add type for fabric products
        fabricType: product.fabricType || 'Unknown',
        pattern: product.pattern || 'Plain',
        width: product.width || 150,
        careInstructions: product.careInstructions || 'Machine wash cold, tumble dry low',
        // Ensure imageUrl exists by using the first image from the images array or a default value
        imageUrl: product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
      };
    });

    // Insert products
    await Product.insertMany([...clothingProductsWithUser, ...fabricProductsWithUser]);

    console.log('\x1b[32m%s\x1b[0m', 'Data imported!');
    process.exit();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error: ${error}`);
    process.exit(1);
  }
};

// Destroy all data in the database
const destroyData = async () => {
  try {
    // Clear all existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('\x1b[31m%s\x1b[0m', 'Data destroyed!');
    process.exit();
  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', `Error: ${error}`);
    process.exit(1);
  }
};

// Determine which function to run based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}