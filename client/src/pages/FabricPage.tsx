import { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { fetchFabrics } from '../api/productApi';
import { ShoppingCart, Filter, X, Plus, Minus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { getS3ImageUrl } from '../utils/imageUtils';
import FabricCard from '../components/product/FabricCard';
import { FabricProduct } from '../types/product'; // Use the centralized interface

// Move this function definition before your FabricsPage component:

// Utility function to extract material type from fabric name
const getMaterialTypeFromName = (fabricName: string): string => {
  // Normalize the input
  const normalizedName = fabricName.toLowerCase();
  
  // Check for specific material types in the name
  if (normalizedName.includes('cotton')) return 'Cotton';
  if (normalizedName.includes('polyester')) return 'Polyester';
  if (normalizedName.includes('linen')) return 'Linen';
  if (normalizedName.includes('silk')) return 'Silk';
  if (normalizedName.includes('wool')) return 'Wool';
  if (normalizedName.includes('canvas')) return 'Canvas';
  if (normalizedName.includes('fleece')) return 'Fleece';
  if (normalizedName.includes('oxford')) return 'Oxford';
  if (normalizedName.includes('poplin')) return 'Poplin';
  if (normalizedName.includes('bamboo')) return 'Bamboo';
  if (normalizedName.includes('twill')) return 'Twill';
  if (normalizedName.includes('jersey')) return 'Jersey';
  if (normalizedName.includes('softshell')) return 'Softshell';
  
  // Default to Cotton if no match is found
  return 'Cotton';
};

// Format price utility function
const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) return '0.00';
  return price.toFixed(2);
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
  { name: 'Beige', value: 'beige', hex: '#e5e7eb' },
  { name: 'Brown', value: 'brown', hex: '#92400e' },
];

// Sort options
type SortOption = 'name' | 'pricePerMeter' | 'type';
type SortDirection = 'asc' | 'desc';

const FabricPage = () => {
  const { addItem } = useCart();
  
  // Fabric state
  const [fabrics, setFabrics] = useState<FabricProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting states
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Selected fabric state for customization
  const [selectedFabric, setSelectedFabric] = useState<FabricProduct | null>(null);
  const [customization, setCustomization] = useState({
    color: '',
    length: 1, // Default to 1 meter
    notes: '',
  });
  
  // Add this temporarily to debug your API data
  useEffect(() => {
    if (fabrics.length > 0) {
      console.log('All fabric types:');
      fabrics.forEach(fabric => {
        console.log(`- ${fabric.name}: "${fabric.type}"`);
      });
    }
  }, [fabrics]);
  
  // Add this to see the raw API response
  useEffect(() => {
    // Log the raw API response
    const checkApiResponse = async () => {
      try {
        const response = await fetch('/api/products/fabric');
        const data = await response.json();
        console.log('Raw API response:', data);
      } catch (err) {
        console.error('Error fetching raw API data:', err);
      }
    };
    
    checkApiResponse();
  }, []);
  
  // Load fabrics on initial render
  useEffect(() => {
    const loadFabrics = async () => {
      setLoading(true);
      try {
        const data = await fetchFabrics();
        
        // Transform data before setting it to state
        const formattedData = data.map((fabric: any) => ({
          id: fabric._id, // Use `_id` from the API response
          name: fabric.name,
          type: (fabric.type || 'fabric').toLowerCase(), // Force lowercase for consistency
          pricePerMeter: fabric.price || 0, // Map `price` to `pricePerMeter`
          imageUrl: fabric.images?.[0] ?? 'default-image-url.jpg', // Ensure imageUrl is always a string
          description: fabric.description || '',
          availableColors: fabric.availableColors || ['White', 'Black'],
          styles: fabric.styles || ['Regular'], // Ensure styles is always an array
          composition: Array.isArray(fabric.composition) 
            ? fabric.composition.join(', ') 
            : fabric.composition || 'Unknown',
          weight: fabric.weight || 'Medium',
          minOrderLength: fabric.minOrderLength || fabric.minOrderQuantity || 1
        }));
        
        // Use the transformed data instead of raw data
        console.log('About to set fabrics state with formatted data');
        setFabrics(formattedData);
      } catch (err) {
        setError('Failed to load fabrics. Please try again later.');
        console.error('Error loading fabrics:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadFabrics();
  }, []);
  
  // Filter fabrics based on selections
  const getFilteredFabrics = () => {
    return fabrics.filter((fabric) => {
      // Debug log to see what's happening
      console.log('Filtering fabric:', {
        name: fabric.name,
        type: fabric.type,
        selectedTypes: selectedTypes,
        typeMatch: selectedTypes.length === 0 || selectedTypes.includes(fabric.type.toLowerCase())
      });
      
      // Fix the type filtering in getFilteredFabrics()
      if (selectedTypes.length > 0) {
        const fabricTypeLower = (fabric.type || '').toLowerCase();
        if (!selectedTypes.some(type => fabricTypeLower === type.toLowerCase())) {
          return false;
        }
      }
      
      // Filter by color - no changes needed here
      
      // Filter by style - no changes needed here
      
      // Filter by price - ensure pricePerMeter is a number
      const price = Number(fabric.pricePerMeter);
      if (isNaN(price) || price < minPrice || price > maxPrice) {
        return false;
      }
      
      return true;
    });
  }
  
  // Sort the filtered fabrics - fix potential undefined values
const getSortedFabrics = () => {
  const filteredFabrics = getFilteredFabrics();
  
  return [...filteredFabrics].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = (a.name || '').localeCompare(b.name || '');
        break;
      case 'pricePerMeter':
        comparison = (Number(a.pricePerMeter) || 0) - (Number(b.pricePerMeter) || 0);
        break;
      case 'type':
        comparison = (a.type || '').localeCompare(b.type || '');
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
};
  
  // Get the sorted and filtered fabrics
  const sortedFilteredFabrics = getSortedFabrics();
  
  // Add this to debug sort changes
  useEffect(() => {
    console.log(`Sort changed to: ${sortBy} ${sortDirection}`);
    console.log('First 3 sorted fabrics:', sortedFilteredFabrics.slice(0, 3).map(f => f.name));
  }, [sortBy, sortDirection, sortedFilteredFabrics]);
  
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
   const getFabricImageKey = (fabricName: string, fabricType: string): string => {
    // If fabric type is not generic, use it
    if (fabricType && fabricType.toLowerCase() !== 'fabric') {
      return `fabrics/${fabricType}.jpg`;
    }
    
    // Otherwise extract type from name
    const materialType = getMaterialTypeFromName(fabricName);
    return `fabrics/${materialType}.jpg`;
  };
  // Handle sorting changes
  const handleSortChange = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort option and default to ascending
      setSortBy(option);
      setSortDirection('asc');
    }
  };
  
  // Render sort icon based on current state
  const renderSortIcon = (option: SortOption) => {
    if (sortBy !== option) {
      return <ArrowUpDown size={16} className="ml-1 text-gray-400" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={16} className="ml-1 text-teal-600" />
      : <ArrowDown size={16} className="ml-1 text-teal-600" />;
  };
  
  // Handle opening the customization modal
  const openCustomization = (fabric: FabricProduct) => {
    setSelectedFabric(fabric);
    // Set default customization values
    setCustomization({
      color: fabric.availableColors[0],
      length: fabric.minOrderLength,
      notes: '',
    });
  };
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (!selectedFabric) return;
  
    // Ensure pricePerMeter and length are valid numbers
    const pricePerMeter = selectedFabric.pricePerMeter || 0;
    const length = customization.length || 1;
  
    // Calculate total price
    const totalPrice = pricePerMeter * length;
  
    // Create cart item
    const cartItem = {
      id: `${selectedFabric.id}-${Date.now()}`,
      type: 'fabric' as const,
      name: selectedFabric.name,
      price: totalPrice,
      quantity: 1, // One order item
      imageUrl: getS3ImageUrl(getFabricImageKey(selectedFabric.name, selectedFabric.type)), // Use S3 URL
      fabricType: selectedFabric.type,
      color: customization.color,
      length: length,
      fabricStyle: selectedFabric.styles[0],
      notes: customization.notes,
    };
  
    // Add to cart
    addItem(cartItem);
  
    // Close modal
    setSelectedFabric(null);
  };
  
  // All possible fabric types from the data
  const allFabricTypes = [...new Set(fabrics.map((fabric) => fabric.type.toLowerCase()))];
  
  // All possible fabric styles from the data
  const allFabricStyles = [...new Set(fabrics.flatMap((fabric) => fabric.styles.map(s => s.toLowerCase())))];
  
  // Render fabrics using FabricCard component
  const renderFabrics = () => {
    // Change this line - use sortedFilteredFabrics instead of getFilteredFabrics()
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedFilteredFabrics.map((fabric) => (
          <FabricCard 
            key={fabric.id} 
            fabric={{
              ...fabric,
              imageUrl: fabric.imageUrl || 'default-image-url.jpg' // Ensure imageUrl is not undefined
            }} 
            onClick={openCustomization} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 neutral-50 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-white">Premium Fabrics</h1>
      
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full bg-gray-800 px-4 py-2 rounded-md flex items-center justify-center space-x-2 text-white"
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
          } lg:block lg:w-1/4 bg-gray-800 rounded-xl shadow-md p-6 h-fit sticky top-24 text-white border border-gray-700`}
        >
          <h2 className="text-xl font-semibold mb-6 text-white">Filters</h2>
          
          {/* Fabric Type Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Fabric Type</h3>
            <div className="space-y-2">
              {allFabricTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                    className="rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                  />
                  <span className="capitalize text-gray-200">{type}</span>
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={color.value === 'white' ? 'black' : 'white'}
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
          
          {/* Fabric Style Filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Fabric Style</h3>
            <div className="space-y-2">
              {allFabricStyles.map((style) => (
                <label key={style} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStyles.includes(style)}
                    onChange={() => toggleFilter(style, selectedStyles, setSelectedStyles)}
                    className="rounded border-gray-600 text-teal-500 focus:ring-teal-500 bg-gray-700"
                  />
                  <span className="capitalize text-gray-200">{style}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Price Range Filter - Fix styling and ensure values are numbers */}
          <div className="mb-6">
            <h3 className="font-medium mb-3 text-white">Price Range (per meter)</h3>
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
              setSelectedTypes([]);
              setSelectedColors([]);
              setSelectedStyles([]);
              setMinPrice(0);
              setMaxPrice(100);
            }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
        
        {/* Fabric Grid and Sorting */}
        <div className="lg:w-3/4">
          {/* Sorting Controls */}
          <div className="bg-gray-800 rounded-xl shadow-md mb-6 p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">
                {sortedFilteredFabrics.length} {sortedFilteredFabrics.length === 1 ? 'fabric' : 'fabrics'} found
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
                  onClick={() => handleSortChange('pricePerMeter')}
                  className={`flex items-center ${sortBy === 'pricePerMeter' ? 'text-teal-400 font-medium' : 'text-gray-300'}`}
                >
                  Price
                  {renderSortIcon('pricePerMeter')}
                </button>
                <button 
                  onClick={() => handleSortChange('type')}
                  className={`flex items-center ${sortBy === 'type' ? 'text-teal-400 font-medium' : 'text-gray-300'}`}
                >
                  Type
                  {renderSortIcon('type')}
                </button>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 text-red-100 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : sortedFilteredFabrics.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2 text-white">No fabrics found</h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedColors([]);
                  setSelectedStyles([]);
                  setMinPrice(0);
                  setMaxPrice(100);
                }}
                className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            renderFabrics()
          )}
        </div>
      </div>
      
      {/* Fabric Customization Modal */}
      {selectedFabric && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto text-white border border-gray-700">
            <div className="sticky top-0 bg-gray-800 z-10 p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Order Fabric</h2>
              <button
                onClick={() => setSelectedFabric(null)}
                className="text-gray-300 hover:text-white"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Fabric Preview */}
                <div>
                  <div className="bg-gray-900 rounded-lg h-64 flex items-center justify-center mb-4 border border-gray-700">
                    <img
                      src={getS3ImageUrl(getFabricImageKey(selectedFabric.name, selectedFabric.type))}
                      alt={selectedFabric.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white">{selectedFabric.name}</h3>
                    <p className="text-teal-400">${formatPrice(selectedFabric.pricePerMeter)} per meter</p>
                  </div>
                  
                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-gray-200">{selectedFabric.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Composition:</span>
                        <span className="text-gray-200">{selectedFabric.composition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Weight:</span>
                        <span className="text-gray-200">{selectedFabric.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Order:</span>
                        <span className="text-gray-200">{selectedFabric.minOrderLength} meters</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Customization Form */}
                <div>
                  <div className="space-y-6">
                    {/* Color Selection */}
                    <div>
                      <label className="block font-medium mb-2 text-white">Color</label>
                      <div className="grid grid-cols-4 gap-2">
                        {selectedFabric.availableColors.map((colorName) => {
                          const colorOption = colorOptions.find(
                            (c) => c.value === colorName.toLowerCase()
                          );
                          return (
                            <label
                              key={colorName}
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
                    
                    {/* Length Selection */}
                    <div>
                      <label htmlFor="length" className="block font-medium mb-2 text-white">
                        Length (meters)
                      </label>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              length: Math.max(selectedFabric.minOrderLength, prev.length - 1),
                            }))
                          }
                          className="bg-gray-700 p-2 rounded-l-md hover:bg-gray-600 transition-colors text-white"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="number"
                          id="length"
                          min={selectedFabric.minOrderLength}
                          step={1}
                          value={customization.length}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              length: Math.max(
                                selectedFabric.minOrderLength,
                                parseInt(e.target.value) || selectedFabric.minOrderLength
                              ),
                            }))
                          }
                          className="w-20 text-center py-2 border-y border-gray-700 focus:outline-none focus:ring-0 bg-gray-700 text-white"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setCustomization((prev) => ({
                              ...prev,
                              length: prev.length + 1,
                            }))
                          }
                          className="bg-gray-700 p-2 rounded-r-md hover:bg-gray-600 transition-colors text-white"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
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
                        className="w-full px-4 py-2 border border-gray-700 bg-gray-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent text-white"
                        placeholder="Any specific requirements for your order..."
                      ></textarea>
                    </div>
                    
                    {/* Total Price */}
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Price per meter:</span>
                        <span className="text-white">${formatPrice(selectedFabric.pricePerMeter)}/m</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Length:</span>
                        <span className="text-white">{customization.length} m</span>
                      </div>
                      <div className="flex justify-between items-center font-bold text-lg border-t border-gray-700 pt-2 mt-2">
                        <span className="text-white">Total Price:</span>
                        <span className="text-teal-400">
                          ${formatPrice((selectedFabric.pricePerMeter || 0) * (customization.length || 1))}
                        </span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Information Section */}
      <div className="mt-12 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">About Our Fabrics</h2>
        <p className="text-gray-300 mb-4">
          All our fabrics are sourced from premium suppliers and undergo rigorous quality testing. 
          We offer a wide range of fabric types suitable for various applications, from fashion to 
          home décor and industrial use.
        </p>
        <p className="text-gray-300">
          Each fabric has a minimum order length requirement. Custom dyeing and printing services 
          are available for larger orders. Please contact our team for special requirements not 
          available through our standard ordering process.
        </p>
      </div>
    </div>
  );
};

export default FabricPage;