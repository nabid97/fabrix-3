import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import Product, { ClothingProduct, FabricProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';

// Helper function to generate ID from name
const generateId = (name: string): string => {
  return `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
};

// Add this helper function at the top
const getCorrectImageUrl = (productName: string, imageUrl?: string): string => {
  // If an image URL is already provided and it's not a relative path, use it
  if (imageUrl && imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Map product names to known image filenames
  const imageMap: Record<string, string> = {
    'Business Oxford Shirt': 'business-shirt.jpg',
    'Embroidered Cap': 'structured-cap.jpg',
    'Corporate Softshell Jacket': 'softshell-jacket.jpg',
    'Custom T-Shirt': 'classic-tshirt.jpg',
    // Add other mappings as needed
  };
  
  // Get the correct filename or generate one
  const filename = imageMap[productName] || 
    productName.toLowerCase().replace(/\s+/g, '-') + '.jpg';
  
  return `https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/${filename}`;
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;
  const type = req.query.type as string;
  
  // Build filter based on query parameters
  const filters: any = { isActive: true };
  
  // Filter by product type if specified
  if (type === 'clothing' || type === 'fabric') {
    filters.type = type;
  }
  
  // Handle search query
  if (req.query.keyword) {
    filters.name = {
      $regex: req.query.keyword,
      $options: 'i'
    };
  }
  
  // Get total count for pagination
  const count = await Product.countDocuments(filters);
  
  // Fetch products with pagination
  const products = await Product.find(filters)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response, type: string | null = null) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'No product ID provided' });
    }

    const query = type ? { _id: id, type } : { _id: id };
    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new clothing product
// @route   POST /api/products/clothing
// @access  Private/Admin
export const createClothingProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    images,
    price,
    availableSizes,
    availableColors,
    fabricOptions,
    gender,
    minOrderQuantity,
    weight,
    dimensions,
    customizationOptions
  } = req.body;
  
  // Validate required fields
  if (!name || !description || !price || !images || images.length === 0) {
    throw new ApiError(400, 'Please provide all required fields');
  }
  
  const product = await ClothingProduct.create({
    name,
    description,
    images,
    price,
    availableSizes,
    availableColors,
    fabricOptions,
    gender,
    minOrderQuantity: minOrderQuantity || 50,
    weight,
    dimensions,
    customizationOptions
  });
  
  res.status(201).json(product);
});

// @desc    Create a new fabric product
// @route   POST /api/products/fabric
// @access  Private/Admin
export const createFabricProduct = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    images,
    price,
    fabricType,
    composition,
    weight,
    width,
    availableColors,
    styles,
    minOrderLength,
    careInstructions,
    certifications
  } = req.body;
  
  // Validate required fields
  if (!name || !description || !price || !images || images.length === 0) {
    throw new ApiError(400, 'Please provide all required fields');
  }
  
  const product = await FabricProduct.create({
    name,
    description,
    images,
    price,
    fabricType,
    composition,
    weight,
    width,
    availableColors,
    styles,
    minOrderLength: minOrderLength || 1,
    careInstructions,
    certifications
  });
  
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  // Update product with new data
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }
  
  // Instead of deleting, set as inactive
  product.isActive = false;
  await product.save();
  
  res.json({ message: 'Product removed' });
});

// @desc    Fetch clothing products
// @route   GET /api/products/clothing
// @access  Public
export const getClothingProducts = async (req: Request, res: Response) => {
  try {
    const products = await ClothingProduct.find({ isActive: true });
    
    // Transform products to ensure they have an imageUrl field
    const transformedProducts = products.map(product => {
      const productObj = product.toObject ? product.toObject() : product;
      
      // If product already has images array, use the first image as imageUrl
      if (productObj.images && productObj.images.length > 0) {
        return {
          ...productObj,
          imageUrl: productObj.images[0] // Set imageUrl from first image in array
        };
      }
      
      // Otherwise use filename mapping
      const imageMap: Record<string, string> = {
        'Premium Polo Shirt': 'premium-polo-shirt.jpg',
        'Business Oxford Shirt': 'business-shirt.jpg',
        'Custom T-Shirt': 'classic-tshirt.jpg',
        'Quarter-Zip Pullover': 'quarter-zip-pullover.jpg',
        'Corporate Softshell Jacket': 'softshell-jacket.jpg',
        'Embroidered Cap': 'structured-cap.jpg',
        'Branded Hoodie': 'pullover-hoodie.jpg',
        'Performance Vest': 'performance-vest.jpg'
      };
      
      const filename = imageMap[productObj.name] || 
        productObj.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
      
      return {
        ...productObj,
        imageUrl: `https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/${filename}`
      };
    });
    
    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching clothing products:', error);
    res.status(500).json({ error: 'Failed to fetch clothing products' });
  }
};

// @desc    Fetch fabric products
// @route   GET /api/products/fabric
// @access  Public
export const getFabricProducts = async (req: Request, res: Response) => {
  try {
    const fabricProducts = await Product.find({ type: 'fabric' });
    if (!fabricProducts) {
      return res.status(404).json({
        success: false,
        message: 'No fabric products found',
      });
    }

    return res.status(200).json({
      success: true,
      count: fabricProducts.length,
      data: fabricProducts,
    });
  } catch (error) {
    console.error('Error fetching fabric products:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch fabric products',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// @desc    Fetch fabrics
// @route   GET /api/fabrics
// @access  Public
export const getFabrics = async (req: Request, res: Response) => {
  try {
    // Fetch fabric products from the database
    const fabricProducts = await FabricProduct.find({ isActive: true });
    
    // Map fabric products with proper types
    const fabrics = fabricProducts.map(fabric => ({
      id: fabric._id || generateId(fabric.name),
      name: fabric.name,
      type: fabric.fabricType, // Use fabricType from the data, not 'fabric'
      pricePerMeter: fabric.price,
      imageUrl: fabric.images?.[0] || '/api/placeholder/600/600',
      description: fabric.description,
      availableColors: fabric.availableColors,
      styles: fabric.styles,
      composition: fabric.composition,
      weight: fabric.weight,
      minOrderLength: fabric.minOrderLength
    }));
    
    res.json(fabrics);
  } catch (error) {
    console.error('Error fetching fabrics:', error);
    res.status(500).json({ error: 'Failed to fetch fabrics' });
  }
};

// Then add a new function specifically for clothing products if needed:
export const getClothingProductById = async (req: Request, res: Response) => {
  return getProductById(req, res, 'clothing');
};