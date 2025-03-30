import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Shield, PenTool, Ruler, Palette } from 'lucide-react';
import { ClothingProduct } from '../types/product'; // Import the centralized interface


const ViewDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ClothingProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (!id) {
          setError('No product ID provided');
          setLoading(false);
          return;
        }
        
        console.log(`Fetching details for product ID: ${id}`);
        setLoading(true);
        
        // Make sure your API endpoint can handle the MongoDB ObjectId
        const response = await fetch(`/api/products/clothing/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch product details (status: ${response.status})`);
        }
        
        const data = await response.json();
        console.log('Fetched product details:', data);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Unable to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen text-white">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-semibold mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error || 'Product not found'}</p>
          <button 
            onClick={() => navigate('/clothing')}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen text-white">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => navigate('/clothing')}
          className="flex items-center text-teal-400 hover:text-teal-300 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to All Products
        </button>
      </div>
      
      {/* Product Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-lg text-gray-300">{product.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <div className="bg-gray-700 rounded-lg overflow-hidden mb-4">
              <img 
                src={product.imageUrl || (product.images ? product.images[0] : '')} 
                alt={product.name}
                className="w-full h-auto object-contain aspect-square"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://fabrix-assets.s3.us-east-1.amazonaws.com/placeholder.jpg";
                }}
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg overflow-hidden aspect-square">
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://fabrix-assets.s3.us-east-1.amazonaws.com/placeholder.jpg";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Details */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'overview' 
                ? 'border-b-2 border-teal-500 text-teal-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'materials' 
                ? 'border-b-2 border-teal-500 text-teal-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveTab('sizing')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'sizing' 
                ? 'border-b-2 border-teal-500 text-teal-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Sizing
            </button>
            <button
              onClick={() => setActiveTab('customization')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'customization' 
                ? 'border-b-2 border-teal-500 text-teal-400' 
                : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Customization
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Product Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Product Type</h3>
                    <p className="text-gray-300">Clothing - {product.name}</p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Designed For</h3>
                    <p className="text-gray-300 capitalize">{product.gender.join(', ')}</p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Available Colors</h3>
                    <p className="text-gray-300">{product.availableColors.join(', ')}</p>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Available Sizes</h3>
                    <p className="text-gray-300">{product.availableSizes.join(', ')}</p>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg mb-6">
                  <div className="flex">
                    <Info size={20} className="text-teal-400 mr-3 flex-shrink-0" />
                    <p className="text-gray-300">
                      Bulk orders available with customization options. Minimum order quantity: 
                      <span className="font-semibold text-white ml-1">{product.minOrderQuantity || 1} units</span>
                    </p>
                  </div>
                </div>
                
                <h3 className="font-medium mb-3">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-6">
                  <li>Professional-grade quality suitable for corporate and casual settings</li>
                  <li>Multiple fabric options for comfort and durability</li>
                  <li>Available in a wide range of colors and sizes</li>
                  <li>Custom branding options available for corporate identity</li>
                  <li>Bulk discounts available for large orders</li>
                </ul>
                
                <div className="bg-teal-900/30 border border-teal-800 rounded-lg p-4">
                  <p className="text-teal-300">
                    This product is part of our premium clothing line, designed specifically for 
                    businesses looking for high-quality corporate apparel.
                  </p>
                </div>
              </div>
            )}
            
            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div>
                <div className="flex items-center mb-6">
                  <Palette size={24} className="text-teal-400 mr-3" />
                  <h2 className="text-xl font-semibold">Materials & Fabrics</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Available Fabric Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.fabricOptions.map((fabric, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">{fabric}</h4>
                          <p className="text-gray-300 text-sm">
                            {getFabricDescription(fabric)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Color Options</h3>
                    <div className="flex flex-wrap gap-3 mb-4">
                      {product.availableColors.map(color => (
                        <div key={color} className="flex flex-col items-center">
                          <div 
                            className="h-10 w-10 rounded-full border border-gray-600"
                            style={{ backgroundColor: getColorHex(color) }}
                          ></div>
                          <span className="text-xs mt-1 text-gray-300">{color}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Custom colors available for orders over 100 units. Contact our sales team for details.
                    </p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Care Instructions</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                      <li>Machine wash cold with similar colors</li>
                      <li>Use mild detergent, no bleach</li>
                      <li>Tumble dry low or hang to dry</li>
                      <li>Iron on low heat if needed</li>
                      <li>Do not dry clean</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Sizing Tab */}
            {activeTab === 'sizing' && (
              <div>
                <div className="flex items-center mb-6">
                  <Ruler size={24} className="text-teal-400 mr-3" />
                  <h2 className="text-xl font-semibold">Size Guide</h2>
                </div>
                
                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-700">
                        <th className="text-left p-3">Size</th>
                        <th className="p-3">Chest (in)</th>
                        <th className="p-3">Waist (in)</th>
                        <th className="p-3">Hip (in)</th>
                        <th className="p-3">Length (in)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-700">
                        <td className="p-3 font-medium">XS</td>
                        <td className="p-3 text-center">32-34</td>
                        <td className="p-3 text-center">26-28</td>
                        <td className="p-3 text-center">34-36</td>
                        <td className="p-3 text-center">26</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-3 font-medium">S</td>
                        <td className="p-3 text-center">35-37</td>
                        <td className="p-3 text-center">29-31</td>
                        <td className="p-3 text-center">37-39</td>
                        <td className="p-3 text-center">27</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-3 font-medium">M</td>
                        <td className="p-3 text-center">38-40</td>
                        <td className="p-3 text-center">32-34</td>
                        <td className="p-3 text-center">40-42</td>
                        <td className="p-3 text-center">28</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-3 font-medium">L</td>
                        <td className="p-3 text-center">41-43</td>
                        <td className="p-3 text-center">35-37</td>
                        <td className="p-3 text-center">43-45</td>
                        <td className="p-3 text-center">29</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="p-3 font-medium">XL</td>
                        <td className="p-3 text-center">44-46</td>
                        <td className="p-3 text-center">38-40</td>
                        <td className="p-3 text-center">46-48</td>
                        <td className="p-3 text-center">30</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">2XL</td>
                        <td className="p-3 text-center">47-49</td>
                        <td className="p-3 text-center">41-43</td>
                        <td className="p-3 text-center">49-51</td>
                        <td className="p-3 text-center">31</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Measurement Tips</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-300 text-sm">
                    <li>Chest: Measure at the fullest part of your chest, under your arms</li>
                    <li>Waist: Measure around your natural waistline</li>
                    <li>Hip: Measure at the fullest part of your hips</li>
                    <li>Length: Measure from the highest point of the shoulder to the hem</li>
                  </ul>
                </div>
                
                <div className="bg-teal-900/30 border border-teal-800 rounded-lg p-4">
                  <div className="flex">
                    <Info size={20} className="text-teal-400 mr-3 flex-shrink-0" />
                    <p className="text-teal-300 text-sm">
                      Need help with sizing? Our team can provide detailed size guides specifically 
                      for your team. We also offer pre-production samples to ensure the perfect fit.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Customization Tab */}
            {activeTab === 'customization' && (
              <div>
                <div className="flex items-center mb-6">
                  <PenTool size={24} className="text-teal-400 mr-3" />
                  <h2 className="text-xl font-semibold">Customization Options</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Logo Placement</h3>
                    {product.customizationOptions?.logoPositions ? (
                      <div>
                        <p className="text-gray-300 mb-3">Available positions for your logo:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {product.customizationOptions.logoPositions.map(position => (
                            <div key={position} className="bg-gray-800 p-3 rounded text-center">
                              <span className="text-sm capitalize">{position.replace('-', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300">Standard logo placement options available.</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Branding Techniques</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded">
                        <h4 className="font-medium mb-1">Embroidery</h4>
                        <p className="text-gray-300 text-sm">
                          Premium stitched logos that create a textured, professional look.
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <h4 className="font-medium mb-1">Screen Printing</h4>
                        <p className="text-gray-300 text-sm">
                          Durable, cost-effective option for vibrant designs with solid colors.
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <h4 className="font-medium mb-1">Heat Transfer</h4>
                        <p className="text-gray-300 text-sm">
                          Ideal for complex, multi-color designs with detailed graphics.
                        </p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <h4 className="font-medium mb-1">Direct-to-Garment</h4>
                        <p className="text-gray-300 text-sm">
                          Perfect for photographic images and gradient color designs.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Color Customization</h3>
                    <p className="text-gray-300 mb-2">
                      {product.customizationOptions?.allowsCustomColors 
                        ? 'This product allows for custom color selection beyond our standard options.'
                        : 'This product is available in our standard color options only.'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Custom colors require a minimum order of 100 units and may affect pricing.
                    </p>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Additional Options</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                      <li>Individual name/number printing</li>
                      <li>QR code integration</li>
                      <li>Special packaging options</li>
                      <li>Hang tags and custom labels</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Technical Specifications */}
          <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Shield size={24} className="text-teal-400 mr-3" />
              <h2 className="text-xl font-semibold">Product Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">General</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-300">Product ID</span>
                    <span className="font-medium">{product.id}</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-300">Category</span>
                    <span className="font-medium">Clothing</span>
                  </li>
                  <li className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-300">Gender</span>
                    <span className="font-medium capitalize">{product.gender.join(', ')}</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span className="text-gray-300">Min. Order</span>
                    <span className="font-medium">{product.minOrderQuantity || 1} units</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Sustainability</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="bg-teal-900/30 p-1 rounded-full mt-1 mr-3">
                      <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Eco-friendly options available with organic materials
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-teal-900/30 p-1 rounded-full mt-1 mr-3">
                      <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Responsible manufacturing processes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-teal-900/30 p-1 rounded-full mt-1 mr-3">
                      <svg className="w-4 h-4 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <span className="text-gray-300">
                      Reduced packaging waste
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact CTA */}
      <div className="mt-12 max-w-3xl mx-auto bg-teal-900/30 border border-teal-800 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold mb-3">Need More Information?</h2>
        <p className="text-gray-300 mb-4">
          Our team is ready to help with any questions about this product, customization options, 
          or bulk ordering details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/contact')}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-6 rounded transition-colors"
          >
            Contact Sales
          </button>
          <button 
            onClick={() => navigate('/clothing')}
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions for color and fabric descriptions
function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    'White': '#FFFFFF',
    'Black': '#000000',
    'Navy': '#0a192f',
    'Red': '#e11d48',
    'Green': '#059669',
    'Blue': '#3b82f6',
    'Gray': '#6b7280',
    'Yellow': '#fbbf24',
    'Purple': '#8b5cf6',
    'Pink': '#ec4899',
    'Light Blue': '#7dd3fc'
  };
  
  return colorMap[colorName] || '#CCCCCC';
}

function getFabricDescription(fabricType: string): string {
  const fabricDescriptions: Record<string, string> = {
    'Cotton': 'Soft, breathable 100% cotton fabric that provides all-day comfort.',
    'Cotton-Poly Blend': 'Durable blend offering the comfort of cotton with wrinkle resistance of polyester.',
    'Performance': 'Moisture-wicking fabric designed for active use with anti-microbial properties.',
    'Organic': 'Environmentally friendly cotton grown without pesticides or synthetic fertilizers.',
    'Fleece': 'Soft, warm fabric with excellent insulating properties for cooler conditions.',
    'Waterproof': 'Water-resistant material designed to keep you dry in wet conditions.',
    'Breathable': 'Lightweight construction allowing air circulation to keep you comfortable.',
    'Insulated': 'Thermal layer that provides warmth without adding excessive bulk.',
    'Water-Resistant': 'Repels light moisture while maintaining breathability.'
  };
  
  return fabricDescriptions[fabricType] || 'High-quality fabric designed for durability and comfort.';
}

export default ViewDetailsPage;