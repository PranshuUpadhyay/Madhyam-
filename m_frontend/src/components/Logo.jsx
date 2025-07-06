import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/madhayam_logo-removebg-preview.png';

const Logo = ({ size = 'h-16' }) => (
  <Link to="/" className="ml-4 flex items-center">
    <img
      src={logo}
      alt="Madhyam Logo"
      className={`${size} w-auto object-contain`}
      style={{ maxHeight: '100%', display: 'block' }}
    />
  </Link>
);

export default Logo;
