import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-16 text-white">
      <Helmet>
        <title>404 - Page Not Found | FabriX</title>
        <meta name="description" content="The page you requested could not be found." />
      </Helmet>
      
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6 text-white">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-white">Page Not Found</h2>
        <p className="text-lg mb-8 text-gray-300">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="mb-10">
          <Link to="/" className="bg-teal-600 text-white px-6 py-3 rounded-md hover:bg-teal-700 transition-colors">
            Return to Home
          </Link>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Or explore our collections:</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/clothing"
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Shop Clothing
            </Link>
            <Link
              to="/fabrics"
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Shop Fabrics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;