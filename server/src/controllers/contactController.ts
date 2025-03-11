import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { ApiError } from '../utils/ApiError';
import { sendContactFormConfirmation } from '../services/email/emailService';

/**
 * Contact form submission data type
 */
interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Validate contact form data
 */
const validateContactForm = (data: ContactFormData): string[] => {
  const errors: string[] = [];
  
  if (!data.firstName?.trim()) {
    errors.push('First name is required');
  }
  
  if (!data.lastName?.trim()) {
    errors.push('Last name is required');
  }
  
  if (!data.email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    errors.push('Invalid email address');
  }
  
  if (!data.subject?.trim()) {
    errors.push('Subject is required');
  }
  
  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  }
  
  return errors;
};

/**
 * @desc    Submit contact form
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req: Request, res: Response) => {
  const formData: ContactFormData = req.body;
  
  // Validate form data
  const validationErrors = validateContactForm(formData);
  if (validationErrors.length > 0) {
    throw new ApiError(400, 'Validation failed', validationErrors);
  }
  
  try {
    // In a real application, you would typically store the contact submission in a database
    // For now, we'll just send the confirmation email
    
    // Send confirmation email to the customer
    await sendContactFormConfirmation(
      `${formData.firstName} ${formData.lastName}`,
      formData.email,
      formData.subject,
      formData.message
    );
    
    // Return success response
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    throw new ApiError(500, 'Failed to process contact form submission');
  }
});