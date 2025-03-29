import mongoose, { Document, Schema } from 'mongoose';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import axios, { AxiosResponse, AxiosError } from 'axios';

// Order item interface
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  type: 'clothing' | 'fabric';
  // Type-specific properties
  size?: string;
  color?: string;
  fabric?: string;
  logoUrl?: string;
  orderQuantity?: number;
  logoPosition?: string;
  fabricType?: string;
  length?: number;
  fabricStyle?: string;
}

// Customer information interface
export interface ICustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

// Shipping information interface
export interface IShippingInfo {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  method: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Payment information interface
export interface IPaymentInfo {
  paymentMethodId: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  isPaid: boolean;
  paidAt?: Date;
  cardBrand?: string;
  lastFour?: string;
  transactionId?: string;
}

// Order status type
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Order interface
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  customer: ICustomerInfo;
  shipping: IShippingInfo;
  payment: IPaymentInfo;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order item schema
const orderItemSchema = new Schema<IOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['clothing', 'fabric'],
  },
  // Type-specific properties
  size: String,
  color: String,
  fabric: String,
  logoUrl: String,
  orderQuantity: Number,
  logoPosition: String,
  fabricType: String,
  length: Number,
  fabricStyle: String,
});

// Customer information schema
const customerInfoSchema = new Schema<ICustomerInfo>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  company: String,
});

// Shipping information schema
const shippingInfoSchema = new Schema<IShippingInfo>({
  address1: {
    type: String,
    required: true,
  },
  address2: String,
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  trackingNumber: String,
  estimatedDelivery: String,
});

// Payment information schema
const paymentInfoSchema = new Schema<IPaymentInfo>({
  paymentMethodId: {
    type: String,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: Date,
  cardBrand: String,
  lastFour: String,
  transactionId: String,
});

// Order schema
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }, // Add this line
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional
  items: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      type: { type: String }, // Optional
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      imageUrl: { type: String }, // Optional
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false }, // Make this optional
    },
  ],
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String }, // Optional
  },
  shipping: {
    address1: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    method: { type: String }, // Optional
  },
  payment: {
    method: { type: String, required: false }, // Make it optional
    total: { type: Number, required: true },
    tax: { type: Number },
    shipping: { type: Number },
    subtotal: { type: Number },
    paymentMethodId: { type: String },
  },
  notes: { type: String },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model<IOrder>('Order', orderSchema);

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  console.log('Request body received by backend:', req.body);
  const { items, customer, shipping, payment, notes } = req.body;

  // Generate a unique order number
  const orderNumber = generateOrderNumber();
  console.log('Generated Order Number:', orderNumber);

  // Provide default values for optional fields
  const orderData = {
    orderNumber, // Add the generated order number
    items: items.map((item: {
      id: string;
      name: string;
      type?: string;
      price: number;
      quantity: number;
      imageUrl?: string;
      product?: mongoose.Types.ObjectId | null;
    }) => ({
      ...item,
      type: item.type || 'default',
      imageUrl: item.imageUrl || 'https://example.com/default.jpg',
      product: item.product || null,
    })),
    customer: {
      ...customer,
      phone: customer.phone || 'N/A',
    },
    shipping: {
      ...shipping,
      method: shipping.method || 'standard',
    },
    payment: {
      ...payment,
      method: payment.method || 'credit_card',
      tax: payment.tax || 0,
      shipping: payment.shipping || 0,
      subtotal: payment.subtotal || payment.total,
      paymentMethodId: payment.paymentMethodId || 'N/A',
    },
    notes: notes || '',
  };

  console.log('Order data being saved to database:', orderData);

  // Create and save the order
  const newOrder = new Order(orderData);
  const savedOrder = await newOrder.save();

  // Return the response
  res.status(201).json({ success: true, order: savedOrder });
});

export default Order;

// Assuming this is in /home/nabz/fabrix-3/server/src/utils/generateOrderNumber.ts
export const generateOrderNumber = (): string => {
  const prefix = 'ORD';
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};