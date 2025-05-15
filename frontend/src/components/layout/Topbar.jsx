import React, { useState } from 'react';
import { 
  FaPhoneAlt, 
  FaWhatsapp,
  FaMapMarkerAlt,
  FaExchangeAlt
} from 'react-icons/fa';
import { 
  RiFacebookFill, 
  RiInstagramLine, 
  RiTwitterXLine,
  RiGlobalLine
} from 'react-icons/ri';
import { IoMdAlert } from 'react-icons/io';

const Topbar = ({ navbarRef }) => {
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="bg-[#ea2e0e] text-white text-sm relative z-[100]"> {/* High z-index */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-2 gap-2 md:gap-4">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <a href="#" className="hover:text-gray-200 transition-colors" aria-label="Facebook">
                <RiFacebookFill className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors" aria-label="Instagram">
                <RiInstagramLine className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors" aria-label="Twitter">
                <RiTwitterXLine className="h-4 w-4" />
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="tel:+94112345678" className="flex items-center hover:text-gray-200 transition-colors">
                <FaPhoneAlt className="h-3 w-3 mr-1" />
                <span className="text-xs">+94 11 234 5678</span>
              </a>
              <a href="https://wa.me/94771234567" className="flex items-center hover:text-gray-200 transition-colors">
                <FaWhatsapp className="h-3 w-3 mr-1" />
                <span className="text-xs">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Center Section */}
          <div className="flex-1 text-center px-2">
            <div className="flex items-center justify-center space-x-2">
              <IoMdAlert className="h-3 w-3 text-yellow-300 animate-pulse" />
              <span className="font-medium text-xs md:text-sm">
                Book from Anywhere to Everywhere Across Sri Lanka – Fast, Easy & Reliable!
              </span>
            </div>
          </div>

          {/* Right Section - Language Dropdown */}
          <div className="flex items-center space-x-4">
            <div 
              className="hidden md:flex items-center relative cursor-pointer"
              onMouseEnter={() => setShowLanguageDropdown(true)}
              onMouseLeave={() => setShowLanguageDropdown(false)}
            >
              <RiGlobalLine className="h-3 w-3 mr-1" />
              <span className="text-xs">English</span>
              
              {/* Language Dropdown */}
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-0 w-32 bg-white text-gray-800 shadow-lg rounded-md z-[110]"> {/* Higher z-index */}
                  <div className="py-1">
                    <div className="px-3 py-1 text-xs hover:bg-gray-100">සිංහල</div>
                    <div className="px-3 py-1 text-xs hover:bg-gray-100">தமிழ்</div>
                  </div>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center hover:text-gray-200 transition-colors cursor-pointer">
              <FaMapMarkerAlt className="h-3 w-3 mr-1" />
              <span className="text-xs">Malabe,Colombo</span>
            </div>

            <div className="hidden md:flex items-center space-x-3 text-xs">
              <a href="#" className="hover:text-gray-200 transition-colors flex items-center">
                <FaExchangeAlt className="h-3 w-3 mr-1" />
                <span>Refunds</span>
              </a>
              <a href="#" className="hover:text-gray-200 transition-colors">
                <span>Help</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;