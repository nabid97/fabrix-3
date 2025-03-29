import express from 'express';
import { createPaymentIntent } from '../services/payment/stripeService';
import bodyParser from 'body-parser';
import { handleWebhook } from '../controllers/paymentController';

const router = express.Router();

/**
 * @route   POST /api/payments/intent
 * @desc    Create a payment intent
 * @access  Public
 */
router.post('/intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const validCurrencies = ['usd', 'eur', 'gbp', 'cad']; // Add more as needed
    if (!validCurrencies.includes(currency)) {
      return res.status(400).json({ success: false, message: 'Invalid currency' });
    }

    const paymentIntent = await createPaymentIntent(amount, currency, metadata);

    // Ensure client_secret is included in the response
    return res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return res.status(500).json({ success: false, message: 'Failed to create payment intent' });
  }
});

// Use express.raw for Stripe webhook
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;