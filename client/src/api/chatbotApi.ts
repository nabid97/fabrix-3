import axios from 'axios';

// Message type for chatbot history
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Fallback responses for common questions
const fallbackResponses: Record<string, string> = {
  greeting: "Hello! Welcome to FabriX. How can I help you today?",
  fabric: "We offer premium fabrics including cotton, silk, linen, and synthetic blends. Our fabrics come with minimum order quantities. Would you like more specific information?",
  clothing: "Our custom clothing services include design, sampling, and bulk production with minimum orders of 50 pieces. We specialize in corporate and fashion brand requirements.",
  shipping: "We ship worldwide. Domestic orders typically arrive in 5-10 business days, while international shipping may take 10-20 business days depending on the destination.",
  returns: "We accept returns on non-customized items within 30 days of delivery. Custom orders cannot be returned unless defective.",
  contact: "You can contact our customer service team at support@fabrix.com or call us at +1 (555) 123-4567 during business hours 9am-5pm EST.",
  pricing: "Our pricing depends on quantity, fabric type, and customization requirements. We can provide a detailed quote after understanding your specific needs.",
};

/**
 * Generate AI response using Gemini API
 * 
 * @param userMessage The current user message
 * @param chatHistory Previous messages in the conversation
 * @returns AI generated response
 */
export const generateAIResponse = async (
  userMessage: string,
  chatHistory: Message[]
): Promise<string> => {
  try {
    // Try to get a quick response from predefined fallbacks first
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) return quickResponse;
    
    // Format chat history for the API
    const formattedHistory = chatHistory
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }))
      .slice(-5); // Only use the last 5 messages for context
    
    // Add current user message
    const messages = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];
    
    // Try calling the API with a timeout
    const response = await axios.post('/api/chat/gemini', {
      messages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }, { 
      timeout: 10000  // 10 second timeout
    });
    
    // Check if we got a valid response
    if (response.data && typeof response.data.text === 'string') {
      return response.data.text;
    }
    
    // If response structure is unexpected, return fallback
    return getFallbackResponse(userMessage);
    
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Return a fallback response based on the content
    return getFallbackResponse(userMessage);
  }
};

/**
 * Get a quick response if the query matches known patterns
 */
function getQuickResponse(userMessage: string): string | null {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.match(/hello|hi|hey|greetings/i)) {
    return fallbackResponses.greeting;
  }
  
  if (lowerMsg.match(/contact|email|phone|support|help desk/i)) {
    return fallbackResponses.contact;
  }
  
  // No quick match
  return null;
}

/**
 * Get a fallback response based on the message content
 */
function getFallbackResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check for topic matches
  if (lowerMsg.includes('fabric') || lowerMsg.includes('material')) {
    return fallbackResponses.fabric;
  }
  
  if (lowerMsg.includes('cloth') || lowerMsg.includes('garment') || lowerMsg.includes('apparel')) {
    return fallbackResponses.clothing;
  }
  
  if (lowerMsg.includes('ship') || lowerMsg.includes('deliver')) {
    return fallbackResponses.shipping;
  }
  
  if (lowerMsg.includes('return') || lowerMsg.includes('refund')) {
    return fallbackResponses.returns;
  }
  
  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('fee')) {
    return fallbackResponses.pricing;
  }
  
  // Default fallback
  return "Thank you for your message. Our system is currently processing your request. For immediate assistance, please contact our customer service team at support@fabrix.com or call +1 (555) 123-4567.";
}

/**
 * Determine if conversation should be redirected to human support
 */
export const shouldRedirectToContactForm = (
  userMessage: string,
  chatHistory: Message[]
): boolean => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Check for explicit requests for human assistance
  if (lowerMsg.includes('speak to human') || 
      lowerMsg.includes('talk to agent') || 
      lowerMsg.includes('customer service') ||
      lowerMsg.includes('customer support') ||
      lowerMsg.includes('speak to someone') ||
      lowerMsg.includes('real person')) {
    return true;
  }
  
  // Check for repeated questions that indicate frustration
  const userMessages = chatHistory
    .filter(msg => msg.sender === 'user')
    .map(msg => msg.text.toLowerCase());
  
  if (userMessages.length >= 3) {
    const lastThreeQuestions = userMessages.slice(-3);
    // Check if questions are very similar (indicating repetition/frustration)
    if (lastThreeQuestions.some(q => 
        lowerMsg.includes(q) || q.includes(lowerMsg) ||
        levenshteinDistance(q, lowerMsg) < 10)) {
      return true;
    }
  }
  
  return false;
};

/**
 * Helper function to calculate string similarity
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1, // substitution
          matrix[i][j-1] + 1,   // insertion
          matrix[i-1][j] + 1    // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Get FAQ-based response for common questions
 * 
 * @param userMessage The current user message
 * @returns FAQ response if available, null otherwise
 */
export const getQuickFAQResponse = (userMessage: string): string | null => {
  // Map of common questions and quick responses
  const faqResponses: Record<string, string> = {
    'shipping': 'We offer worldwide shipping with delivery times varying by location. Orders typically arrive within 5-10 business days domestically and 10-20 business days internationally.',
    'return': 'Our return policy allows returns within 30 days for standard catalog items without customization. Custom orders can only be returned if there is a manufacturing defect.',
    'minimum order': 'Our minimum order quantity for clothing typically starts at 50 pieces per style and color. For fabrics, minimum order lengths vary by product.',
    'payment methods': 'We accept all major credit cards, PayPal, and bank transfers for larger orders. For corporate clients, we also offer net 30 payment terms subject to credit approval.',
    'samples': 'Yes, we offer sample services for a nominal fee. Sample costs are credited toward your final order if you proceed with a bulk purchase.',
    'production time': 'Production time is typically 2-3 weeks after order confirmation and artwork approval. For large orders or custom fabrics, it may take 3-4 weeks.',
    'track order': 'You can track your order by logging into your account on our website or using the tracking number provided in your shipping confirmation email.',
  };
  
  // Check if the user message contains any FAQ keywords
  const lowerCaseMessage = userMessage.toLowerCase();
  for (const [keyword, response] of Object.entries(faqResponses)) {
    if (lowerCaseMessage.includes(keyword)) {
      return response;
    }
  }
  
  // No matching FAQ found
  return null;
};