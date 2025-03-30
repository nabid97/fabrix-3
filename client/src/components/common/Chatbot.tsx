import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useChatbot } from '../../contexts/ChatbotContext';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';
import { IoPaperPlaneOutline, IoRefreshOutline } from 'react-icons/io5';

const Chatbot: React.FC = () => {
  const { messages, isOpen, isLoading, sendMessage, toggleChatbot, resetChat } = useChatbot();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      sendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const renderMessages = () => {
    return messages.map((message) => (
      <div
        key={message.id}
        className={`mb-4 ${
          message.sender === 'user'
            ? 'ml-auto bg-teal-600 text-white' // User message: white text
            : 'mr-auto bg-gray-200 dark:bg-gray-700 text-white' // Assistant message: white text
        } rounded-lg px-4 py-3 max-w-[80%] shadow-md`}
      >
        {message.text}
      </div>
    ));
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChatbot}
        className="fixed bottom-6 right-6 bg-teal-600 text-white rounded-full p-4 shadow-xl hover:bg-teal-700 transition-all duration-300 z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <IoChatbubbleEllipsesOutline size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 sm:w-[32rem] bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[600px] border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-teal-600 text-white px-5 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <IoChatbubbleEllipsesOutline className="mr-3" size={20} />
          <h3 className="font-semibold text-lg">FabriX Assistant</h3>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={resetChat}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Reset chat"
          >
            <IoRefreshOutline size={20} />
          </button>
          <button
            onClick={toggleChatbot}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close chat"
          >
            <IoClose size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900 space-y-4">
        {renderMessages()}

        {isLoading && (
          <div className="flex justify-center py-3">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Suggested Questions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
        <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Suggestions:</h4>
        <div className="flex flex-wrap gap-2">
          {['What are your services?', 'How can I track my order?', 'Do you offer discounts?'].map((question, index) => (
            <button
              key={index}
              onClick={() => setInputMessage(question)}
              className="bg-teal-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex rounded-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 text-white focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="bg-teal-600 text-white px-4 py-3 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:bg-teal-600"
          >
            <IoPaperPlaneOutline size={18} />
          </button>
        </div>
        <div className="mt-3 text-center text-sm text-gray-500">
          <span>Need more help? </span>
          <Link to="/contact" className="text-teal-600 hover:underline font-medium">
            Contact us
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;