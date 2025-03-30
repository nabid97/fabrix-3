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
import Product from '../models/Product'; // Import your Product model
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/clothing', getClothingProducts);
router.get('/fabric', async (req, res) => {
  try {
    const fabrics = await Product.find({ type: 'fabric' }).select(
      '_id name description pricePerMeter availableColors styles composition weight minOrderLength imageUrl'
    ) as Array<{
      _id: string;
      name: string;
      description?: string;
      pricePerMeter?: number;
      availableColors?: string[];
      styles?: string[];
      composition?: string;
      weight?: string;
      minOrderLength?: number;
      type?: string;
      imageUrl?: string;
    }>;
    res.json(fabrics.map(fabric => ({
      id: fabric._id,
      name: fabric.name,
      description: fabric.description || '',
      pricePerMeter: fabric.pricePerMeter || 0,
      availableColors: fabric.availableColors || [],
      styles: fabric.styles || [],
      composition: fabric.composition || 'Unknown',
      weight: fabric.weight || 'Medium',
      minOrderLength: fabric.minOrderLength || 1,
      type: fabric.type || 'fabric',
      imageUrl: fabric.imageUrl || '',
    })));
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/clothing/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'No product ID provided' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  await getProductById(req, res);
});

// Admin routes
router.post('/clothing', protect, admin, createClothingProduct);
router.post('/fabric', protect, admin, createFabricProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;