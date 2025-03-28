import app from './src/app';
import mongoose from 'mongoose';
import config from './src/config';

// Define port
const PORT = config.port || 5000;

// Get API key from environment variables
const apiKey = process.env.STABILITY_API_KEY;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) { // Add type annotation here
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to the database before starting the server
connectDB().then(() => {
  // Start the server
  const server = app.listen(PORT, () => {
    console.log(`
      🚀 Server is running!
      🔉 Listening on port ${PORT}
      📭 API endpoint: http://localhost:${PORT}/api
      🔑 Using Stability AI key: ${apiKey ? '✓ Key provided' : '✗ Missing key'}
    `);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => { // Add type annotation here
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
});