import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { fetchClothingProducts } from '../api/productApi';
import { ShoppingCart, Filter, Upload, X, Check } from 'lucide-react';

// Product Type
interface ClothingProduct {
  id: string;
  name: string;
  basePrice: number;
  imageUrl: string;
  description: string;
  availableSizes: string[];
  availableColors: string[];
  fabricOptions: string[];
  gender: string[];
  minOrderQuantity: number;
  images?: string[]; // Optional array of image URLs
}

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

// Fix for the formatPrice function
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) return '0.00';
  return price.toFixed(2);
};

const ClothingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  // Check if we have a generated logo from the logo generator
  const [logoFromGenerator, setLogoFromGenerator] = useState<string | null>(null);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const hasLogo = params.get('withLogo');
    
    if (hasLogo === 'true') {
      const storedLogo = sessionStorage.getItem('generatedLogo');
      if (storedLogo) {
        setLogoFromGenerator(storedLogo);
        // Remove the query parameter without reloading the page
        navigate('/clothing', { replace: true });
      }
    }
  }, [location, navigate]);
  
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
  
  // Selected product state for customization
  const [selectedProduct, setSelectedProduct] = useState<ClothingProduct | null>(null);
  const [customization, setCustomization] = useState({
    size: '',
    color: '',
    fabric: '',
    quantity: 50,
    logoUrl: logoFromGenerator || '',
    logoPosition: 'left-chest',
    notes: '',
  });
  
  // Logo upload state
  const [, setUploadedLogo] = useState<string | null>(null);
  const [logoUploadError, setLogoUploadError] = useState<string | null>(null);
  
  // Load products on initial render
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      
      try {
        console.log('Attempting to fetch clothing products...');
        const data = await fetchClothingProducts();
        
        if (data && Array.isArray(data)) {
          setProducts(data);
          console.log(`Successfully loaded ${data.length} clothing products`);
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err: any) {
        console.error('Error loading products:', err);
        
        if (err.message === 'Network Error') {
          setError('Unable to connect to the server. Please check if the backend is running.');
        } else if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again later.');
        } else if (err.response && err.response.status === 404) {
          setError('API endpoint not found. Check server configuration.');
        } else {
          setError(`Failed to load products: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);
  
  // Update customization when a logo is received from generator
  useEffect(() => {
    if (logoFromGenerator) {
      setCustomization(prev => ({
        ...prev,
        logoUrl: logoFromGenerator
      }));
    }
  }, [logoFromGenerator]);
  
  // Filter products based on selections
  const filteredProducts = products.filter((product) => {
    // Filter by gender
    if (selectedGender.length > 0 && !product.gender.some(g => selectedGender.includes(g))) {
      return false;
    }
    
    // Filter by size
    if (selectedSizes.length > 0 && !product.availableSizes.some(s => selectedSizes.includes(s))) {
      return false;
    }
    
    // Filter by color
    if (selectedColors.length > 0 && !product.availableColors.some(c => selectedColors.includes(c))) {
      return false;
    }
    
    // Filter by fabric
    if (selectedFabrics.length > 0 && !product.fabricOptions.some(f => selectedFabrics.includes(f))) {
      return false;
    }
    
    // Filter by price
    if (product.basePrice < minPrice || product.basePrice > maxPrice) {
      return false;
    }
    
    return true;
  });
  
  // Toggle selection of filter items
  const toggleFilter = (
    item: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };
  
  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setLogoUploadError('Logo file too large. Maximum size is 5MB.');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoUploadError('Invalid file type. Please upload JPEG, PNG, or SVG.');
      return;
    }
    
    // Read and set the file
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedLogo(event.target.result as string);
        setCustomization(prev => ({
          ...prev,
          logoUrl: event.target?.result as string
        }));
        setLogoUploadError(null);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // Handle opening the customization modal
  const openCustomization = (product: ClothingProduct) => {
    setSelectedProduct(product);
    // Set default customization values
    setCustomization(prev => ({
      ...prev,
      size: product.availableSizes[0],
      color: product.availableColors[0],
      fabric: product.fabricOptions[0],
      quantity: product.minOrderQuantity
    }));
  };
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    // Calculate total price based on quantity and customizations
    const totalPrice = selectedProduct.basePrice * customization.quantity;
    
    // Create cart item
    const cartItem = {
      id: `${selectedProduct.id}-${Date.now()}`,
      type: 'clothing' as const,
      name: selectedProduct.name,
      price: totalPrice,
      quantity: 1, // We're adding one item that represents the bulk order
      imageUrl: selectedProduct.imageUrl,
      size: customization.size,
      color: customization.color,
      fabric: customization.fabric,
      gender: selectedProduct.gender[0],
      logoUrl: customization.logoUrl,
      orderQuantity: customization.quantity,
      logoPosition: customization.logoPosition,
      notes: customization.notes
    };
    
    // Add to cart
    addItem(cartItem);
    
    // Close modal
    setSelectedProduct(null);
    
    // Show success message or redirect to cart
    navigate('/cart');
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
                    onChange={() =>
                      toggleFilter(
                        gender.toLowerCase(),
                        selectedGender,
                        setSelectedGender
                      )
                    }
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
                  className={`flex flex-col items-center cursor-pointer`}
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
                        <Check
                          size={16}
                          className={color.value === 'white' ? 'text-black' : 'text-white'}
                        />
                      </div>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(color.value)}
                    onChange={() =>
                      toggleFilter(color.value, selectedColors, setSelectedColors)
                    }
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
                      onChange={() =>
                        toggleFilter(
                          fabric.toLowerCase(),
                          selectedFabrics,
                          setSelectedFabrics
                        )
                      }
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
            <div className="flex items-center space-x-4">
              <div>
                <label htmlFor="minPrice" className="sr-only">
                  Minimum Price
                </label>
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
              <span className="text-gray-300">to</span>
              <div>
                <label htmlFor="maxPrice" className="sr-only">
                  Maximum Price
                </label>
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
        
        {/* Product Grid */}
        <div className="lg:w-3/4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={product.imageUrl || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
                    <p className="text-gray-300 mb-4 h-12 overflow-hidden">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-teal-400">
                        ${formatPrice(product.basePrice)}
                      </span>
                      <span className="text-sm text-gray-400">
                        Min. Order: {product.minOrderQuantity}
                      </span>
                    </div>
                    <button
                      onClick={() => openCustomization(product)}
                      className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Customize & Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Product Customization Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto text-white border border-gray-700">
            <div className="sticky top-0 bg-gray-800 z-10 p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Customize Your Order</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-300 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Preview */}
                <div>
                  <div className="bg-gray-900 rounded-lg h-80 flex items-center justify-center mb-4 relative overflow-hidden border border-gray-700">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="max-w-full max-h-full object-contain"
                    />
                    
                    {/* Logo Preview */}
                    {customization.logoUrl && (
                      <div
                        className={`absolute w-16 h-16 ${
                          customization.logoPosition === 'left-chest'
                            ? 'top-12 left-12'
                            : customization.logoPosition === 'right-chest'
                            ? 'top-12 right-12'
                            : customization.logoPosition === 'center-chest'
                            ? 'top-12 left-1/2 transform -translate-x-1/2'
                            : 'bottom-12 left-1/2 transform -translate-x-1/2'
                        }`}
                      >
                        <img
                          src={customization.logoUrl}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white">{selectedProduct.name}</h3>
                    <p className="text-teal-400">${formatPrice(selectedProduct.basePrice)} per item</p>
                  </div>
                  
                  {/* Logo Upload/Select */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2 text-white">Add Your Logo</h4>
                    
                    <div className="space-y-4">
                      {/* Upload Logo */}
                      <div className="border border-gray-700 rounded-md p-4">
                        <label className="flex flex-col items-center cursor-pointer">
                          <div className="bg-gray-900 rounded-md w-full py-8 flex flex-col items-center justify-center">
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <span className="text-sm text-gray-400">
                              Click to upload logo (JPG, PNG, SVG)
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.svg"
                            className="hidden"
                            onChange={handleLogoUpload}
                          />
                        </label>
                        
                        {logoUploadError && (
                          <p className="text-red-400 text-sm mt-2">{logoUploadError}</p>
                        )}
                      </div>
                      
                      {/* Or use generated logo */}
                      {logoFromGenerator && (
                        <div className="border border-gray-700 rounded-md p-4">
                          <p className="text-sm text-gray-300 mb-2">Or use your generated logo:</p>
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-900 rounded-md overflow-hidden mr-4 border border-gray-700">
                              <img
                                src={logoFromGenerator}
                                alt="Generated Logo"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <button
                              onClick={() => {
                                setCustomization(prev => ({
                                  ...prev,
                                  logoUrl: logoFromGenerator
                                }));
                              }}
                              className="text-teal-400 text-sm font-medium hover:text-teal-300"
                            >
                              Use this logo
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Logo Position */}
                      {customization.logoUrl && (
                        <div>
                          <h4 className="font-medium mb-2 text-white">Logo Position</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { id: 'left-chest', name: 'Left Chest' },
                              { id: 'right-chest', name: 'Right Chest' },
                              { id: 'center-chest', name: 'Center Chest' },
                              { id: 'back', name: 'Back' },
                            ].map((position) => (
                              <label
                                key={`logo-position-${position.id}`}
                                className={`border rounded-md px-3 py-2 text-center cursor-pointer transition-colors ${
                                  customization.logoPosition === position.id
                                    ? 'bg-teal-900 border-teal-600 text-teal-300'
                                    : 'border-gray-700 hover:bg-gray-700 text-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name="logoPosition"
                                  value={position.id}
                                  checked={customization.logoPosition === position.id}
                                  onChange={(e) =>
                                    setCustomization((prev) => ({
                                      ...prev,
                                      logoPosition: e.target.value,
                                    }))
                                  }
                                  className="sr-only"
                                />
                                {position.name}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Customization Form */}
                <div>
                  <div className="space-y-6">
                    {/* Size Selection */}
                    <div>
                      <label htmlFor="size" className="block font-medium mb-2 text-white">
                        Size
                      </label>
                      <select
                        id="size"
                        value={customization.size}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, size: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {selectedProduct.availableSizes.map((size, index) => (
                          <option key={`size-${size}-${index}`} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Color Selection */}
                    <div>
                      <label className="block font-medium mb-2 text-white">Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedProduct.availableColors.map((colorName, index) => {
                          const colorOption = colorOptions.find(
                            (c) => c.value === colorName.toLowerCase()
                          );
                          return (
                            <label
                              key={`color-select-${colorName}-${index}`}
                              className={`border rounded-md p-2 flex flex-col items-center cursor-pointer transition-colors ${
                                customization.color === colorName
                                  ? 'bg-gray-900 border-teal-500'
                                  : 'border-gray-700 hover:bg-gray-700'
                              }`}
                            >
                              <div
                                className="w-8 h-8 rounded-full border border-gray-700 mb-1"
                                style={{
                                  backgroundColor: colorOption?.hex || '#CCCCCC',
                                  boxShadow:
                                    colorName.toLowerCase() === 'white'
                                      ? 'inset 0 0 0 1px #4b5563'
                                      : 'none',
                                }}
                              ></div>
                              <input
                                type="radio"
                                name="color"
                                value={colorName}
                                checked={customization.color === colorName}
                                onChange={(e) =>
                                  setCustomization((prev) => ({
                                    ...prev,
                                    color: e.target.value,
                                  }))
                                }
                                className="sr-only"
                              />
                              <span className="text-xs text-gray-300">{colorName}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Fabric Selection */}
                    <div>
                      <label htmlFor="fabric" className="block font-medium mb-2 text-white">
                        Fabric
                      </label>
                      <select
                        id="fabric"
                        value={customization.fabric}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, fabric: e.target.value }))
                        }
                        className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      >
                        {selectedProduct.fabricOptions.map((fabric, index) => (
                          <option key={`fabric-${fabric}-${index}`} value={fabric}>
                            {fabric}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Quantity */}
                    <div>
                      <label htmlFor="quantity" className="block font-medium mb-2 text-white">
                        Quantity (Minimum {selectedProduct.minOrderQuantity} pcs)
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        min={selectedProduct.minOrderQuantity}
                        step={10}
                        value={customization.quantity}
                        onChange={(e) =>
                          setCustomization((prev) => ({
                            ...prev,
                            quantity: Math.max(
                              selectedProduct.minOrderQuantity,
                              parseInt(e.target.value)
                            ),
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Special Instructions */}
                    <div>
                      <label htmlFor="notes" className="block font-medium mb-2 text-white">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        id="notes"
                        value={customization.notes}
                        onChange={(e) =>
                          setCustomization((prev) => ({ ...prev, notes: e.target.value }))
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-700 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Any specific requirements for your order..."
                      ></textarea>
                    </div>
                    
                    {/* Total Price */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <div key="price-per-item" className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Price per item:</span>
                        <span className="text-white">${formatPrice(selectedProduct.basePrice)}</span>
                      </div>
                      <div key="quantity" className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Quantity:</span>
                        <span className="text-white">{customization.quantity} pcs</span>
                      </div>
                      <div key="total-price" className="flex justify-between items-center font-bold text-lg border-t border-gray-700 pt-2 mt-2">
                        <span className="text-white">Total Price:</span>
                        <span className="text-teal-400">${formatPrice(selectedProduct.basePrice * customization.quantity)}</span>
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-teal-600 text-white py-3 px-4 rounded-md font-medium hover:bg-teal-700 transition-colors flex items-center justify-center"
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Add to Cart
                    </button>
                    
                    <p className="text-sm text-gray-400 text-center">
                      Not ready to order? Visit our{' '}
                      <Link to="/logo-generator" className="text-teal-400 hover:underline">
                        Logo Generator
                      </Link>{' '}
                      to create a custom logo for your clothing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Information Section */}
      <div className="mt-12 bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Bulk Ordering Information</h2>
        <p className="text-gray-300 mb-4">
          All clothing items require a minimum order quantity as specified per product.
          Customization options include size, color, fabric type, and logo placement.
        </p>
        <p className="text-gray-300">
          Need a custom logo? Try our{' '}
          <Link to="/logo-generator" className="text-teal-400 hover:underline">
            Logo Generator
          </Link>{' '}
          or upload your own design. Production time is typically 2-3 weeks after order confirmation.
        </p>
      </div>
    </div>
  );
};

export default ClothingPage;