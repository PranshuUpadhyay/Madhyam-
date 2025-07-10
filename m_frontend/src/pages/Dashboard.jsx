import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAuthenticated } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 pt-12">
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
          {initials}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-600">{user.email}</p>
      </div>
      {/* Add more dashboard content here */}
    </div>
  );
} 