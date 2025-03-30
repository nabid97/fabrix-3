import { useState } from 'react';
import { useChatbot } from '../contexts/ChatbotContext';
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react';

// Form data type
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactUsPage = () => {
  const { toggleChatbot } = useChatbot();
  
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // In a real app, you would send this data to your backend
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Successful submission
      setSubmitSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Pre-defined subject options
  const subjectOptions = [
    'General Inquiry',
    'Order Status',
    'Custom Quote Request',
    'Returns & Exchanges',
    'Bulk Order Information',
    'Technical Support',
    'Other',
  ];
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Main heading with white text */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl py-10 px-6 mb-12">
        <h1 className="text-4xl font-bold mb-4 text-center text-white">Contact Us</h1>
        
        {/* Subheading with white text */}
        <div className="text-center">
          <p className="text-xl text-white font-medium">
            We're here to help! Choose how you'd like to get in touch with us.
          </p>
        </div>
      </div>
      
      {/* Contact Options - Better visibility with larger cards and more contrast */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Chatbot Option */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-teal-200">
            <div className="p-8">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MessageCircle size={40} className="text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3">Chat with our AI Assistant</h2>
              <p className="text-gray-600 text-center mb-6 text-lg">
                Get immediate answers to common questions with our AI chatbot.
              </p>
              <button
                onClick={toggleChatbot}
                className="w-full bg-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center text-lg"
              >
                <MessageCircle size={24} className="mr-3" />
                Start Chat
              </button>
            </div>
          </div>
          
          {/* Contact Form Option */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-2 border-indigo-200">
            <div className="p-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail size={40} className="text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-3">Send Us a Message</h2>
              <p className="text-gray-600 text-center mb-6 text-lg">
                Fill out our contact form for a response from our team within 24 hours.
              </p>
              <a
                href="#contact-form"
                className="block w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-center text-lg"
              >
                Contact Form
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company Contact Information - Enhanced visibility with larger icons and better contrast */}
      <div className="max-w-5xl mx-auto mb-12 bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <MapPin size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Address</h3>
            <address className="not-italic text-gray-600 text-lg">
              46 Ashfield St<br />
              London E1 2AJ<br />
              United Kingdom
            </address>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Phone size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Phone</h3>
            <p className="text-gray-600 text-lg">
              <a href="tel:+15551234567" className="hover:text-teal-600 transition-colors font-medium">
                +44 1508 1234567
              </a>
              <br />
              <span className="text-base mt-2 block">
                Monday-Friday: 8am-6pm ET<br />
                Saturday: 9am-3pm ET
              </span>
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Mail size={32} className="text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email</h3>
            <p className="text-gray-600 text-lg">
              <a href="mailto:info@fabrix.com" className="hover:text-teal-600 transition-colors font-medium">
                info@fabrix.com
              </a>
              <br />
              <a href="mailto:orders@fabrix.com" className="hover:text-teal-600 transition-colors font-medium">
                orders@fabrix.com
              </a>
              <br />
              <a href="mailto:support@fabrix.com" className="hover:text-teal-600 transition-colors font-medium">
                support@fabrix.com
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact Form - Enhanced visibility with better contrast and larger elements */}
      <div id="contact-form" className="max-w-3xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-white text-center">Send Us a Message</h2>
          
          {submitSuccess ? (
            <div className="bg-white p-8 rounded-lg">
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">Thank you for your message!</h3>
                <p className="text-lg">
                  We've received your inquiry and will get back to you within 24 hours. A confirmation 
                  has been sent to your email address.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-inner">
              <form onSubmit={handleSubmit} className="space-y-6">
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    {submitError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjectOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-indigo-600 text-white py-4 px-6 rounded-md font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center text-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={24} className="mr-3" />
                      Send Message
                    </>
                  )}
                </button>
                
                <p className="text-sm text-gray-500 mt-4">
                  <span className="text-red-500">*</span> Required fields. By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Map Section */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-white">Our Location</h2>
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="relative" style={{ height: "400px" }}>
            {/* Google Maps Embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2482.3931976809984!2d-0.0664870231978704!3d51.51801887184171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761cb3cf8c3a01%3A0x3e06bc93aa0d2cc!2s46%20Ashfield%20St%2C%20London%20E1%202AJ%2C%20UK!5e0!3m2!1sen!2sus!4v1710152311657!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="FabriX Office Location"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      
        <div className="mt-6 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <MapPin size={32} className="text-teal-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">FabriX Head Office</h3>
              <p className="text-gray-600 text-lg">46 Ashfield St, London E1 2AJ, United Kingdom</p>
              <div className="mt-3 flex items-center text-base text-teal-600">
                <a 
                  href="https://www.google.com/maps/dir//46+Ashfield+St,+London+E1+2AJ,+UK/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center hover:underline font-medium"
                >
                  Get directions
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;