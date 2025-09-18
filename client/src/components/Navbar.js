import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.products);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ref for the dropdown area
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  // unique categories from products
  const categories = [...new Set(items.map((item) => item.category))];

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 relative z-50">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate('/')}
        >
          Inventory System
        </div>

        {/* Hamburger for mobile */}
        <div className="lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex gap-6 items-center">
          <span
            className="font-semibold text-lg cursor-pointer"
            onClick={() => navigate('/')}
          >
            Home
          </span>
          <span
            className="font-semibold text-lg cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </span>
          <span
            className="text-lg font-semibold cursor-pointer"
            onClick={() => navigate('/productslist')}
          >
            Products
          </span>

          {/* Category Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <span
              className="text-lg font-semibold cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            >
              Category ▾
            </span>

            {showDropdown && (
              <div className="absolute bg-white text-black mt-2 rounded shadow-md w-48">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      navigate(`/productslist?category=${encodeURIComponent(cat)}`);
                      setShowDropdown(false); // close after selecting
                    }}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200"
            >
              Login / Register
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 space-y-3">
          {/* … same as your existing mobile menu … */}
        </div>
      )}

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </nav>
  );
};

export default Navbar;
