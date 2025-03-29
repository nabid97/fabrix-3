import express from 'express';
import {
  getProducts,
  getProductById,
  createClothingProduct,
  createFabricProduct,
  updateProduct,
  deleteProduct,
  getClothingProducts,
  getFabricProducts
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/clothing', getClothingProducts);
router.get('/fabric', getFabricProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/clothing', protect, admin, createClothingProduct);
router.post('/fabric', protect, admin, createFabricProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;