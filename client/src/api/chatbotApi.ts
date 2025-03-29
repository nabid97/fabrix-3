import axios from 'axios';

// Message type for chatbot history
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// FAQ types
interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  name: string;
  faqs: FAQ[];
}

// Fallback responses for common questions
// Removed unused fallbackResponses to resolve the compile error

/**
 * Generate AI response using Gemini API
 * 
 * @param userMessage The current user message
 * @param chatHistory Previous messages in the conversation
 * @param faqCategories List of FAQ categories
 * @returns AI generated response
 */
export const generateAIResponse = async (
  userMessage: string,
  chatHistory: Message[],
  faqCategories: FAQCategory[]
): Promise<string> => {
  try {
    // Format FAQ context to be more structured
    const formattedFaqContext = faqCategories.map(category => {
      return `CATEGORY: ${category.name.toUpperCase()}
${category.faqs.map(faq => `Q: ${faq.question}
A: ${faq.answer}`).join('\n\n')}`;
    }).join('\n\n');
    
    // Define the system message
    const systemMessage = {
      role: 'system',
      parts: [
        {
          text: `You are a customer service chatbot for Fabrix, a company that offers premium fabrics and custom clothing services. Answer ONLY questions related to Fabrix using the FAQ information below. If a question isn't covered in the FAQ, politely explain you don't have that specific information and suggest contacting customer support.

FAQ INFORMATION:
${formattedFaqContext}

When answering, be concise, helpful, and friendly. Only use information from the FAQ above.`
        }
      ]
    };
    
    // Format chat history
    const formattedHistory = chatHistory
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }))
      .slice(-5);
    
    // Combine all messages
    const messages = [
      systemMessage,
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ];
    
    // Make API call
    const response = await axios.post('/api/chat/gemini', {
      messages,
      generationConfig: {
        temperature: 0.4,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    }, { timeout: 15000 });
    
    // Return response
    if (response.data && typeof response.data.text === 'string') {
      return response.data.text;
    }
    
    throw new Error("Invalid response format from API");
  } catch (error) {
    console.error(`API request failed:`, error);
    return "I'm sorry, but I'm having trouble connecting to the server right now. Please try again later or contact our customer support team.";
  }
};

/**
 * Get a quick response if the query matches known patterns
 */

/**
 * Get a fallback response based on the message content
 */

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