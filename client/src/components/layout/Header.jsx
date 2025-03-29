import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-teal-600">FabriX</Link>
        <nav className="space-x-4">
          <Link to="/" className="text-gray-700 hover:text-teal-600">Home</Link>
          {isAuthenticated && (
            <Link to="/order-history" className="text-gray-700 hover:text-teal-600">Order History</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;