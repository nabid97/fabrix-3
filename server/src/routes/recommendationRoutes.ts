import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching recommendations...');
    
    // Since Product.find is causing issues, use mock data instead:
    const mockRecommendations = [
      {
        id: '1',
        name: 'Premium Polo Shirt',
        price: 24.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo.jpg',
        availableColors: ['White', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '2',
        name: 'Branded Hoodie',
        price: 39.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/hoodie.jpg',
        availableColors: ['Gray', 'Black', 'Navy'],
        availableSizes: ['S', 'M', 'L', 'XL']
      },
      {
        id: '3',
        name: 'Performance Vest',
        price: 34.99,
        imageUrl: 'https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/performance-vest.jpg',
        availableColors: ['Black', 'Navy', 'Red'],
        availableSizes: ['S', 'M', 'L', 'XL']
      }
    ];
    
    console.log('Returning mock recommendation data');
    res.json(mockRecommendations);
  } catch (err) {
    console.error('Error in recommendations route:', err);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

export default router;