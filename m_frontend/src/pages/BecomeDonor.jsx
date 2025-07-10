import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { donorService, getUserLocation } from '../api/services';
import { MapPin, Heart, Package, Clock, User, Phone, Mail, Navigation, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BecomeDonor = () => {
  const { addNotification, screenSize, user, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm();

  const donationType = watch('donationType');

  // Get user location
  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      const location = await getUserLocation();
      setUserLocation(location);
      setValue('latitude', location.latitude);
      setValue('longitude', location.longitude);
      addNotification('Location detected successfully!', 'success');
    } catch (error) {
      addNotification('Unable to get your location. Please enter manually.', 'warning');
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      addNotification('Please log in to register as a donor.', 'warning');
      navigate('/login');
      return;
    }
    getLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = async (data) => {
    if (!data.latitude || !data.longitude || isNaN(Number(data.latitude)) || isNaN(Number(data.longitude))) {
      addNotification('Location is required and must be valid.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = { ...data, userId: user?.id };
      const response = await donorService.createDonor(payload);
      addNotification('Donor registration successful!', 'success');
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new Event('storage'));
        }
        if (typeof window !== 'undefined' && window.location) {
          // Optionally force reload to update context everywhere
          // window.location.reload();
        }
      }
      reset();
      setUserLocation(null);
      navigate('/donor-dashboard');
    } catch (error) {
      addNotification('Failed to register as donor. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const donationTypes = [
    { value: 'food', label: 'Food', icon: '🍽️', description: 'Fresh meals, groceries, or packaged food items' },
    { value: 'clothes', label: 'Clothes', icon: '👕', description: 'Clean clothing for all ages and sizes' },
    { value: 'books', label: 'Books', icon: '📚', description: 'Educational books, textbooks, or reading materials' },
    { value: 'money', label: 'Money', icon: '💰', description: 'Financial contributions for various causes' },
    { value: 'other', label: 'Other', icon: '📦', description: 'Other items like toys, electronics, or furniture' }
  ];

  const availabilityOptions = [
    { value: 'immediate', label: 'Immediate', description: 'Available right now' },
    { value: 'scheduled', label: 'Scheduled', description: 'Available at specific times' },
    { value: 'on-demand', label: 'On Demand', description: 'Available when contacted' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
              <Heart className="w-10 h-10 text-red-600" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Become a Donor</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join our community of generous donors and make a difference in someone's life. Your contribution, no matter how small, can create a big impact.</p>
          </div>
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2"><User className="w-6 h-6 text-blue-600" />Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input type="text" {...register('firstName', { required: 'First name is required' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your first name" />
                    {errors.firstName && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.firstName.message}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input type="text" {...register('lastName', { required: 'Last name is required' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your last name" />
                    {errors.lastName && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.lastName.message}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input type="tel" {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' } })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your phone number" />
                    {errors.phone && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.phone.message}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input type="email" {...register('email', { required: 'Email is required', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Please enter a valid email address' } })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your email address" />
                    {errors.email && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.email.message}</p>)}
                  </div>
                </div>
              </div>
              {/* Location Information */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="w-6 h-6 text-green-600" />Location Information</h3>
                <div className="mb-4">
                  <button type="button" onClick={getLocation} disabled={isGettingLocation} className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                    {isGettingLocation ? 'Detecting Location...' : 'Detect My Location'}
                  </button>
                  {userLocation && (<div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"><CheckCircle className="w-4 h-4" />Location detected: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}</div>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input type="text" {...register('city', { required: 'City is required' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your city" />
                    {errors.city && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.city.message}</p>)}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input type="text" {...register('state', { required: 'State is required' })} className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.state ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your state" />
                    {errors.state && (<p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.state.message}</p>)}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea {...register('address')} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Enter your full address (optional)" />
                  </div>
                </div>
              </div>
              {/* Donation Information */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2"><Package className="w-6 h-6 text-purple-600" />Donation Information</h3>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">What would you like to donate? *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {donationTypes.map((type) => (
                      <label key={type.value} className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${donationType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" value={type.value} {...register('donationType', { required: 'Please select a donation type' })} className="sr-only" />
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <span className="text-gray-800 font-medium">{type.label}</span>
                            <span className="block text-gray-600 text-sm">{type.description}</span>
                          </div>
                        </div>
                        {donationType === type.value && (<CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-500" />)}
                      </label>
                    ))}
                  </div>
                  {errors.donationType && (<p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.donationType.message}</p>)}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Availability *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {availabilityOptions.map((option) => (
                      <label key={option.value} className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${watch('availability') === option.value ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" value={option.value} {...register('availability', { required: 'Please select availability' })} className="sr-only" />
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <span className="text-gray-800 font-medium">{option.label}</span>
                            <span className="block text-gray-600 text-sm">{option.description}</span>
                          </div>
                        </div>
                        {watch('availability') === option.value && (<CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-500" />)}
                      </label>
                    ))}
                  </div>
                  {errors.availability && (<p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.availability.message}</p>)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea {...register('description')} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" placeholder="Describe what you're donating, any special requirements, or additional information..." />
                </div>
              </div>
              {/* Hidden fields for coordinates */}
              <input type="hidden" {...register('latitude')} />
              <input type="hidden" {...register('longitude')} />
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register as Donor'}</button>
                <button type="button" onClick={() => reset()} className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg">Reset Form</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default BecomeDonor;