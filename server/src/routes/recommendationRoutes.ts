import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching recommendations...');
    
    // Use the correct file names that match your S3 bucket
    const mockRecommendations = [
      {
        id: '67cc14b4259c2e828f61b715',
        name: 'Premium Polo Shirt',
        description: 'High-quality polo shirt made from combed cotton.',
        price: 24.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo-shirt.jpg',
        availableColors: ['White', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL'],
        gender: ['men', 'women', 'unisex']
      },
      {
        id: '67cc14b4259c2e828f61b71b',
        name: 'Branded Hoodie',
        description: 'Warm and comfortable hoodie with kangaroo pocket.',
        price: 39.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/pullover-hoodie.jpg',
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL'],
        gender: ['unisex']
      },
      {
        id: '67cc14b4259c2e828f61b71c',
        name: 'Performance Vest',
        description: 'Lightweight insulated vest that provides core warmth.',
        price: 34.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/performance-vest.jpg',
        availableColors: ['Black', 'Navy', 'Red'],
        availableSizes: ['S', 'M', 'L', 'XL'],
        gender: ['men', 'women']
      }
    ];
    
    // Make sure to return the recommendations
    return res.json(mockRecommendations);
  } catch (err) {
    console.error('Error in recommendations route:', err);
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;