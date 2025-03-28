import { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { generateAIResponse } from '../api/chatbotApi';
import { faqCategories } from '../pages/FAQPage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (text: string) => Promise<void>;
  toggleChatbot: () => void;
  resetChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

interface ChatbotProviderProps {
  children: ReactNode;
}

// List of topics the chatbot should not answer
const restrictedTopics = [
  'politics', 'religion', 'medical advice', 'legal advice', 
  'financial advice', 'adult content', 'gambling', 'cryptocurrency',
  'personal data', 'hacking', 'weapons', 'drugs', 'violence'
];

// Function to check if a message is about restricted topics
const isRestrictedTopic = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return restrictedTopics.some(topic => lowerMessage.includes(topic));
};

// Function to check if a message is about Fabrix business
const isAboutFabrix = (message: string): boolean => {
  const fabrixTopics = [
    'fabric', 'clothing', 'order', 'shipping', 'return', 'custom', 
    'design', 'price', 'payment', 'sample', 'quality', 'material',
    'delivery', 'tracking', 'size', 'color', 'brand', 'fabrix',
    'ship', 'deliver', 'track', 'package', 'international'
  ];
  
  const lowerMessage = message.toLowerCase();
  
  // Check if any fabrix topic is in the message
  return fabrixTopics.some(topic => lowerMessage.includes(topic));
};

export const ChatbotProvider = ({ children }: ChatbotProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! Welcome to FabriX. I can answer questions about our fabric products, custom clothing services, ordering, shipping, and returns. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // First, check for direct FAQ matches
      const directMatch = findMatchingFAQ(text);
      if (directMatch) {
        console.log("Found direct FAQ match");
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: directMatch,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Get current messages for context
      let currentMessages: Message[] = [];
      setMessages(prev => {
        currentMessages = prev;
        return prev;
      });

      // Check if message is about restricted topics
      if (isRestrictedTopic(text)) {
        const restrictedMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm sorry, but I can only answer questions related to Fabrix products and services. For other topics, please contact our customer support team.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, restrictedMessage]);
        return;
      }
      
      // If message doesn't seem to be about Fabrix
      if (!isAboutFabrix(text) && text.length > 10) {
        const offTopicMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm here to help with questions about Fabrix products, services, ordering, and policies. How can I assist you with your fabric or clothing needs today?",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, offTopicMessage]);
        return;
      }

      console.log("Sending message to AI:", text);
      
      // Send message to AI model and get response
      const response = await generateAIResponse(text, currentMessages, faqCategories);
      console.log("Received response from AI:", response);
      
      // Check if response indicates the AI couldn't answer the question
      let finalResponse = response;
      if (indicatesUnableToAnswer(response)) {
        finalResponse = `I don't have enough information to answer this specific question about ${extractTopic(text)}. For more detailed information, please contact our customer support at support@fabrix.com or call +1 (555) 123-4567.`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: finalResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble responding right now. Would you like to fill out our contact form for assistance from our team?",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to check if the response indicates inability to answer
  const indicatesUnableToAnswer = (response: string): boolean => {
    const lowerResponse = response.toLowerCase();
    const uncertaintyPhrases = [
      "i don't know", 
      "i don't have information", 
      "i'm not sure", 
      "i can't answer", 
      "i don't have enough information",
      "i'm unable to provide",
      "i cannot provide",
      "i don't have access to",
      "i don't have specific details",
      "without more information",
      "would need to know more",
      "no information available"
    ];
    
    return uncertaintyPhrases.some(phrase => lowerResponse.includes(phrase));
  };

  // Function to extract the likely topic from the user's message
  const extractTopic = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    const topics = {
      "shipping": ["shipping", "delivery", "arrive", "shipment"],
      "orders": ["order", "purchase", "buy"],
      "returns": ["return", "refund", "money back"],
      "fabric types": ["cotton", "silk", "linen", "polyester", "fabric type"],
      "sizing": ["size", "measurement", "dimension", "fit"],
      "pricing": ["price", "cost", "fee", "pricing"],
      "customization": ["custom", "customize", "personalize", "tailor"],
      "production time": ["how long", "production time", "lead time", "timeline"]
    };
    
    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return topic;
      }
    }
    
    return "this topic";
  };

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  const resetChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hi there! Welcome to FabriX. How can I help you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  };

  // Add this function to your ChatbotContext.tsx file
  const findMatchingFAQ = (query: string): string | null => {
    // Normalize the query
    const normalizedQuery = query.toLowerCase().trim();
    
    // Keywords to match to specific FAQ categories
    const categoryKeywords: Record<string, string[]> = {
      'shipping': ['ship', 'deliver', 'shipping', 'delivery', 'track', 'shipment', 'tracking'],
      'ordering': ['order', 'minimum', 'quantity', 'cancel', 'modification', 'payment', 'fulfill'],
      'returns': ['return', 'exchange', 'refund', 'defect', 'broken'],
      'products': ['fabric', 'sample', 'design', 'quality', 'size', 'custom', 'eco-friendly'],
      'account': ['account', 'login', 'data', 'privacy', 'design', 'save']
    };
    
    // Find potential matching category
    let targetCategoryId: string | null = null;  // Add explicit type here
    for (const [catId, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        targetCategoryId = catId;
        break;
      }
    }
    
    if (!targetCategoryId) return null;
    
    // Find the category
    const category = faqCategories.find(cat => cat.id === targetCategoryId);
    if (!category) return null;
    
    // Find the best matching FAQ in that category
    let bestMatch = null;
    let highestScore = 0;
    
    for (const faq of category.faqs) {
      const questionWords = faq.question.toLowerCase().split(/\s+/);
      const answerWords = faq.answer.toLowerCase().split(/\s+/);
      
      // Calculate simple match score
      const queryWords = normalizedQuery.split(/\s+/);
      const matchingQuestionWords = queryWords.filter(word => 
        questionWords.some(qw => qw.includes(word) || word.includes(qw))
      );
      const matchingAnswerWords = queryWords.filter(word => 
        answerWords.some(aw => aw.includes(word) || word.includes(aw))
      );
      
      const score = (matchingQuestionWords.length * 2) + matchingAnswerWords.length;
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq.answer;
      }
    }
    
    // Only return if we have a reasonable match
    return highestScore >= 2 ? bestMatch : null;
  }

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        sendMessage,
        toggleChatbot,
        resetChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;