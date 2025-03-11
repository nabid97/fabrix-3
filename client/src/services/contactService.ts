import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

// Contact form data interface
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Service for handling contact form operations
 */
class ContactService {
  /**
   * Submit contact form data
   * 
   * @param formData - The contact form data to submit
   * @returns A promise that resolves when the form is submitted
   */
  async submitContactForm(formData: ContactFormData): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/contact`, formData);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form. Please try again later.');
    }
  }
}

// Create a singleton instance
const contactService = new ContactService();

export default contactService;