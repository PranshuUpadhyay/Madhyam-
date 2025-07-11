import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useQuery } from 'react-query';
import { specialsService, blogService, donorService } from '../api/services';
import HeroSlider from "../components/HeroSlider";
import CategoryIcons from '../components/CategoryIcons';
import DonorMap from '../components/DonorMap';
import SpecialsGrid from '../components/SpecialsGrid';
import { 
  MapPin, 
  Users, 
  Heart, 
  Star, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Search,
  Filter,
  Award,
  Globe,
  Target
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated, screenSize, addNotification } = useApp();
  const navigate = useNavigate();
  const [selectedDonationType, setSelectedDonationType] = useState('all');
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState(null);
  const [donorFilters, setDonorFilters] = useState({ donationType: 'all', radius: 10, availability: 'all' });
  const [showAllDonors, setShowAllDonors] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredSpecials, setFeaturedSpecials] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch dynamic stats from backend
  const { data: statsData, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery(
    'summaryStats',
    donorService.getSummaryStats,
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
    }
  );
  const stats = statsData?.data?.data || { donors: 0, donations: 0, cities: 0, successRate: 0, completedDonations: 0, activeDonations: 0 };

  // Fetch featured specials
  const { data: featuredSpecialsData, isLoading: specialsLoading, error: specialsError } = useQuery(
    'featuredSpecials',
    () => specialsService.getFeaturedSpecials({ limit: 6 }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
    }
  );

  // Fetch recent blogs
  const { data: recentBlogs, isLoading: blogsLoading, error: blogsError } = useQuery(
    'recentBlogs',
    () => blogService.getAllBlogs({ limit: 3, page: 1 }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      retry: 2,
      retryDelay: 1000,
    }
  );

  const specialsArray = Array.isArray(featuredSpecialsData?.data?.data) ? featuredSpecialsData.data.data : [];
  const blogsArray = Array.isArray(recentBlogs?.data?.data) ? recentBlogs.data.data : [];

  const handleDonorSelect = (donor) => {
    addNotification(`Selected donor: ${donor.user?.firstName} ${donor.user?.lastName}`, 'info');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Get user geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }),
        () => setUserLocation(null)
      );
    }
  }, []);

  // Fetch nearest donors from backend
  const { data: nearestDonorsData, isLoading: nearestDonorsLoading, error: nearestDonorsError, refetch: refetchNearestDonors } = useQuery(
    ['nearestDonors', userLocation, donorFilters],
    () => userLocation ? donorService.findNearestDonors({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius: donorFilters.radius,
      donationType: donorFilters.donationType !== 'all' ? donorFilters.donationType : undefined
    }) : Promise.resolve({ data: [] }),
    {
      enabled: !!userLocation,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );
  
  const { data: allDonorsData, isLoading: allDonorsLoading, error: allDonorsError, refetch: refetchAllDonors } = useQuery(
    'allDonors',
    () => donorService.getAllDonors(),
    { enabled: false }
  );

  const nearestDonors = showAllDonors
    ? (allDonorsData?.data ?? [])
    : (nearestDonorsData?.data?.data ?? []);

  const nearestDonorsArray = Array.isArray(nearestDonors) ? nearestDonors : [];

  // Add helper for blog image URL
  const getBlogImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('/uploads')) {
      return `http://localhost:5000${image}`;
    }
    return image;
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        const res = await specialsService.getFeaturedSpecials();
        let specials = [];
        if (Array.isArray(res.data) && res.data.length > 0) {
          specials = res.data;
        } else if (Array.isArray(res.data?.data) && res.data.data.length > 0) {
          specials = res.data.data;
        }
        setFeaturedSpecials(specials);
      } catch {
        setFeaturedSpecials([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Refetch stats and other user-dependent data when user or isAuthenticated changes
  useEffect(() => {
    refetchStats();
    // Add other refetches here if needed
  }, [user, isAuthenticated]);

  return (
    <>
      {/* Keep only the HeroSlider as the hero section */}
      <HeroSlider />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className=""
      >
        
        {/* Enhanced Stats Section */}
        <motion.section
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-8 md:py-16 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 left-1/4 w-8 h-8 md:w-12 md:h-12 bg-white rounded-full animate-pulse delay-2000"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">
                Our Impact in Numbers
              </h2>
              <p className="text-sm md:text-xl text-blue-100 max-w-2xl md:max-w-3xl mx-auto px-4">
                Real-time statistics showing the positive change we're making together in communities across India.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              <motion.div 
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 text-yellow-300" />
                <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-yellow-300">
                  {stats && typeof stats.donors === 'number' ? stats.donors.toLocaleString() : '0'}+
                </h3>
                <p className="text-sm md:text-lg text-blue-100">Active Donors</p>
                <p className="text-xs md:text-sm text-blue-200 mt-1 md:mt-2">Growing daily</p>
              </motion.div>
              
              <motion.div 
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 text-red-300" />
                <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-red-300">
                  {stats && typeof stats.donations === 'number' ? stats.donations.toLocaleString() : '0'}+
                </h3>
                <p className="text-sm md:text-lg text-blue-100">Total Donations</p>
                <p className="text-xs md:text-sm text-blue-200 mt-1 md:mt-2">All-time</p>
              </motion.div>

              <motion.div 
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 text-green-400" />
                <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-green-400">
                  {stats && typeof stats.completedDonations === 'number' ? stats.completedDonations.toLocaleString() : '0'}
                </h3>
                <p className="text-sm md:text-lg text-green-100">Completed Donations</p>
                <p className="text-xs md:text-sm text-green-200 mt-1 md:mt-2">Delivered</p>
              </motion.div>

              <motion.div 
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-white/20"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-8 h-8 md:w-16 md:h-16 mx-auto mb-2 md:mb-4 text-blue-400" />
                <h3 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 text-blue-400">
                  {stats && typeof stats.activeDonations === 'number' ? stats.activeDonations.toLocaleString() : '0'}
                </h3>
                <p className="text-sm md:text-lg text-blue-100">Active Donations</p>
                <p className="text-xs md:text-sm text-blue-200 mt-1 md:mt-2">Available now</p>
              </motion.div>
            </div>
          </div>
        </motion.section>
        <CategoryIcons />
        {/* Featured Specials */}
        <motion.section
          variants={itemVariants}
          className="py-8 md:py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                Featured Menu Items
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
                Discover our most popular and delicious dishes, carefully prepared with love and quality ingredients.
              </p>
            </div>

            {specialsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : specialsError ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">Failed to load featured items</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {specialsArray.map((special, index) => (
                  <motion.div
                    key={special.id}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {special.image && (
                      <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                        <img
                          src={special.image}
                          alt={special.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">
                          {special.name}
                        </h3>
                        <span className="text-base md:text-lg font-bold text-blue-600 ml-2">
                          {typeof special.price === 'number' ? `₹${special.price.toFixed(2)}` : (special.price ? `₹${special.price}` : '')}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">
                        {special.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {special.category}
                        </span>
                        {special.preparationTime && (
                          <span className="flex items-center text-xs md:text-sm text-gray-500">
                            <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                            {special.preparationTime} min
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>

        {/* Category Icons */}
        

        {/* Enhanced Nearest Donor Section */}
        <motion.section
          variants={itemVariants}
          className="py-8 md:py-16 bg-white"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Find Nearby Donors
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto mb-4 px-4">
                Connect with generous donors in your area. Use the map and filters below to find the best match for your needs.
              </p>
              {!userLocation && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4 max-w-md mx-auto">
                  <p className="text-yellow-800 text-xs md:text-sm">
                    📍 Enable location access to find donors near you, or use the filters below to search manually.
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Filter Controls */}
            <div className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Donation Type</label>
                  <select
                    value={donorFilters.donationType}
                    onChange={e => setDonorFilters(f => ({ ...f, donationType: e.target.value }))}
                    className="w-full px-3 py-2 md:px-4 md:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="food">🍽️ Food</option>
                    <option value="clothes">👕 Clothes</option>
                    <option value="books">📚 Books</option>
                    <option value="money">💰 Money</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Search Radius</label>
                  <select
                    value={donorFilters.radius}
                    onChange={e => setDonorFilters(f => ({ ...f, radius: Number(e.target.value) }))}
                    className="w-full px-3 py-2 md:px-4 md:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={20}>20 km</option>
                    <option value={50}>50 km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Availability</label>
                  <select
                    value={donorFilters.availability || 'all'}
                    onChange={e => setDonorFilters(f => ({ ...f, availability: e.target.value }))}
                    className="w-full px-3 py-2 md:px-4 md:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Availability</option>
                    <option value="immediate">🚀 Immediate</option>
                    <option value="scheduled">📅 Scheduled</option>
                    <option value="on-demand">📞 On Demand</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={refetchNearestDonors}
                    className="w-full px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Search className="w-3 h-3 md:w-4 md:h-4" />
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Map and Donor List */}
            {nearestDonorsLoading ? (
              <div className="flex justify-center py-8 md:py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-2 md:mb-4"></div>
                  <p className="text-gray-600 text-sm md:text-base">Finding donors near you...</p>
                </div>
              </div>
            ) : nearestDonorsError ? (
              <div className="text-center py-6 md:py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 md:p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-3 md:mb-4 text-sm md:text-base">Failed to load donors</p>
                  <button 
                    onClick={refetchNearestDonors} 
                    className="px-3 py-2 md:px-4 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : nearestDonorsArray.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8 max-w-md mx-auto">
                  <Target className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-2">No donors found</h3>
                  <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                    No donors found in your area for the selected filters. Try adjusting your search criteria or show all donors.
                  </p>
                  <button
                    onClick={() => setDonorFilters({ donationType: 'all', radius: 10, availability: 'all' })}
                    className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Results Summary */}
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm md:text-base">
                    Found <strong>{nearestDonorsArray.length}</strong> donor{nearestDonorsArray.length !== 1 ? 's' : ''} within {donorFilters.radius}km
                    {donorFilters.donationType !== 'all' && ` offering ${donorFilters.donationType}`}
                  </p>
                </div>

                {/* Interactive Map */}
                <div className="mb-6 md:mb-8">
                  <button onClick={refetchNearestDonors} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Refetch Donors</button>
                  <DonorMap
                    donors={nearestDonorsArray}
                    onDonorSelect={handleDonorSelect}
                    height={screenSize === 'mobile' ? '300px' : screenSize === 'tablet' ? '400px' : '500px'}
                    showFilters={false}
                    userLocation={userLocation}
                  />
                </div>

                {/* Enhanced Donor Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {nearestDonorsArray.map(donor => (
                    <motion.div 
                      key={donor.id} 
                      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
                      whileHover={{ y: -2 }}
                    >
                      {/* Header with donor info */}
                      <div className="p-4 md:p-6 border-b border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-sm md:text-lg">
                                {donor.user?.firstName?.charAt(0)}{donor.user?.lastName?.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800 text-sm md:text-lg">
                                {donor.user?.firstName} {donor.user?.lastName}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-500">
                                {donor.distance} km away
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${
                              donor.donationType === 'food' ? 'bg-green-100 text-green-800' :
                              donor.donationType === 'clothes' ? 'bg-blue-100 text-blue-800' :
                              donor.donationType === 'books' ? 'bg-purple-100 text-purple-800' :
                              donor.donationType === 'money' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {donor.donationType === 'food' ? '🍽️ Food' :
                               donor.donationType === 'clothes' ? '👕 Clothes' :
                               donor.donationType === 'books' ? '📚 Books' :
                               donor.donationType === 'money' ? '💰 Money' :
                               '📦 Other'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              donor.availability === 'immediate' ? 'bg-green-100 text-green-800' :
                              donor.availability === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {donor.availability === 'immediate' ? '🚀 Immediate' :
                               donor.availability === 'scheduled' ? '📅 Scheduled' :
                               '📞 On Demand'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                          {donor.city}, {donor.state}
                        </div>

                        <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                          {donor.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Contact Actions */}
                      <div className="p-3 md:p-4 bg-gray-50">
                        <div className="flex gap-2">
                          <a
                            href={`tel:${donor.user?.phone}`}
                            className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm font-medium"
                          >
                            📞 Call
                          </a>
                          <a
                            href={`mailto:${donor.user?.email}`}
                            className="flex-1 px-3 py-2 md:px-4 md:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm font-medium"
                          >
                            ✉️ Email
                          </a>
                          <button
                            onClick={() => handleDonorSelect(donor)}
                            className="px-3 py-2 md:px-4 md:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-xs md:text-sm font-medium transition-colors"
                          >
                            📍 View
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.section>

        {/* Recent Blog Posts */}
        <motion.section
          variants={itemVariants}
          className="py-8 md:py-16 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
                Latest from Our Blog
              </h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
                Stay updated with our latest news, stories, and insights about community service and giving back.
              </p>
            </div>

            {blogsLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : blogsError ? (
              <div className="text-center py-6 md:py-8">
                <p className="text-red-600 mb-3 md:mb-4 text-sm md:text-base">Failed to load blog posts</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {blogsArray.map((blog) => (
                  <motion.article
                    key={blog.id}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    {blog.image && (
                      <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                        <img
                          src={getBlogImageUrl(blog.image)}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 md:p-6">
                      <div className="flex items-center gap-2 mb-2 md:mb-3">
                        {blog.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 md:mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-3">
                        {blog.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs md:text-sm text-gray-500">
                          By {blog.author?.firstName} {blog.author?.lastName}
                        </span>
                        <span className="flex items-center text-xs md:text-sm text-gray-500">
                          <Star className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {blog.viewCount} views
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            <div className="text-center mt-6 md:mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/blog')}
                className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                View All Posts
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          variants={itemVariants}
          className="py-8 md:py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Join our community of donors and volunteers. Every contribution, no matter how small, makes a big impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/becomedonor')}
                className="px-6 py-3 md:px-8 md:py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm md:text-base"
              >
                Become a Donor
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/Volunteer-login')}
                className="px-6 py-3 md:px-8 md:py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-sm md:text-base"
              >
                Join as Volunteer
              </motion.button>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </>
  );
};

export default Home;
