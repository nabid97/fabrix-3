import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaBolt, FaShirt, FaRulerHorizontal, FaPalette } from 'react-icons/fa6';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>FabriX - Premium Fabrics & Custom Clothing Solutions</title>
        <meta name="description" content="FabriX offers premium fabrics and custom clothing solutions for businesses. From design to delivery, we handle all your fabric and clothing needs." />
      </Helmet>
      
      {/* Hero Section - Modern Gradient */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20 sm:py-28 rounded-3xl overflow-hidden relative mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Fabrics <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">& Custom Clothing</span> Solutions
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-indigo-100">
              From design to delivery, we handle all your fabric and clothing needs 
              with quality materials and expert craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/fabrics" className="px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg hover:bg-opacity-90 transition-colors">
                Explore Fabrics
              </Link>
              <Link to="/clothing" className="px-8 py-3 bg-transparent backdrop-blur-sm bg-white/10 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/20 transition-colors">
                View Clothing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section - Clean White */}
      <section className="py-16 mb-16 bg-white border border-gray-100 rounded-3xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose FabriX</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl transition-all hover:translate-y-[-4px] duration-300">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl w-14 h-14 flex items-center justify-center mb-5 transform group-hover:rotate-6 transition-transform">
                <FaPalette className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600">
                Handpicked fabrics from the finest mills around the world, ensuring superior quality.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl transition-all hover:translate-y-[-4px] duration-300">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl w-14 h-14 flex items-center justify-center mb-5 transform group-hover:rotate-6 transition-transform">
                <FaShirt className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Custom Design</h3>
              <p className="text-gray-600">
                Professional design services to create unique clothing that represents your brand.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl transition-all hover:translate-y-[-4px] duration-300">
              <div className="bg-gradient-to-br from-pink-600 to-red-600 rounded-xl w-14 h-14 flex items-center justify-center mb-5 transform group-hover:rotate-6 transition-transform">
                <FaRulerHorizontal className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Perfect Fit</h3>
              <p className="text-gray-600">
                Precise measurements and expert tailoring to ensure every garment fits perfectly.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl transition-all hover:translate-y-[-4px] duration-300">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl w-14 h-14 flex items-center justify-center mb-5 transform group-hover:rotate-6 transition-transform">
                <FaBolt className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Quick Turnaround</h3>
              <p className="text-gray-600">
                Efficient production process to deliver your orders on time, every time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section - Added white container */}
      <section className="py-16 mb-16 bg-white border border-gray-100 rounded-3xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Our Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/fabrics" className="group relative h-96 rounded-3xl overflow-hidden shadow-sm">
              <img 
                src="https://fabrix-assets.s3.us-east-1.amazonaws.com/fabrics-category.jpg" 
                alt="Fabrics" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
              />
              {/* Darker overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-indigo-900/75 to-transparent flex flex-col justify-end p-8">
                {/* Badge with higher contrast */}
                <span className="text-white font-medium mb-2 py-1 px-3 bg-indigo-700 w-fit rounded-full text-xs tracking-wider">COLLECTION</span>
                
                {/* Larger text with text shadow */}
                <h3 className="text-white text-3xl font-bold mb-3 drop-shadow-lg">Premium Fabrics</h3>
                
                {/* Brighter text for paragraph */}
                <p className="text-white mb-5 max-w-xs font-medium drop-shadow-md">
                  Discover our collection of high-quality fabrics for any project
                </p>
                
                {/* More prominent button */}
                <span className="inline-flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 rounded-lg font-medium group-hover:bg-indigo-50 transition-colors w-fit shadow-lg">
                  Shop Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              </div>
            </Link>
            
            <Link to="/clothing" className="group relative h-96 rounded-3xl overflow-hidden shadow-sm">
              <img 
                src="https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing-category.jpg" 
                alt="Clothing" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
              />
              {/* Darker overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-purple-900/75 to-transparent flex flex-col justify-end p-8">
                {/* Badge with higher contrast */}
                <span className="text-white font-medium mb-2 py-1 px-3 bg-purple-700 w-fit rounded-full text-xs tracking-wider">COLLECTION</span>
                
                {/* Larger text with text shadow */}
                <h3 className="text-white text-3xl font-bold mb-3 drop-shadow-lg">Custom Clothing</h3>
                
                {/* Brighter text for paragraph */}
                <p className="text-white mb-5 max-w-xs font-medium drop-shadow-md">
                  Tailored clothing solutions designed specifically for your business
                </p>
                
                {/* More prominent button */}
                <span className="inline-flex items-center gap-2 px-5 py-3 bg-white text-purple-700 rounded-lg font-medium group-hover:bg-purple-50 transition-colors w-fit shadow-lg">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover:translate-x-1 transition-transform">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials - Elegant Design */}
      <section className="py-16 bg-gray-50 rounded-3xl mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">What Our Clients Say</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Our clients trust us to deliver quality products that exceed their expectations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sophia Williams",
                role: "Fashion Designer",
                text: "FabriX has been instrumental in helping us launch our clothing line. Their attention to detail and quality fabric selections exceeded our expectations."
              },
              {
                name: "Michael Chen",
                role: "Business Owner",
                text: "Working with FabriX transformed our uniform program. The quality is exceptional and our employees love the comfort and professional appearance."
              },
              {
                name: "Emily Rodriguez",
                role: "Interior Designer",
                text: "The upholstery fabrics from FabriX are second to none. Their extensive collection and customization options helped us create unique spaces for our clients."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 mr-3 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Major Customers Section */}
      <section className="py-16 bg-gray-50 rounded-3xl mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">Our Suppliers' Biggest Customers</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We work with fabric suppliers trusted by the world's leading fashion retailers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primark */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="h-16 mb-6 flex items-center justify-center">
                <img 
                  src="https://fabrix-assets.s3.us-east-1.amazonaws.com/primark-logo.jpg" 
                  alt="Primark Logo" 
                  className="h-12 object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">Primark</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Annual Volume:</span>
                  <span>250,000+ meters</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Key Products:</span>
                  <span>Cotton blends, Sustainable materials</span>
                </div>
                <p className="text-gray-600 mt-4">
                  Primark sources over 80% of their cotton through sustainable farming initiatives, 
                  working with suppliers who meet their rigorous ethical and environmental standards.
                </p>
              </div>
            </div>
            
            {/* Zara */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="h-16 mb-6 flex items-center justify-center">
                <img 
                  src="https://fabrix-assets.s3.us-east-1.amazonaws.com/zara-logo.png" 
                  alt="Zara Logo" 
                  className="h-10 object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">Zara</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Annual Volume:</span>
                  <span>450,000+ meters</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Key Products:</span>
                  <span>Premium fabrics, Technical materials</span>
                </div>
                <p className="text-gray-600 mt-4">
                  Zara partners with innovative textile mills to develop exclusive fabrics. 
                  Their Join Life initiative promotes sustainable materials with 80% of their energy coming from renewable sources.
                </p>
              </div>
            </div>
            
            {/* H&M */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-200 transition-colors">
              <div className="h-16 mb-6 flex items-center justify-center">
                <img 
                  src="https://fabrix-assets.s3.us-east-1.amazonaws.com/hm-logo.jpg" 
                  alt="H&M Logo" 
                  className="h-10 object-contain"
                />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-800">H&M</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Annual Volume:</span>
                  <span>600,000+ meters</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-2">Key Products:</span>
                  <span>Recycled polyester, Organic cotton</span>
                </div>
                <p className="text-gray-600 mt-4">
                  H&M Group is committed to using 100% recycled or sustainably sourced materials by 2030. 
                  Currently, 64.5% of their materials come from recycled or more sustainably sourced materials.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              Our fabric suppliers meet the rigorous quality and sustainability standards required by these global retail leaders.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section - Bold Gradient */}
      <section className="py-8 mb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to start your project?</h2>
              <p className="text-indigo-100 max-w-xl text-lg">
                Contact our team today to discuss your fabric and clothing requirements.
              </p>
            </div>
            <Link 
              to="/contact" 
              className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors whitespace-nowrap shadow-lg shadow-indigo-600/20 transform hover:-translate-y-1 duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;