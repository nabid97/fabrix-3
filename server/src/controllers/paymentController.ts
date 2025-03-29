import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Stripe from 'stripe';
import Order from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { NextFunction } from 'express';
import config from '../config';

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = asyncHandler(async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount) {
    throw new ApiError(400, 'Amount is required');
  }

  const amountInCents = Math.round(Number(amount) * 100);
  if (isNaN(amountInCents) || amountInCents <= 0) {
    throw new ApiError(400, 'Invalid amount');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'eur',
    payment_method_types: ['card'],
  });

  res.status(201).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});

export const handleWebhook = (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Missing Stripe signature');
  }

  let event;

  try {
    // Use the raw body for signature verification
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body
      sig,
      config.stripe.webhookSecret // Your webhook secret from Stripe
    );
  } catch (err: any) { // Add ": any" type annotation here
    console.error('Webhook error:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('PaymentIntent was successful!');
      break;
    case 'payment_intent.payment_failed':
      console.log('PaymentIntent failed.');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return res.status(200).json({ received: true }); // Add "return" here
};

function asyncHandler(fn: (req: Request, res: Response) => Promise<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };
}
