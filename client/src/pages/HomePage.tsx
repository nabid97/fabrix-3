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
      
      {/* Hero Section with teal background */}
      <section className="bg-teal-700 text-white py-16 sm:py-24 rounded-2xl overflow-hidden relative mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Fabrics & Custom Clothing Solutions
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-teal-100">
              From design to delivery, we handle all your fabric and clothing needs 
              with quality materials and expert craftsmanship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/fabrics" className="px-8 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Explore Fabrics
              </Link>
              <Link to="/clothing" className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                View Clothing
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section with teal background */}
      <section className="py-16 mb-12 bg-teal-700 text-white rounded-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose FabriX</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-teal-600 p-6 rounded-xl border border-teal-500 transition-colors">
              <div className="bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaPalette className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-teal-100">
                Handpicked fabrics from the finest mills around the world, ensuring superior quality.
              </p>
            </div>
            
            <div className="bg-teal-600 p-6 rounded-xl border border-teal-500 transition-colors">
              <div className="bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaShirt className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Design</h3>
              <p className="text-teal-100">
                Professional design services to create unique clothing that represents your brand.
              </p>
            </div>
            
            <div className="bg-teal-600 p-6 rounded-xl border border-teal-500 transition-colors">
              <div className="bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaRulerHorizontal className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Perfect Fit</h3>
              <p className="text-teal-100">
                Precise measurements and expert tailoring to ensure every garment fits perfectly.
              </p>
            </div>
            
            <div className="bg-teal-600 p-6 rounded-xl border border-teal-500 transition-colors">
              <div className="bg-teal-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FaBolt className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Turnaround</h3>
              <p className="text-teal-100">
                Efficient production process to deliver your orders on time, every time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section with teal background */}
      <section className="py-12 mb-12 bg-teal-700 text-white rounded-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/fabrics" className="group relative h-80 rounded-xl overflow-hidden">
              <img 
                src="https://fabrix-assets.s3.us-east-1.amazonaws.com/fabrics-category.jpg" 
                alt="Fabrics" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">Premium Fabrics</h3>
                <p className="text-gray-200 mb-4">Discover our collection of high-quality fabrics</p>
                <span className="inline-block px-4 py-2 bg-white text-teal-800 rounded-lg font-medium">
                  Shop Now
                </span>
              </div>
            </Link>
            
            <Link to="/clothing" className="group relative h-80 rounded-xl overflow-hidden">
              <img 
                src="https://fabrix-assets.s3.us-east-1.amazonaws.com/clothing-category.jpg" 
                alt="Clothing" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">Custom Clothing</h3>
                <p className="text-gray-200 mb-4">Tailored clothing solutions for your business</p>
                <span className="inline-block px-4 py-2 bg-white text-teal-800 rounded-lg font-medium">
                  Explore
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials with teal background */}
      <section className="py-12 bg-teal-700 text-white rounded-2xl mb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-teal-600 p-6 rounded-xl border border-teal-500">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                
                <blockquote className="text-teal-100 mb-4">
                  "FabriX has been instrumental in helping us launch our clothing line. Their attention to detail and quality fabric selections exceeded our expectations."
                </blockquote>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-500 mr-3"></div>
                  <div>
                    <p className="font-medium">John Smith</p>
                    <p className="text-sm text-teal-200">Fashion Brand Owner</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - already using teal-700 */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-teal-700 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Ready to start your project?</h2>
              <p className="text-teal-100 max-w-xl">
                Contact our team today to discuss your fabric and clothing requirements.
              </p>
            </div>
            <Link to="/contact" className="px-8 py-3 bg-white text-teal-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;