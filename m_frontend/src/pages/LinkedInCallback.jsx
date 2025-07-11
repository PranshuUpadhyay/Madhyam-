import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import axios from '../api/apiInstance';

export default function LinkedInCallback() {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useApp();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');
        const message = params.get('message');

        if (message) {
          // Error case
          setError(decodeURIComponent(message));
          setStatus('Authentication Failed');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        if (token && userParam) {
          // Success case
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Store user data and token
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Update context
          login(user);
          
          setStatus('Authentication Successful!');
          
          // Redirect based on user role
          setTimeout(() => {
            if (user.role === 'donor') {
              navigate('/donor-dashboard');
            } else if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }, 1500);
        } else {
          setError('Invalid authentication response');
          setStatus('Authentication Failed');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        console.error('LinkedIn callback error:', err);
        setError('Failed to process authentication');
        setStatus('Authentication Failed');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{status}</h2>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          )}
        </div>
      </div>
    </div>
  );
} 