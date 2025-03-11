import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import config from '../../config';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(config.googleAI.apiKey);

/**
 * Generate response using Google's Gemini API
 * @param messages - Chat messages history
 * @param generationConfig - Configuration for text generation
 * @returns Generated text response
 */
export const generateGeminiResponse = async (
  messages: any[],
  generationConfig: any = {}
): Promise<{ text: string; safetyRatings?: any[] }> => {
  try {
    // Configure Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: {
        temperature: generationConfig?.temperature || 0.7,
        topK: generationConfig?.topK || 40,
        topP: generationConfig?.topP || 0.95,
        maxOutputTokens: generationConfig?.maxOutputTokens || 1024,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    // System prompt for better response context
    const systemPrompt = `
      You are a helpful AI assistant for FabriX, an e-commerce platform specializing in 
      custom clothing and premium fabrics for businesses. Respond to customer queries 
      about clothing, fabrics, orders, pricing, and company policies.
      
      Key facts about FabriX:
      1. Offers custom clothing with minimum order quantities (usually 50 pieces)
      2. Sells premium fabrics with minimum order lengths
      3. Has a logo generator feature for custom branding
      4. Ships worldwide with delivery in 5-10 business days domestically
      5. Production takes 2-3 weeks after order confirmation
      6. Returns accepted within 30 days for non-customized items only
      7. Sample ordering is available for a fee
      
      Provide helpful, accurate, and concise responses. If you don't know something,
      suggest contacting customer service at info@fabrix.com or +1 (555) 123-4567.
    `;

    // Format the history with system prompt included at the beginning
    const formattedMessages = [
      { role: 'model', parts: [{ text: systemPrompt }] },
      ...formatMessagesForGemini(messages)
    ];

    // Use the chat method updated for the newer Gemini API structure
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1), // All but the latest message
    });

    // Get the latest user message
    const latestMessage = formattedMessages[formattedMessages.length - 1];
    
    // Send the message and get the response using the updated API
    const result = await chat.sendMessage(latestMessage.parts[0].text);
    const response = await result.response;
    
    // Extract the response text using the text() method
    const responseText = response.text();

    return {
      text: responseText,
      // Safety ratings might not be available in this format with the newer API
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate response from Gemini: ${errorMessage}`);
  }
};

/**
 * Format messages for Gemini API
 * @param messages - Messages in the client format
 * @returns Messages formatted for Gemini API
 */
const formatMessagesForGemini = (messages: any[]): any[] => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: msg.parts,
  }));
};
