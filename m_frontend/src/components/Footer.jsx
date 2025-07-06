import React from 'react';
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import { IoLogoGooglePlaystore, IoLogoAppleAppstore } from 'react-icons/io5';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t pt-12 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-sm">
        <div className="col-span-2 md:col-span-1 flex justify-center md:justify-start">
          <Logo size="h-24 w-auto" />
        </div>

        <div>
          <h3 className="font-bold mb-2 uppercase text-xs tracking-wide">About Us</h3>
          <ul className="space-y-1">
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/volunteer">Volunteers</Link></li>
            <li><Link to="/press">Press</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 uppercase text-xs tracking-wide">Initiatives</h3>
          <ul className="space-y-1">
            <li><Link to="/rescue">Food Rescue</Link></li>
            <li><Link to="/partners">Partner NGOs</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/impact">Impact Reports</Link></li>
            <li><Link to="/support">Support Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 uppercase text-xs tracking-wide">Tools</h3>
          <ul className="space-y-1">
            <li><Link to="/donor">Become a Donor</Link></li>
            <li><Link to="/volunteer-login">Volunteer Sign In</Link></li>
            <li><Link to="/mobile-app">Mobile App</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2 uppercase text-xs tracking-wide">Policies</h3>
          <ul className="space-y-1">
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-bold mb-2 uppercase text-xs tracking-wide">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-3 text-lg mb-4">
            <a href="https://www.linkedin.com/in/pranshuupadhyay23" aria-label="LinkedIn"><FaLinkedinIn /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://x.com/MadhyamOrg" aria-label="Twitter"><FaXTwitter /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8 border-t pt-4">
        © {currentYear} Madhyam. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
