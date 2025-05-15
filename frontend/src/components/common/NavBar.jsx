import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../src/assets/logo.svg';
import { 
  FaBus, 
  FaTrain, 
  FaEnvelope, 
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt
} from 'react-icons/fa';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  const scrollToContact = (e) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('userBookings');
    // Add any other cleanup needed
    navigate('/');
    setIsMenuOpen(false);
  };

  const navItems = [
    { 
      name: 'Bus Tickets', 
      path: '/bus', 
      icon: <FaBus className="mr-2" />,
      dropdown: [
        { name: 'Highway Bus', path: '/bus?type=highway' },
        { name: 'Intercity', path: '/bus?type=intercity' },
        { name: 'Semi Luxury', path: '/bus?type=semi-luxury' },
        { name: 'Normal Coaches', path: '/bus?type=normal' }
      ]
    },
    { 
      name: 'Train Tickets', 
      path: '/train', 
      icon: <FaTrain className="mr-2" />,
      dropdown: [
        { name: 'Intercity', path: '/train?type=intercity' },
        { name: 'Express', path: '/train?type=express' },
        { name: 'Night Mail', path: '/train?type=night-mail' }
      ]
    },
    { 
      name: 'Contact Us', 
      path: '#contact', 
      icon: <FaEnvelope className="mr-2" />,
      onClick: scrollToContact
    },
    { 
      name: 'Profile', 
      path: '/profile', 
      icon: <FaUserCircle className="mr-2" />,
      dropdown: [
        { name: 'My Profile', path: '/profile', icon: <FaUserCircle className="mr-2" /> },
        { name: 'Logout', onClick: handleLogout, icon: <FaSignOutAlt className="mr-2" /> }
      ]
    }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 h-16">
      <div className="container mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <Link to="/" className="flex items-center h-full py-1">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-full w-auto object-contain hover:scale-105 transition-transform duration-300" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center h-full space-x-1">
            {navItems.map((item, index) => (
              <div 
                key={item.name}
                className="relative group h-full flex items-center"
                onMouseEnter={() => setActiveDropdown(index)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.path.startsWith('#') ? (
                  <a 
                    href={item.path}
                    onClick={item.onClick}
                    className="flex items-center px-4 h-full text-gray-700 hover:text-blue-600 font-medium uppercase text-sm transition-all duration-300"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    onClick={item.onClick}
                    className="flex items-center px-4 h-full text-gray-700 hover:text-blue-600 font-medium uppercase text-sm transition-all duration-300"
                  >
                    {item.icon}
                    {item.name}
                    {item.dropdown && <FaChevronDown className="ml-1 text-xs" />}
                  </Link>
                )}
                
                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === index && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100">
                    {item.dropdown.map((subItem) => (
                      subItem.onClick ? (
                        <button
                          key={subItem.name}
                          onClick={subItem.onClick}
                          className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm border-b border-gray-100 last:border-b-0"
                        >
                          {subItem.icon}
                          {subItem.name}
                        </button>
                      ) : (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 text-sm border-b border-gray-100 last:border-b-0"
                          onClick={() => setActiveDropdown(null)}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden h-full flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-blue-50 rounded-lg mt-2 shadow-inner">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.path.startsWith('#') ? (
                  <a
                    href={item.path}
                    onClick={item.onClick}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md font-medium uppercase text-sm transition-colors duration-300"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    onClick={item.onClick || (() => setIsMenuOpen(false))}
                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-100 hover:text-blue-600 rounded-md font-medium uppercase text-sm transition-colors duration-300"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                    {item.dropdown && <FaChevronDown className="ml-auto text-xs" />}
                  </Link>
                )}
                {/* Mobile dropdown items */}
                {item.dropdown && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.dropdown.map((subItem) => (
                      subItem.onClick ? (
                        <button
                          key={subItem.name}
                          onClick={subItem.onClick}
                          className="w-full text-left flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 text-sm"
                        >
                          {subItem.icon}
                          {subItem.name}
                        </button>
                      ) : (
                        <Link
                          key={subItem.name}
                          to={subItem.path}
                          className="flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 text-sm"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;