import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/apiInstance';
import divider from '../assets/divider.svg';
import { useApp } from '../context/AppContext';

export default function Signup() {
  const { login } = useApp();
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [socialError, setSocialError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.firstname.trim()) errs.firstname = 'First name is required.';
    if (!form.lastname.trim()) errs.lastname = 'Last name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.contact.trim()) errs.contact = 'Contact is required.';
    else if (!/^\d{10}$/.test(form.contact)) errs.contact = 'Contact must be 10 digits.';
    if (!form.password) errs.password = 'Password is required.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/signup', form);
      const { user, token } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setSocialError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setSocialError('');
    try {
      const response = await axios.post('/auth/google', {
        credential: credentialResponse.credential
      });
      
      const { user, token } = response.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      login(user); // <-- Add this!
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setSocialError('Google login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setSocialError('Google login failed.');
  };

  // LinkedIn login handler (simulated)
  const handleLinkedInLogin = () => {
    setSocialError('');
    try {
      const mockLinkedInUser = {
        id: Date.now(),
        firstName: 'LinkedIn',
        lastName: 'User',
        email: 'linkedin@example.com',
        picture: 'https://via.placeholder.com/150',
        provider: 'linkedin',
        role: 'user'
      };
      localStorage.setItem('user', JSON.stringify(mockLinkedInUser));
      localStorage.setItem('token', 'linkedin-mock-token');
      navigate('/');
    } catch (err) {
      setSocialError('LinkedIn login failed.');
    }
  };

  return (
    <section className="py-20 px-4 max-w-xl mx-auto bg-gradient-to-br from-red-50 to-yellow-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Sign Up</h1>
      <div className="flex justify-center mb-6">
        <img src={divider} alt="divider" className="w-32" />
      </div>
      <div className="grid gap-4 mb-8">
        <div className="flex flex-col gap-3">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
            theme="filled_blue"
            text="signup_with"
            shape="pill"
          />
          <button
            onClick={handleLinkedInLogin}
            className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-700 w-full"
          >
            <FaLinkedin className="text-xl" /> Sign up with LinkedIn
          </button>
        </div>
        {socialError && <div className="text-red-600 text-center text-sm mt-2">{socialError}</div>}
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div>
          <input 
            type="text" 
            name="firstname" 
            placeholder="Firstname" 
            className={`border p-2 rounded w-full ${errors.firstname ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.firstname} 
            onChange={handleChange} 
          />
          {errors.firstname && <div className="text-red-500 text-xs mt-1">{errors.firstname}</div>}
        </div>
        <div>
          <input 
            type="text" 
            name="lastname" 
            placeholder="Lastname" 
            className={`border p-2 rounded w-full ${errors.lastname ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.lastname} 
            onChange={handleChange} 
          />
          {errors.lastname && <div className="text-red-500 text-xs mt-1">{errors.lastname}</div>}
        </div>
        <div>
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            className={`border p-2 rounded w-full ${errors.email ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.email} 
            onChange={handleChange} 
          />
          {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
        </div>
        <div>
          <input 
            type="tel" 
            name="contact" 
            placeholder="Contact (10 digits)" 
            className={`border p-2 rounded w-full ${errors.contact ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.contact} 
            onChange={handleChange} 
          />
          {errors.contact && <div className="text-red-500 text-xs mt-1">{errors.contact}</div>}
        </div>
        <div>
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            className={`border p-2 rounded w-full ${errors.password ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.password} 
            onChange={handleChange} 
          />
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>
        <div>
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirm Password" 
            className={`border p-2 rounded w-full ${errors.confirmPassword ? 'border-red-400' : 'border-gray-300'}`} 
            required 
            value={form.confirmPassword} 
            onChange={handleChange} 
          />
          {errors.confirmPassword && <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </section>
  );
}
