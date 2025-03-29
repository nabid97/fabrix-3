import nodemailer from 'nodemailer';
import config from '../../config';
import { IOrder } from '../../models/Order';
import { loadEmailTemplate } from './emailTemplates';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465, // true for 465, false for other ports
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

/**
 * Send order confirmation email to customer
 * @param recipientEmail - Customer email
 * @param orderData - Order details
 */
export const sendOrderConfirmationEmail = async (
  recipientEmail: string,
  orderData: {
    firstName: string;
    orderNumber: string;
    items: any[];
    shipping: any;
    payment: any;
  }
): Promise<void> => {
  try {
    // Get the order confirmation email template
    const template = getOrderConfirmationTemplate();

    // Format the items for the email
    const itemsList = orderData.items.map(item => 
      `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    ).join('');

    // Calculate order totals
    const subtotal = orderData.payment.subtotal?.toFixed(2) || '0.00';
    const shipping = orderData.payment.shipping?.toFixed(2) || '0.00';
    const tax = orderData.payment.tax?.toFixed(2) || '0.00';
    const total = orderData.payment.total?.toFixed(2) || '0.00';

    // Replace placeholders in the template
    const html = template
      .replace('{{firstName}}', orderData.firstName)
      .replace('{{orderNumber}}', orderData.orderNumber)
      .replace('{{items}}', itemsList)
      .replace('{{subtotal}}', subtotal)
      .replace('{{shipping}}', shipping)
      .replace('{{tax}}', tax)
      .replace('{{total}}', total)
      .replace('{{shippingAddress}}', `
        ${orderData.shipping.address1}<br>
        ${orderData.shipping.address2 ? orderData.shipping.address2 + '<br>' : ''}
        ${orderData.shipping.city}, ${orderData.shipping.state} ${orderData.shipping.zipCode}<br>
        ${orderData.shipping.country}
      `);

    // Send the email
    await transporter.sendMail({
      from: `"FabriX" <${config.email.from}>`,
      to: recipientEmail,
      subject: `Your Order Confirmation #${orderData.orderNumber}`,
      html,
      text: `Thank you for your order #${orderData.orderNumber}. We'll notify you once your order has shipped.`,
    });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw new Error('Failed to send order confirmation email');
  }
};

// Add other email sending functions as needed

/**
 * Send shipping confirmation email with tracking information
 * @param order - Order details
 * @param email - Customer email
 */
export const sendShippingConfirmationEmail = async (order: IOrder, email: string): Promise<void> => {
  try {
    // Only send if tracking number is available
    if (!order.shipping.trackingNumber) {
      return;
    }
    
    // Load template and replace placeholders
    const template = loadEmailTemplate('shippingConfirmation');
    
    // Replace placeholders in template
    const html = template
      .replace('{{orderNumber}}', order.orderNumber)
      .replace('{{customerName}}', `${order.customer.firstName} ${order.customer.lastName}`)
      .replace('{{trackingNumber}}', order.shipping.trackingNumber)
      .replace('{{estimatedDelivery}}', order.shipping.estimatedDelivery || 'Not available');
    
    // Send email
    await transporter.sendMail({
      from: `"FabriX" <${config.email.from}>`,
      to: email,
      subject: `Your FabriX Order #${order.orderNumber} Has Shipped`,
      html,
      text: `Your order #${order.orderNumber} has been shipped! Tracking number: ${order.shipping.trackingNumber}`,
    });
    
    console.log(`Shipping confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending shipping confirmation email:', error);
  }
};

/**
 * Send contact form confirmation email
 * @param name - Customer name
 * @param email - Customer email
 * @param subject - Contact form subject
 * @param message - Contact form message
 */
export const sendContactFormConfirmation = async (
  name: string,
  email: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    // Load template and replace placeholders
    const template = loadEmailTemplate('contactForm');
    const date = new Date().toLocaleDateString();
    
    // Replace placeholders in template
    const html = template
      .replace('{{name}}', name)
      .replace('{{date}}', date)
      .replace('{{subject}}', subject)
      .replace('{{message}}', message);
    
    // Send confirmation to customer
    await transporter.sendMail({
      from: `"FabriX Support" <${config.email.from}>`,
      to: email,
      subject: 'We received your message',
      html,
      text: `Thank you for contacting us! We've received your message and will get back to you soon.`,
    });
    
    // Send notification to admin
    await transporter.sendMail({
      from: `"FabriX Website" <${config.email.from}>`,
      to: config.email.from,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      text: `New contact form submission from ${name} (${email}): ${message}`,
    });
    
    console.log(`Contact form confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending contact form confirmation email:', error);
    throw error;
  }
};

// Add this function to your emailService.ts file

const getOrderConfirmationTemplate = (): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .logo { text-align: center; margin-bottom: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
        .footer { background-color: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f1f1f1; text-align: left; padding: 8px; }
        .total-row { font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://yourwebsite.com/logo.png" alt="FabriX Logo" style="max-width: 150px;">
        </div>
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        
        <p>Hello {{firstName}},</p>
        
        <p>Thank you for your order! We've received your order and are working on it now. Here's a summary of your purchase:</p>
        
        <h2>Order #{{orderNumber}}</h2>
        
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {{items}}
          </tbody>
        </table>
        
        <table>
          <tr>
            <td style="text-align: right;">Subtotal:</td>
            <td style="text-align: right; width: 100px;">\${{subtotal}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">Shipping:</td>
            <td style="text-align: right;">\${{shipping}}</td>
          </tr>
          <tr>
            <td style="text-align: right;">Tax:</td>
            <td style="text-align: right;">\${{tax}}</td>
          </tr>
          <tr class="total-row">
            <td style="text-align: right;">Total:</td>
            <td style="text-align: right;">\${{total}}</td>
          </tr>
        </table>
        
        <h3>Shipping Address</h3>
        <p>{{shippingAddress}}</p>
        
        <p>We'll send you another email when your order ships. If you have any questions, please contact our customer service at support@fabrix.com.</p>
        
        <p>Thank you for shopping with us!</p>
        
        <p>Best regards,<br>The FabriX Team</p>
        
        <div class="footer">
          <p>&copy; 2025 FabriX. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};