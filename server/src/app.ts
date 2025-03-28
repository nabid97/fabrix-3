import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { generateChatResponse } from './controllers/chatController';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic route for health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'online',
    message: 'Fabrix API is running'
  });
});

// Chat API route - MUST be before the 404 handler
app.post('/api/chat/gemini', generateChatResponse);

// Error handling middleware - must be the last one
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

export { app };
