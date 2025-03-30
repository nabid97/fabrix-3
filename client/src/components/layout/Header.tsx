import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Menu, X, ShoppingBag, User, Search, ChevronDown } from 'lucide-react';
import logo from '../../assets/FabriXlogo.png';


const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Categories dropdown state
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Call handler right away to get initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle categories dropdown
  const toggleCategoriesDropdown = () => {
    setCategoriesOpen(prev => !prev);
  };

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src={logo} 
                  alt="FabriX" 
                  className="h-10 md:h-10" // Updated height to make it 5 times bigger
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-teal-600 font-medium">Home</Link>
              
              {/* Categories dropdown */}
              <div className="relative group" ref={dropdownRef}>
                <button 
                  className="flex items-center text-gray-700 hover:text-teal-600 font-medium"
                  onClick={toggleCategoriesDropdown}
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                >
                  Categories <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown menu - Visible based on categoriesOpen state */}
                <div 
                  className={`absolute left-0 w-56 mt-2 bg-white shadow-xl rounded-lg py-2 transform transition-all duration-200 ${
                    categoriesOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <Link 
                    to="/clothing" 
                    className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    onClick={() => setTimeout(() => setCategoriesOpen(false), 100)}
                  >
                    Clothing
                  </Link>
                  <Link 
                    to="/fabrics" 
                    className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    onClick={() => setTimeout(() => setCategoriesOpen(false), 100)}
                  >
                    Fabrics
                  </Link>
                  <Link 
                    to="/logo-generator" 
                    className="block px-4 py-2 text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                    onClick={() => setTimeout(() => setCategoriesOpen(false), 100)}
                  >
                    Logo Generator
                  </Link>
                </div>
              </div>
              
              <Link to="/contact" className="text-gray-700 hover:text-teal-600 font-medium">Contact</Link>
              <Link to="/faq" className="text-gray-700 hover:text-teal-600 font-medium">FAQ</Link>

              {/* Order History Link */}
              {isAuthenticated && (
                <Link to="/order-history" className="text-gray-700 hover:text-teal-600 font-medium">Order History</Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-gray-700 hover:text-teal-600 focus:outline-none"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              
              {/* User Account */}
              {isAuthenticated ? (
                <Link to="/account" className="hidden sm:flex text-gray-700 hover:text-teal-600 items-center space-x-1">
                  <User size={20} />
                  <span className="text-sm">{user?.name || 'Account'}</span>
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:flex text-gray-700 hover:text-teal-600 items-center space-x-1">
                  <User size={20} />
                  <span className="text-sm">Sign In</span>
                </Link>
              )}
              
              {/* Cart */}
              <Link to="/cart" className="text-gray-700 hover:text-teal-600 relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-teal-600 focus:outline-none"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {/* Search Bar - Expandable */}
          <div className={`mt-4 transition-all duration-300 overflow-hidden ${searchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-600">
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Empty spacer element to prevent content from being hidden behind fixed header */}
      <div className={`${isScrolled ? 'h-16' : 'h-20'} transition-all duration-300`}></div>
      
      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu Sidebar */}
      <div 
        className={`fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="text-lg font-semibold">Menu</span>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-6">
          <Link to="/" className="block text-lg font-medium">Home</Link>
          
          <div className="space-y-4">
            <p className="font-bold text-gray-700">Categories</p>
            <Link to="/clothing" className="block ml-4 text-gray-600 hover:text-teal-600">Clothing</Link>
            <Link to="/fabrics" className="block ml-4 text-gray-600 hover:text-teal-600">Fabrics</Link>
            <Link to="/logo-generator" className="block ml-4 text-gray-600 hover:text-teal-600">Logo Generator</Link>
          </div>
          
          <Link to="/contact" className="block text-lg font-medium">Contact</Link>
          <Link to="/faq" className="block text-lg font-medium">FAQ</Link>
          
          {/* Order History Link */}
          {isAuthenticated && (
            <Link to="/order-history" className="block text-lg font-medium">Order History</Link>
          )}
          
          <div className="pt-6 mt-6 border-t border-gray-200">
            {isAuthenticated ? (
              <Link to="/account" className="flex items-center py-2 text-gray-600 hover:text-teal-600">
                <User size={20} className="mr-2" />
                My Account
              </Link>
            ) : (
              <Link to="/login" className="flex items-center py-2 text-gray-600 hover:text-teal-600">
                <User size={20} className="mr-2" />
                Sign In
              </Link>
            )}
            <Link to="/cart" className="flex items-center py-2 text-gray-600 hover:text-teal-600">
              <ShoppingBag size={20} className="mr-2" />
              Cart ({itemCount})
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;