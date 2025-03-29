import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const config = {
  // MongoDB Configuration
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://nabid1997:Hesoyam@fabrix.eajok.mongodb.net/?retryWrites=true&w=majority&appName=fabrix',

  // AWS Configuration
  aws: {
    s3Bucket: process.env.AWS_S3_BUCKET || 'ecommerce-website-generated-logo-2025',
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },

  // Stripe Configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    user: process.env.EMAIL_USER || 'user@example.com',
    password: process.env.EMAIL_PASSWORD || 'password',
    from: process.env.EMAIL_FROM || 'support@fabrix.com',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_default_jwt_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Stability AI Configuration
  stabilityAI: {
    apiKey: process.env.STABILITY_AI_API_KEY || '',
  },

  // Google AI Configuration
  googleAI: {
    apiKey: process.env.GOOGLE_AI_API_KEY || '',
  },

  // Server Configuration
  server: {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // CORS Configuration
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
  },

  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;