import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import Order from '../models/Order';
import { ApiError } from '../utils/ApiError';
import { AuthRequest } from '../types/express';
import { sendOrderConfirmationEmail } from '../services/email/emailService';
import { generateOrderNumber } from '../utils/generateOrderNumber';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const orderData = { ...req.body, orderNumber: generateOrderNumber() };

  const newOrder = new Order(orderData);
  const savedOrder = await newOrder.save();

  res.status(201).json({
    success: true,
    order: savedOrder,
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
export const getOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;
  
  // Build filters based on user role
  const filters: any = {};
  
  // Regular users can only see their own orders
  if (!req.user?.isAdmin) {
    filters.user = req.user?._id;
  }
  
  const count = await Order.countDocuments(filters);
  
  const orders = await Order.find(filters)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new ApiError(404, 'Order not found');
  }

  res.status(200).json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Update payment status
  order.payment.isPaid = true;
  order.payment.paidAt = new Date();
  order.payment.cardBrand = req.body.cardBrand;
  order.payment.lastFour = req.body.lastFour;
  order.payment.transactionId = req.body.transactionId;
  
  // Update order status
  order.status = 'processing';
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, trackingNumber, estimatedDelivery } = req.body;
  
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Update order status
  order.status = status;
  
  // Update tracking info if provided
  if (status === 'shipped' && trackingNumber) {
    order.shipping.trackingNumber = trackingNumber;
  }
  
  // Update estimated delivery if provided
  if (estimatedDelivery) {
    order.shipping.estimatedDelivery = estimatedDelivery;
  }
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});

// @desc    Get order by order number
// @route   GET /api/orders/number/:orderNumber
// @access  Public
export const getOrderByNumber = asyncHandler(async (req: Request, res: Response) => {
  const orderNumber = req.params.orderNumber;
  
  const order = await Order.findOne({ orderNumber });
  
  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: 'Order not found' 
    });
  }
  
  // Return detailed order information (exclude sensitive data)
  return res.json({
    success: true,
    order: {
      _id: order._id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      status: order.status,
      items: order.items,
      customer: {
        firstName: order.customer.firstName,
        lastName: order.customer.lastName,
        email: order.customer.email,
        phone: order.customer.phone,
        company: order.customer.company
      },
      shipping: order.shipping,
      payment: {
        subtotal: order.payment.subtotal,
        shipping: order.payment.shipping,
        tax: order.payment.tax,
        total: order.payment.total,
        cardBrand: order.payment.cardBrand,
        lastFour: order.payment.lastFour
        // Exclude sensitive payment data
      },
      notes: order.notes
    }
  });
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user?._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }
  
  // Check if the user is authorized to cancel this order
  if (!req.user?.isAdmin && order.user.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, 'Not authorized to cancel this order');
  }
  
  // Only allow cancellation if order is in pending or processing state
  if (order.status !== 'pending' && order.status !== 'processing') {
    throw new ApiError(400, 'Order cannot be cancelled at this stage');
  }
  
  // Update order status
  order.status = 'cancelled';
  
  const updatedOrder = await order.save();
  
  res.json(updatedOrder);
});