import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { generateChatResponse } from './controllers/chatController';
import productRoutes from './routes/productRoutes';
import paymentRoutes from './routes/paymentRoutes';
import orderRoutes from './routes/orderRoutes';
import recommendationsRoutes from './routes/recommendationRoutes';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Basic route for health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online',
    message: 'Fabrix API is running'
  });
});

// Chat API route
app.post('/api/chat/gemini', generateChatResponse);

// API Routes - all using the same import style
app.use('/api/products', productRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recommendations', recommendationsRoutes);

// Error handling middleware - must be the last one
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export { app };
