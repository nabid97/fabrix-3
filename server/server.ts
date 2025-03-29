import {app}from './src/app';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

// Define port
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Get API key from environment variables
const apiKey = process.env.STABILITY_API_KEY;

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://nabid1997:Hesoyam@fabrix.eajok.mongodb.net/?retryWrites=true&w=majority&appName=fabrix',);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
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

  // Properly typed route logger for TypeScript
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
        .filter((method) => middleware.route.methods[method])
        .join(', ')
        .toUpperCase();
      console.log(`${methods} ${middleware.route.path}`);
    }
  });

  // Log all registered routes
  console.log('\n=== REGISTERED ROUTES ===');
  console.log(listEndpoints(app));
  console.log('========================\n');

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);

    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });
});