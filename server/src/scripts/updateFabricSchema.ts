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

const migrateFabricTypeField = async () => {
  // Connect to database
  await connectDB();
  
  try {
    // Use the native MongoDB driver to update all documents
    // This bypasses Mongoose validation which would prevent updating a non-existent field
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    const result = await mongoose.connection.db.collection('products')
      .updateMany(
        { __t: 'fabric' },
        { $rename: { 'type': 'fabricType' } }
      );
    
    console.log(`Migration complete! Modified ${result.modifiedCount} documents.`);
  } catch (error) {
    console.error('Error migrating fabric type field:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the migration
migrateFabricTypeField();