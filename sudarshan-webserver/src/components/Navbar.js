import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (linkPath) =>
    `flex items-center justify-center h-full space-x-2 text-sm no-underline transition-all duration-300 ${
      path === linkPath
        ? 'border-b-2 border-white text-white' // Active state: white underline for current page
        : 'text-white hover:border-b-2 hover:border-white' // Hover state: white underline on hover
    }`;

  return (
    <div>
      {/* Navbar below the logos */}
      <nav
        className="text-white shadow-lg h-16 py-4" // Increased height to h-16 and added padding for better alignment
        style={{ background: 'linear-gradient(119.54deg, #1cb5e0 0%, #000046 100%)' }} // Reversed gradient
      >
        <div className="flex justify-between items-center w-full h-full">
          {/* Left Aligned Logo */}
          <Link
            to="/"
            className="text-2xl font-bold flex items-center space-x-2 no-underline pl-5" // Increased font size to 2xl and added left padding
          >
            <span className="text-white drop-shadow-lg">Sudarshan</span>
          </Link>

          {/* Right Aligned Links */}
          <div className="ml-auto space-x-6 flex items-center h-full pr-5">
            {/* Home */}
            <Link to="/" className={getLinkClass('/')}>
              <span>Home</span>
            </Link>

            {/* Generate */}
            <Link to="/generate" className={getLinkClass('/generate')}>
              <span>Generate</span>
            </Link>

            {/* Upload Document */}
            <Link to="/upload" className={getLinkClass('/upload')}>
              <span>Verify</span>
            </Link>

            {/* Profile */}
            <Link to="/profile" className={getLinkClass('/profile')}>
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;