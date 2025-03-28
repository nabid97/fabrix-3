const { GoogleGenerativeAI } = require('@google/generative-ai');

// Handler for /api/chat/gemini endpoint
exports.handler = async (req, res) => {
  try {
    console.log('Gemini API endpoint called');
    
    // Check for proper request body
    if (!req.body || !req.body.messages) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields in request body' 
      });
    }
    
    // Get API key from environment variables
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Missing API key');
      return res.status(500).json({
        success: false, 
        message: 'API key not configured'
      });
    }
    
    // Extract only the necessary parts from the request
    const { messages, generationConfig } = req.body;
    
    // Initialize the Generative AI model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prepare history and latest message
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));
    
    const latestMessage = messages[messages.length - 1].parts[0].text;
    
    // Generate content with error handling
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: latestMessage }] }],
      generationConfig: {
        temperature: generationConfig.temperature || 0.7,
        topK: generationConfig.topK || 40,
        topP: generationConfig.topP || 0.95,
        maxOutputTokens: generationConfig.maxOutputTokens || 1024,
      },
    });
    
    const response = result.response;
    const text = response.text();
    
    // Return successful response
    return res.status(200).json({
      success: true,
      text: text
    });
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Return helpful error response
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to generate AI response',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};