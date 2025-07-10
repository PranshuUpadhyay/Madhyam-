import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/apiInstance';
import divider from '../assets/divider.svg';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [socialError, setSocialError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [adminError, setAdminError] = useState('');
  const navigate = useNavigate();
  const { login } = useApp();

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Invalid email.';
    if (!form.password) errs.password = 'Password is required.';
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
    setAdminError('');
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      const { user, token } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      login(user);
      if (adminMode) {
        if (user.role === 'admin' || user.email === 'admin@madhyam.org') {
          navigate('/admin');
        } else {
          setAdminError('You are not authorized as admin.');
          return;
        }
      } else if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setSocialError('Login failed. Please check your credentials.');
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
      login(user);
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
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
        name: 'LinkedIn User',
        email: 'linkedin@example.com',
        picture: 'https://via.placeholder.com/150',
        provider: 'linkedin'
      };
      localStorage.setItem('user', JSON.stringify(mockLinkedInUser));
      localStorage.setItem('token', 'linkedin-mock-token');
      navigate('/');
    } catch (err) {
      setSocialError('LinkedIn login failed.');
    }
  };

  return (
    <section className="py-20 px-4 max-w-xl mx-auto bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-800">{adminMode ? 'Admin Login' : 'Sign In'}</h1>
        <button
          className={`px-4 py-1 rounded-full font-semibold border text-xs ml-2 ${adminMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'}`}
          onClick={() => { setAdminMode(!adminMode); setAdminError(''); }}
        >
          {adminMode ? 'User Login' : 'Admin Login'}
        </button>
      </div>
      <div className="flex justify-center mb-6">
        <img src={divider} alt="divider" className="w-32" />
      </div>
      <div className="grid gap-4 mb-8">
        {!adminMode && (
          <div className="flex flex-col gap-3">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              width="100%"
              theme="filled_blue"
              text="signin_with"
              shape="pill"
            />
            <button
              onClick={handleLinkedInLogin}
              className="flex items-center justify-center gap-3 border border-gray-300 p-2 rounded hover:bg-gray-100 transition text-blue-700 w-full"
            >
              <FaLinkedin className="text-xl" /> Sign in with LinkedIn
            </button>
          </div>
        )}
        {socialError && <div className="text-red-600 text-center text-sm mt-2">{socialError}</div>}
        {adminError && <div className="text-red-600 text-center text-sm mt-2">{adminError}</div>}
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
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
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            className={`border p-2 rounded w-full ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
            required
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
          {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-semibold disabled:opacity-60"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
}
