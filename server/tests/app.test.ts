import request from 'supertest';
import express from 'express';
import { app } from '../src/app';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Update the mock section
jest.mock('@google/generative-ai', () => {
  // Create a mock that returns a predefined text response
  const mockText = jest.fn().mockReturnValue("This is a mock response from the Gemini API.");
  
  const mockResponse = {
    text: mockText
  };
  
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: mockResponse
  });

  const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent
  });

  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }))
  };
});

describe('Server API Tests', () => {
  // Health check endpoint
  describe('GET /', () => {
    it('should return 200 OK with API status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'online');
      expect(response.body).toHaveProperty('message', 'Fabrix API is running');
    });
  });

  // Chat API endpoint
  describe('POST /api/chat/gemini', () => {
    it('should return a successful response from the chatbot', async () => {
      const requestBody = {
        messages: [
          {
            role: 'user',
            parts: [{ text: 'Tell me about your shipping options' }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };

      const response = await request(app)
        .post('/api/chat/gemini')
        .send(requestBody)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('text');
      expect(typeof response.body.text).toBe('string');
    });

    it('should return 400 if messages are missing', async () => {
      const response = await request(app)
        .post('/api/chat/gemini')
        .send({ generationConfig: { temperature: 0.7 } })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Missing required fields in request body');
    });
  });

  // Error handling
  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });

    it('should handle server errors with proper status code', async () => {
      // Set a specific environment variable to trigger an error
      process.env.FORCE_ERROR = 'true';
      
      const response = await request(app)
        .post('/api/chat/gemini')
        .send({
          messages: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      
      // Clean up
      delete process.env.FORCE_ERROR;
    });
  });

  // Performance testing
  describe('Performance', () => {
    it('should respond to requests within acceptable time limits', async () => {
      const startTime = Date.now();
      
      await request(app).get('/');
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(200); // Response should come back in under 200ms
    });
  });

  // API key validation
  describe('API Key Validation', () => {
    it('should validate that API key is properly configured', () => {
      expect(process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY).toBeDefined();
    });
  });

  // Mock environment variables for test
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { 
      ...OLD_ENV,
      NODE_ENV: 'test',
      GOOGLE_AI_API_KEY: 'test-api-key'
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });
});

describe('Chat Controller Unit Tests', () => {
  // Import the controller directly for unit testing
  const { generateChatResponse } = require('../src/controllers/chatController');

  it('should process chat messages correctly', async () => {
    // Mock Express request and response
    const req = {
      body: {
        messages: [
          {
            role: 'user',
            parts: [{ text: 'What fabrics do you offer?' }]
          }
        ],
        generationConfig: {
          temperature: 0.7
        }
      }
    };
    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await generateChatResponse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        text: expect.any(String)
      })
    );
  });

  it('should handle errors gracefully', async () => {
    // Force an error by providing invalid request
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await generateChatResponse(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false
      })
    );
  });
});
