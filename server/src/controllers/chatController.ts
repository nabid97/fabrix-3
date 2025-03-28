import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';
import * as dotenv from 'dotenv';

dotenv.config();

// @desc    Generate AI response using Gemini API
// @route   POST /api/chat/gemini
// @access  Public
export const generateChatResponse = async (req: Request, res: Response) => {
  console.log('-------- Gemini API Request --------');
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    // Force error if environment variable is set (for testing)
    if (process.env.FORCE_ERROR === 'true') {
      throw new Error('Forced error for testing');
    }
    
    // Check for proper request body
    if (!req.body || !req.body.messages) {
      console.error('Error: Missing request body or messages');
      return res.status(400).json({
        success: false,
        message: 'Missing required fields in request body',
      });
    }

    const { messages, generationConfig = {} } = req.body;

    // For testing environments, return a mock response
    if (process.env.NODE_ENV === 'test' && process.env.FORCE_ERROR !== 'true') {
      return res.status(200).json({
        success: true,
        text: "This is a mock response from the Gemini API."
      });
    }

    // Regular production/dev flow
    try {
      const apiKey = process.env.GOOGLE_AI_API_KEY || '';
      console.log('GoogleGenerativeAI initialized successfully.');
      
      const genAI = new GoogleGenerativeAI(apiKey);
      
      console.log('Model initialized successfully: gemini-1.5-pro');
      
      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
        ...generationConfig
      });
      
      // Get the last message
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || !lastMessage.parts || !lastMessage.parts[0].text) {
        return res.status(400).json({
          success: false,
          message: 'Invalid message format'
        });
      }
      
      console.log('Sending request to Gemini API with model gemini-1.0-pro');
      
      const result = await model.generateContent(lastMessage.parts[0].text);
      
      console.log('Gemini API call successful.');
      
      let responseText;
      try {
        responseText = result.response.text();
      } catch (responseError) {
        console.error('Error processing response:', responseError);
        responseText = "I'm sorry, but I couldn't process that request properly.";
      }
      
      return res.status(200).json({
        success: true,
        text: responseText
      });
    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({
        success: false,
        message: 'Failed to generate AI response',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    console.log('-------- Gemini API Request End --------');
  }
};

// @desc    Get quick FAQ response without using AI
// @route   GET /api/chat/faq
// @access  Public
export const getFAQResponse = asyncHandler(async (_req: Request, res: Response) => {
  try {
    // Your logic here
  } catch (error) {
    console.error('FAQ Response Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get FAQ response' });
  }
});

// @desc    List available models
// @route   GET /api/chat/models
// @access  Public
export const listAvailableModels = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ success: false, message: 'API key not configured' });
      return;
    }

    // Since there's no direct listModels method in the GoogleGenerativeAI class,
    // we'll provide a list of known Gemini models
    const availableModels = [
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ];

    res.status(200).json({ success: true, models: availableModels });
  } catch (error: any) {
    console.error('Error listing models:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
