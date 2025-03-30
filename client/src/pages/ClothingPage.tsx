import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { fetchClothingProducts } from '../api/productApi';
import { Filter, ShoppingCart, X, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
// Update the imports to include the API response type
import { ClothingProduct, ClothingProductApiResponse, Product } from '../types/product';
import { toast } from 'react-hot-toast';
// Add this import at the top of the file
import ClothingCard from '../components/product/ClothingCard';

// At the top of your ClothingPage.tsx file, keep these constants:
const S3_BUCKET_URL = 'https://fabrix-assets.s3.us-east-1.amazonaws.com';
const DEFAULT_PLACEHOLDER = `${S3_BUCKET_URL}/placeholders/no-image.jpg`;

// Update the sanitizeImageUrl function to use direct S3 URLs
const sanitizeImageUrl = (url: string): string => {
  // If no URL provided, use default placeholder
  if (!url) return DEFAULT_PLACEHOLDER;

  // For full URLs
  if (url.match(/^https?:\/\//)) {
    return url; // Keep full URLs as they are
  }
  
  // For partial paths, construct the full S3 URL
  const cleanPath = url.replace(/^\/+/, ''); // Remove leading slashes
  return `${S3_BUCKET_URL}/${cleanPath}`;
};

// Add a utility function to fix URLs before they cause issues
const sanitizeUrl = (url: string): string => {
  if (!url) return DEFAULT_PLACEHOLDER;
  
  let cleanUrl = url;
  
  // Fix double protocol
  if (cleanUrl.startsWith('https://https://')) {
    cleanUrl = cleanUrl.replace('https://https://', 'https://');
  }
  
  // Fix duplicate domains
  if (cleanUrl.includes('.s3.us-east-1.amazonaws.com.s3.us-east-1.amazonaws.com')) {
    cleanUrl = cleanUrl.replace('.s3.us-east-1.amazonaws.com.s3.us-east-1.amazonaws.com', 
                              '.s3.us-east-1.amazonaws.com');
  }
  
  return cleanUrl;
};

// Update this function with the correct working URLs
const getProductImageUrl = (productName: string): string => {
  const productMap: Record<string, string> = {
    'Premium Polo Shirt': 'premium-polo-shirt.jpg',
    'Business Oxford Shirt': 'business-shirt.jpg',
    'Custom T-Shirt': 'classic-tshirt.jpg',
    'Quarter-Zip Pullover': 'quarter-zip-pullover.jpg',
    'Corporate Softshell Jacket': 'softshell-jacket.jpg',
    'Embroidered Cap': 'structured-cap.jpg',
    'Branded Hoodie': 'pullover-hoodie.jpg',
    'Performance Vest': 'performance-vest.jpg'
  };

  const fileName = productMap[productName] || productName.toLowerCase().replace(/\s+/g, '-') + '.jpg';
  return `https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/${fileName}`;
};

// Removed unused fixMalformedUrl function to resolve the compile error

// Add this function near the top of the file with your other utility functions
// Removed unused debugS3Image function to resolve the compile error

const debugMissingImages = (productName: string, imageUrl: string) => {
  fetch(imageUrl, { method: 'HEAD' })
    .then(response => {
      if (!response.ok) {
        console.error(`❌ Missing image for ${productName}: ${imageUrl}`);
      }
    })
    .catch(() => {
      console.error(`❌ Error checking image for ${productName}: ${imageUrl}`);
    });
};

// Color options with hex values
const colorOptions = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Navy', value: 'navy', hex: '#0a192f' },
  { name: 'Red', value: 'red', hex: '#e11d48' },
  { name: 'Green', value: 'green', hex: '#059669' },
  { name: 'Blue', value: 'blue', hex: '#3b82f6' },
  { name: 'Gray', value: 'gray', hex: '#6b7280' },
  { name: 'Yellow', value: 'yellow', hex: '#fbbf24' },
  { name: 'Purple', value: 'purple', hex: '#8b5cf6' },
  { name: 'Pink', value: 'pink', hex: '#ec4899' },
];

// Format price helper function
const formatPrice = (price: number | undefined): string => {
  if (price === undefined || isNaN(price)) {
    return '0.00'; // Default value when price is undefined
  }
  return price.toFixed(2);
};

const ClothingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Product state
  const [products, setProducts] = useState<ClothingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedGender, setSelectedGender] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<ClothingProduct | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showProductModal, setShowProductModal] = useState(false);

  // Add these state variables inside the ClothingPage component
  const [sortBy, setSortBy] = useState<string>('name'); // Default sort by name
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // Default sort ascending
  
  // Add this function to handle sort changes
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      // If clicking the same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If clicking a new field, set it as sortBy and default to ascending
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  // Helper function to render sort icons
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown size={16} className="ml-1 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={16} className="ml-1 text-teal-600" />
      : <ArrowDown size={16} className="ml-1 text-teal-600" />;
  };

  // Add this function to sort the products
  const getSortedProducts = () => {
    // Start with filtered products
    return [...filteredProducts].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'basePrice':
          const priceA = Number(a.basePrice) || 0;
          const priceB = Number(b.basePrice) || 0;
          comparison = priceA - priceB;
          break;
        case 'gender':
          // Sort by first gender in the array
          const genderA = a.gender[0] || '';
          const genderB = b.gender[0] || '';
          comparison = genderA.localeCompare(genderB);
          break;
        default:
          comparison = 0;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Load products on initial render
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching clothing products...');
        // Explicitly type the API response
        const data: ClothingProductApiResponse[] = await fetchClothingProducts();
        console.log('Raw API response:', data);
        
        if (data && Array.isArray(data)) {
          // Transform data to ensure all products have the expected structure
          const transformedProducts: ClothingProduct[] = data.map(apiProduct => {
            // Check if the product already has an image URL
            let imageUrl = apiProduct.imageUrl;
            
            if (!imageUrl) {
              // Only generate a URL if one doesn't exist
              imageUrl = getProductImageUrl(apiProduct.name);
            }
            
            debugMissingImages(apiProduct.name, imageUrl);
            
            return {
              ...apiProduct,
              id: apiProduct.id || String(Math.random()),
              imageUrl: sanitizeUrl(imageUrl), // Set the image URL only once
              basePrice: apiProduct.basePrice || apiProduct.price || 0,
              gender: apiProduct.gender || ['unisex'],
              availableSizes: apiProduct.availableSizes || ['S', 'M', 'L', 'XL'],
              availableColors: apiProduct.availableColors || ['White', 'Black'],
              fabricOptions: apiProduct.fabricOptions || ['Cotton'],
              minOrderQuantity: apiProduct.minOrderQuantity || 50,
              type: 'clothing' as 'clothing'
            } as ClothingProduct;
          });
          
          setProducts(transformedProducts);
          console.log('Transformed products:', transformedProducts);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err: any) {
        console.error('Error loading products:', err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  useEffect(() => {
    // Log any products missing basePrice
    const productsWithoutBasePrice = products.filter(p => p.basePrice === undefined);
    if (productsWithoutBasePrice.length > 0) {
      console.warn('Products missing basePrice:', productsWithoutBasePrice);
    }
  }, [products]);

  // Add this after your useEffect that loads products
  useEffect(() => {
    const testImages = async () => {
      console.log("Testing direct image URLs...");
      
      // Test a few specific image URLs directly
      const testUrls = [
        "https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/premium-polo-shirt.jpg",
        "https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/business-shirt.jpg"
      ];
      
      for (const url of testUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          console.log(`URL ${url}: ${response.ok ? 'OK' : 'Failed'} (${response.status})`);
        } catch (err) {
          console.error(`Error testing ${url}:`, err);
        }
      }
    };
    
    if (process.env.NODE_ENV === 'development') {
      testImages();
    }
  }, []);
  
  /*
  useEffect(() => {
    const testImages = async () => {
      if (!products || products.length === 0) return;
      
      console.log("Testing product image URLs...");
      
      // Test the actual URLs from your products
      for (const product of products) {
        const url = fixMalformedUrl(product.imageUrl);
        try {
          const response = await fetch(url, { method: 'HEAD' });
          console.log(`Product ${product.name} image (${url}): ${response.ok ? 'OK' : 'Failed'} (${response.status})`);
        } catch (err) {
          console.error(`Error testing ${url}:`, err);
        }
      }
    };
    
    if (process.env.NODE_ENV === 'development' && products.length > 0) {
      testImages();
    }
  }, [products]);
  */

  useEffect(() => {
    const testImages = async () => {
      if (!products || products.length === 0) return;
      
      console.log("Testing product image URLs via img elements instead of fetch...");
      
      // Create a safer testing function that doesn't trigger CORS
      const testImageUrl = (url: string, productName: string) => {
        console.log(`Testing ${productName} image: ${url}`);
        const img = new Image();
        img.onload = () => console.log(`✅ ${productName} image loaded successfully`);
        img.onerror = () => console.error(`❌ ${productName} image failed to load`);
        img.src = url;
      };
      
      // Test the actual URLs from your products
      for (const product of products) {
        testImageUrl(product.imageUrl || '', product.name);
      }
    };
    
    if (process.env.NODE_ENV === 'development' && products.length > 0) {
      testImages();
    }
  }, [products]);

  useEffect(() => {
    if (!products.length) return;
    
    // Test the first few image URLs
    products.slice(0, 3).forEach(product => {
      console.log(`Testing image URL for ${product.name}: ${product.imageUrl}`);
      
      // Try to fetch the image to verify it exists
      fetch(product.imageUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log(`✅ Image URL verified for ${product.name}`);
          } else {
            console.error(`❌ Image URL failed for ${product.name}: ${response.status}`);
          }
        })
        .catch(error => {
          console.error(`❌ Image URL error for ${product.name}:`, error);
        });
    });
  }, [products]);
  
  // Filter products based on selections
  const filteredProducts = useMemo(() => products.filter((product) => {
    // Only apply filters if they are selected
    
    // Gender filter
    if (selectedGender.length > 0) {
      // Check if product has at least one gender that matches the selected genders
      const hasMatch = product.gender.some(g => 
        selectedGender.includes(g.toLowerCase())
      );
      if (!hasMatch) return false;
    }
    
    // Size filter
    if (selectedSizes.length > 0) {
      const hasMatch = product.availableSizes.some(s => 
        selectedSizes.includes(s)
      );
      if (!hasMatch) return false;
    }
    
    // Color filter
    if (selectedColors.length > 0) {
      const hasMatch = product.availableColors.some(c => 
        selectedColors.includes(c.toLowerCase())
      );
      if (!hasMatch) return false;
    }
    
    // Fabric filter
    if (selectedFabrics.length > 0) {
      const hasMatch = product.fabricOptions.some(f => 
        selectedFabrics.includes(f.toLowerCase())
      );
      if (!hasMatch) return false;
    }
    
    // Price filter
    if ((product.basePrice ?? 0) < minPrice || (product.basePrice ?? 0) > maxPrice) {
      return false;
    }
    
    return true;
  }), [products, selectedGender, selectedSizes, selectedColors, selectedFabrics, minPrice, maxPrice]);
  
  console.log('Filtered products:', filteredProducts);
  
  // Get sorted products
  const sortedProducts = getSortedProducts();
  
  // Add this to debug sort changes
  useEffect(() => {
    console.log(`Sort changed to: ${sortBy} ${sortDirection}`);
    console.log('First 3 sorted products:', sortedProducts.slice(0, 3).map(p => p.name));
  }, [sortBy, sortDirection, sortedProducts]);

  // Toggle filter selection
  const toggleFilter = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };
  
  const openProductModal = (product: ClothingProduct) => {
    setSelectedProduct(product);
    setSelectedColor(product.availableColors[0] || '');
    setSelectedSize(product.availableSizes[0] || '');
    setQuantity(product.minOrderQuantity || 1);
    setShowProductModal(true);
  };

  // Update the navigateToProduct function with better error handling
  // Removed unused navigateToProduct function to resolve the compile error

  // Component for product card to ensure consistent display

  const ProductModal = () => {
    if (!selectedProduct) return null;
    
    const handleAddToCart = () => {
      if (selectedProduct && selectedColor && selectedSize) {
        addToCart({
          id: selectedProduct.id,
          type: 'clothing',
          name: selectedProduct.name,
          price: selectedProduct.basePrice || 0,
          quantity: quantity,
          imageUrl: selectedProduct.imageUrl || DEFAULT_PLACEHOLDER, // Use DEFAULT_PLACEHOLDER
          options: {
            color: selectedColor,
            size: selectedSize
          }
        });
        toast.success(`Added ${quantity} ${selectedProduct.name} to cart`);
        setShowProductModal(false);
      } else {
        toast.error('Please select all options');
      }
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button 
            onClick={() => setShowProductModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col md:flex-row">
            {/* Product image */}
            <div className="md:w-1/2 p-6">
              <img 
                src={sanitizeImageUrl(selectedProduct.imageUrl)}
                alt={selectedProduct.name}
                className="w-full h-auto object-cover rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  // Use S3 placeholder directly
                  target.src = "https://fabrix-assets.s3.us-east-1.amazonaws.com/placeholders/no-image.jpg";
                  target.onerror = null;
                }}
              />
            </div>
            
            {/* Product details */}
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-white mb-2">{selectedProduct.name}</h2>
              <p className="text-teal-400 text-xl mb-6">${formatPrice(selectedProduct.basePrice)} per item</p>
              
              {/* Color selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Select Color</h3>
                <div className="grid grid-cols-5 gap-3">
                  {selectedProduct.availableColors.map(color => {
                    const colorOption = colorOptions.find(c => c.name === color || c.value === color.toLowerCase());
                    const hexColor = colorOption?.hex || '#CCCCCC';
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color ? 'border-teal-500 ring-2 ring-teal-500' : 'border-gray-600'
                        }`}
                        style={{
                          backgroundColor: hexColor,
                          boxShadow: color.toLowerCase() === 'white' ? 'inset 0 0 0 1px #4b5563' : 'none',
                        }}
                        title={color}
                      >
                        {selectedColor === color && (
                          <div className="flex items-center justify-center h-full">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-gray-300">Selected: {selectedColor}</p>
              </div>
              
              {/* Size selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Select Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {selectedProduct.availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border rounded-md px-3 py-2 text-center ${
                        selectedSize === size
                          ? 'bg-teal-900 border-teal-500 text-teal-300'
                          : 'border-gray-600 text-gray-200 hover:bg-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity selection */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={() => setQuantity(Math.max(selectedProduct.minOrderQuantity || 1, quantity - 1))}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-l-md px-4 py-2 font-bold"
                    disabled={quantity <= (selectedProduct.minOrderQuantity || 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= (selectedProduct.minOrderQuantity || 1)) {
                        setQuantity(value);
                      }
                    }}
                    min={selectedProduct.minOrderQuantity || 1}
                    className="bg-gray-700 text-white text-center px-3 py-2 w-20 border-t border-b border-gray-600"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-700 hover:bg-gray-600 text-white rounded-r-md px-4 py-2 font-bold"
                  >
                    +
                  </button>
                  <span className="ml-3 text-gray-300">
                    Minimum: {selectedProduct.minOrderQuantity || 1}
                  </span>
                </div>
              </div>
              
              {/* Total price */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-white">Total:</span>
                  <span className="text-teal-400 text-xl font-bold">
                    ${formatPrice((selectedProduct.basePrice || 0) * quantity)}
                  </span>
                </div>
              </div>
              
              {/* Add to cart button */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-grow bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => navigate(`/clothing/${selectedProduct.id}`)}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  const getCorrectImageUrl = (product: Product): string => {
    // If product has no name, return default placeholder
    if (!product || !product.name) {
      return DEFAULT_PLACEHOLDER;
    }
  
    // If the product already has a properly formatted imageUrl, use that
    // Improved URL detection - make sure it's a valid URL protocol
    if (product.imageUrl && /^https?:\/\//i.test(product.imageUrl)) {
      return product.imageUrl;
    }
    
    // If product has images array, use the first image
    if (product.images && product.images.length > 0 && product.images[0]) {
      return product.images[0]; // Use the first image from the product data
    }
    
    // Fallback mapping based on your server data
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
    
    const filename = imageMap[product.name] || 
      product.name.toLowerCase().replace(/\s+/g, '-') + '.jpg';
    
    return `https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing/${filename}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Custom Clothing</h1>
      
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-gray-800 text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
        >
          <Filter size={18} />
          <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFilters ? 'block' : 'hidden'
          } lg:block lg:w-1/4 bg-gray-800 text-white rounded-xl shadow-md p-6 h-fit sticky top-24`}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Filters</h2>
          
          {/* Gender Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Gender</h3>
            <div className="space-y-2">
              {['Men', 'Women', 'Unisex'].map((gender) => (
                <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedGender.includes(gender.toLowerCase())}
                    onChange={() => toggleFilter(gender.toLowerCase(), selectedGender, setSelectedGender)}
                    className="rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                  />
                  <span className="text-gray-200">{gender}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Size Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'].map((size) => (
                <label
                  key={size}
                  className={`border rounded-md px-3 py-1 text-center cursor-pointer transition-colors ${
                    selectedSizes.includes(size)
                      ? 'bg-teal-900 border-teal-500 text-teal-300'
                      : 'border-gray-600 hover:bg-gray-700 text-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleFilter(size, selectedSizes, setSelectedSizes)}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>
          
          {/* Color Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Color</h3>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map((color) => (
                <label
                  key={color.value}
                  className="flex flex-col items-center cursor-pointer"
                  title={color.name}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColors.includes(color.value)
                        ? 'border-teal-500'
                        : 'border-gray-600'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: color.value === 'white' ? 'inset 0 0 0 1px #4b5563' : 'none',
                    }}
                  >
                    {selectedColors.includes(color.value) && (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={color.value === 'white' ? '#000000' : '#ffffff'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.value)}
                    onChange={() => toggleFilter(color.value, selectedColors, setSelectedColors)}
                    className="sr-only"
                  />
                  <span className="text-xs mt-1 text-gray-300">{color.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Fabric Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Fabric</h3>
            <div className="space-y-2">
              {['Cotton', 'Polyester', 'Cotton-Poly Blend', 'Performance', 'Organic'].map(
                (fabric) => (
                  <label key={`fabric-${fabric}`} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(fabric.toLowerCase())}
                      onChange={() => toggleFilter(fabric.toLowerCase(), selectedFabrics, setSelectedFabrics)}
                      className="rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                    />
                    <span className="text-gray-200">{fabric}</span>
                  </label>
                )
              )}
            </div>
          </div>
          
          {/* Price Range Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Price Range (per item)</h3>
            <div className="flex items-center justify-between">
              <div className="w-[45%]">
                <label htmlFor="minPrice" className="sr-only">Minimum Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    min="0"
                    max={maxPrice}
                    className="pl-7 pr-3 py-2 border border-gray-600 rounded-md w-full bg-gray-700 text-white"
                  />
                </div>
              </div>
              
              <span className="text-gray-300 flex-shrink-0 mx-2">to</span>
              
              <div className="w-[45%]">
                <label htmlFor="maxPrice" className="sr-only">Maximum Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    min={minPrice}
                    className="pl-7 pr-3 py-2 border border-gray-600 rounded-md w-full bg-gray-700 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Reset Filters */}
          <button
            onClick={() => {
              setSelectedGender([]);
              setSelectedSizes([]);
              setSelectedColors([]);
              setSelectedFabrics([]);
              setMinPrice(0);
              setMaxPrice(1000);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
        
        {/* Add this right after the filters section but before the product grid */}
        <div className="lg:w-3/4">
          {/* Sorting Controls - Improved with FabricPage styling */}
          <div className="bg-gray-800 rounded-xl shadow-md mb-6 p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </h2>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleSortChange('name')}
                  className={`flex items-center px-3 py-1 rounded ${
                    sortBy === 'name' 
                      ? 'bg-teal-900 text-teal-300 font-medium' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Name
                  {renderSortIcon('name')}
                </button>
                <button 
                  onClick={() => handleSortChange('basePrice')}
                  className={`flex items-center px-3 py-1 rounded ${
                    sortBy === 'basePrice' 
                      ? 'bg-teal-900 text-teal-300 font-medium' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  Price
                  {renderSortIcon('basePrice')}
                </button>
              </div>
            </div>
          </div>
        
          {/* Product Grid - Update to use sortedProducts instead of filteredProducts */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-white">No products found</h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedGender([]);
                  setSelectedSizes([]);
                  setSelectedColors([]);
                  setSelectedFabrics([]);
                  setMinPrice(0);
                  setMaxPrice(1000);
                }}
                className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            // Replace ClothingCardList with a Grid of individual ClothingCard components
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map(product => {
                // Make sure we have a valid product with name and image
                const safeProduct = {
                  ...product,
                  imageUrl: product.imageUrl || DEFAULT_PLACEHOLDER
                };

                return (
                  <ClothingCard
                    key={safeProduct.id}
                    product={safeProduct}
                    onClick={openProductModal}
                  />
                );
              })}
            </div>
          )}
          
          <div className="mt-8 flex justify-center">
            <Link
              to="/cart"
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded-md flex items-center space-x-2 transition-colors"
            >
              <ShoppingCart size={20} />
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Information Section */}
      <div className="mt-12 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Bulk Ordering Information</h2>
        <p className="text-gray-300 mb-4">
          All clothing items require a minimum order quantity as specified per product.
          Custom embroidery and printing options are available for all products.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Customization</h3>
            <p className="text-gray-300 text-sm">
              Add your logo or design to any product. Multiple placement options available.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Bulk Discounts</h3>
            <p className="text-gray-300 text-sm">
              Volume discounts available for orders exceeding minimum quantities.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="font-semibold text-white mb-2">Sample Orders</h3>
            <p className="text-gray-300 text-sm">
              Request samples before placing your bulk order. Contact our team for details.
            </p>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <h3 className="font-medium text-white mb-2">What is the typical turnaround time?</h3>
            <p className="text-gray-300">
              Production time typically ranges from 10-15 business days after artwork approval, 
              depending on order quantity and customization complexity.
            </p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="font-medium text-white mb-2">Do you offer size exchanges?</h3>
            <p className="text-gray-300">
              Size exchanges for incorrect orders are handled on a case-by-case basis. 
              We recommend ordering size samples before placing large bulk orders.
            </p>
          </div>
          
          <div className="border-b border-gray-700 pb-4">
            <h3 className="font-medium text-white mb-2">What file formats do you accept for logos?</h3>
            <p className="text-gray-300">
              We accept vector files (.ai, .eps, .pdf) for best quality. High-resolution .png 
              or .jpg files may also work depending on the application.
            </p>
          </div>
          
          <div className="pb-4">
            <h3 className="font-medium text-white mb-2">Can I mix sizes and colors in my order?</h3>
            <p className="text-gray-300">
              Yes, you can mix sizes while maintaining the minimum order quantity. 
              Color mixing may have additional requirements depending on the item.
            </p>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="mt-8 bg-teal-900 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Need Help With Your Bulk Order?</h2>
        <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
          Our team of experts is ready to help you select the perfect clothing items for your brand.
          Get in touch for personalized assistance with your order.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-teal-900 font-medium py-3 px-8 rounded-md hover:bg-teal-100 transition-colors"
        >
          Contact Our Team
        </Link>
      </div>
      
      {/* Test Image Loading - For Development Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 hidden">
          <h3 className="text-lg font-medium mb-2 text-white">Image Loader Tester</h3>
          {products.map((product) => (
            <img 
              key={`test-${product.id}`}
              src={product.imageUrl} 
              alt={product.name}
              className="w-0 h-0"
              onLoad={() => console.log(`✅ Successfully loaded: ${product.imageUrl}`)}
              onError={() => console.error(`❌ Failed to load: ${product.imageUrl}`)}
            />
          ))}
        </div>
      )}
      {showProductModal && <ProductModal />}
    </div>
  );
};

export default ClothingPage;