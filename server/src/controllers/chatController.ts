import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import asyncHandler from 'express-async-handler';

// @desc    Generate AI response using Gemini API
// @route   POST /api/chat/gemini
// @access  Public
export const generateChatResponse = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log('-------- Gemini API Request --------');
    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Check for proper request body
    if (!req.body || !req.body.messages) {
      console.error('Error: Missing request body or messages');
      res.status(400).json({
        success: false,
        message: 'Missing required fields in request body',
      });
      return;
    }

    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Error: Missing API key');
      res.status(500).json({
        success: false,
        message: 'API key not configured',
      });
      return;
    }

    // Extract from the request
    const { messages, generationConfig } = req.body;
    const latestMessage = messages[messages.length - 1].parts[0].text;

    // Initialize the Generative AI model
    let genAI;
    try {
      genAI = new GoogleGenerativeAI(apiKey);
      console.log('GoogleGenerativeAI initialized successfully.');
    } catch (genAIError: any) {
      console.error('Error initializing GoogleGenerativeAI:', genAIError);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize GoogleGenerativeAI',
        error: genAIError.message,
      });
      return;
    }

    let model;
    try {
      // Use a valid model name from the list
      model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      console.log('Model initialized successfully: gemini-1.5-pro');
    } catch (modelError: any) {
      console.error('Error initializing model:', modelError);
      res.status(500).json({
        success: false,
        message: 'Failed to initialize model',
        error: modelError.message,
      });
      return;
    }

    console.log('Sending request to Gemini API with model gemini-1.0-pro');

    // Generate content
    let result;
    try {
      result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: latestMessage }] }],
        generationConfig: {
          temperature: generationConfig?.temperature || 0.7,
          maxOutputTokens: generationConfig?.maxOutputTokens || 1024,
        },
      });
      console.log('Gemini API call successful.');
    } catch (generateContentError: any) {
      console.error('Error calling generateContent:', generateContentError);
      res.status(500).json({
        success: false,
        message: 'Failed to generate content',
        error: generateContentError.message,
      });
      return;
    }

    let response;
    try {
      response = await result.response;
      const text = response.text();
      console.log('Received response from Gemini, length:', text.length);

      // Return successful response
      res.status(200).json({
        success: true,
        text: text,
      });
    } catch (responseError: any) {
      console.error('Error processing response:', responseError);
      res.status(500).json({
        success: false,
        message: 'Failed to process response',
        error: responseError.message,
      });
      return;
    }
  } catch (outerError: any) {
    console.error('Outer Gemini API error:', outerError);

    // Return helpful error response
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to generate AI response',
      error: outerError.message,
      errorType: outerError.constructor.name,
      stack: process.env.NODE_ENV === 'development' ? outerError.stack : undefined,
    });
  } finally {
    console.log('-------- Gemini API Request End --------');
  }
});

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
