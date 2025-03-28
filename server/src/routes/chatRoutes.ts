import express from 'express';
import { generateChatResponse, getFAQResponse, listAvailableModels } from '../controllers/chatController';

const router = express.Router();

// Routes
router.post('/gemini', generateChatResponse);
router.get('/faq', getFAQResponse);
router.get('/models', listAvailableModels); // This route is already set up

export default router;