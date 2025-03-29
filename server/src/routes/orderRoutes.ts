import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getOrderByNumber,
  getMyOrders,
  cancelOrder
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Example route definitions
router.route('/')
  .post(createOrder)
  .get(protect, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/number/:orderNumber', getOrderByNumber);
router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/status', protect, admin, updateOrderStatus);

// Public route for retrieving orders by number
router.get('/number/:orderNumber', getOrderByNumber);

export default router;