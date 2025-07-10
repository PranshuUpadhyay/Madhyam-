import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { donorService } from '../api/services';
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Phone, 
  Mail, 
  Navigation,
  Building,
  Heart,
  Award,
  Globe,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';

export default function Menu() {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get user location
  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          });
        });
        
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setIsGettingLocation(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Fetch nearby donors/restaurants
  const { data: nearbyData, isLoading, error, refetch } = useQuery(
    ['nearbyPlaces', userLocation, radius],
    () => userLocation ? donorService.findNearestDonors({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      radius: radius
    }) : Promise.resolve({ data: [] }),
    {
      enabled: !!userLocation,
      staleTime: 2 * 60 * 1000,
      cacheTime: 5 * 60 * 1000,
    }
  );

  // After fetching nearbyData, extract real donors with donations
  const realDonors = Array.isArray(nearbyData?.data)
    ? nearbyData.data.map(donor => ({
        ...donor,
        donations: donor.user?.donations || []
      }))
    : [];

  // Enhanced mock data for restaurants and donors
  const mockRestaurants = [
    {
      id: 1,
      name: "Barbeque Nation",
      type: "restaurant",
      distance: 2.1,
      capacity: 50,
      rating: 4.5,
      reviews: 234,
      cuisine: "Multi-cuisine",
      address: "Mall Road, City Center",
      phone: "+91-98765-43210",
      email: "bbq@restaurant.com",
      availability: "Open Now",
      speciality: "Grilled dishes",
      image: "/img/restaurant-1.jpg"
    },
    {
      id: 2,
      name: "Raj Luxmi Food",
      type: "restaurant",
      distance: 8.3,
      capacity: 30,
      rating: 4.2,
      reviews: 156,
      cuisine: "Indian",
      address: "Main Street, Downtown",
      phone: "+91-98765-43211",
      email: "rajluxmi@restaurant.com",
      availability: "Open Now",
      speciality: "Traditional Indian",
      image: "/img/restaurant-2.jpg"
    },
    {
      id: 3,
      name: "The Magari",
      type: "restaurant",
      distance: 19.2,
      capacity: 40,
      rating: 4.7,
      reviews: 189,
      cuisine: "Italian",
      address: "Highway Road, Suburb",
      phone: "+91-98765-43212",
      email: "magari@restaurant.com",
      availability: "Open Now",
      speciality: "Pizza & Pasta",
      image: "/img/restaurant-3.jpg"
    },
    {
      id: 4,
      name: "Chocolate Room",
      type: "restaurant",
      distance: 2.5,
      capacity: 25,
      rating: 4.3,
      reviews: 98,
      cuisine: "Desserts",
      address: "Sweet Street, City Center",
      phone: "+91-98765-43213",
      email: "chocolate@restaurant.com",
      availability: "Open Now",
      speciality: "Chocolate desserts",
      image: "/img/restaurant-4.jpg"
    },
    {
      id: 5,
      name: "Haldiram",
      type: "restaurant",
      distance: 17.0,
      capacity: 60,
      rating: 4.1,
      reviews: 312,
      cuisine: "Indian Snacks",
      address: "Food Court, Mall",
      phone: "+91-98765-43214",
      email: "haldiram@restaurant.com",
      availability: "Open Now",
      speciality: "Traditional snacks",
      image: "/img/restaurant-5.jpg"
    }
  ];

  const mockDonors = [
    {
      id: 1,
      name: "Madadgar Foundation",
      type: "charity",
      distance: 7.2,
      rating: 4.8,
      reviews: 45,
      category: "Food Donation",
      address: "Charity Lane, Old City",
      phone: "+91-98765-43215",
      email: "contact@madadgar.org",
      availability: "Available",
      description: "Providing food assistance to underprivileged families",
      image: "/img/charity-1.jpg"
    },
    {
      id: 2,
      name: "Helping Hand Trust",
      type: "charity",
      distance: 0.15,
      rating: 4.6,
      reviews: 67,
      category: "Clothing Donation",
      address: "Service Road, Downtown",
      phone: "+91-98765-43216",
      email: "help@helpinghand.org",
      availability: "Available",
      description: "Collecting and distributing clothes to needy people",
      image: "/img/charity-2.jpg"
    },
    {
      id: 3,
      name: "Seva Foundation",
      type: "charity",
      distance: 12.8,
      rating: 4.9,
      reviews: 89,
      category: "Education Support",
      address: "Education Street, Suburb",
      phone: "+91-98765-43217",
      email: "seva@foundation.org",
      availability: "Available",
      description: "Supporting education for underprivileged children",
      image: "/img/charity-3.jpg"
    },
    {
      id: 4,
      name: "Care & Share",
      type: "charity",
      distance: 5.4,
      rating: 4.4,
      reviews: 34,
      category: "Medical Aid",
      address: "Health Avenue, City Center",
      phone: "+91-98765-43218",
      email: "care@share.org",
      availability: "Available",
      description: "Providing medical assistance to needy patients",
      image: "/img/charity-4.jpg"
    },
    {
      id: 5,
      name: "Hope Foundation",
      type: "charity",
      distance: 9.7,
      rating: 4.7,
      reviews: 56,
      category: "Shelter Support",
      address: "Hope Street, Downtown",
      phone: "+91-98765-43219",
      email: "hope@foundation.org",
      availability: "Available",
      description: "Providing shelter and basic amenities to homeless",
      image: "/img/charity-5.jpg"
    }
  ];

  // Filter data based on search term and active tab
  const filteredData = () => {
    if (activeTab === 'charities' && realDonors.length > 0) {
      let data = realDonors;
      if (searchTerm) {
        data = data.filter(donor =>
          (donor.user?.firstName + ' ' + donor.user?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          donor.city?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return data;
    }
    const data = activeTab === 'restaurants' ? mockRestaurants : mockDonors;
    if (!searchTerm) return data;
    
    return data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.cuisine && item.cuisine.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRadiusChange = (e) => {
    setRadius(Number(e.target.value));
  };

  const getDistanceColor = (distance) => {
    if (distance <= 5) return 'text-green-600';
    if (distance <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAvailabilityColor = (availability) => {
    if (availability === 'Open Now' || availability === 'Available') return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header Section */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Find <span className="text-orange-600">Restaurants</span> & <span className="text-green-600">Charities</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover nearby restaurants and charitable organizations. Connect with local businesses and support community initiatives.
            </p>
          </motion.div>

          {/* Location and Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 space-y-4"
          >
            {/* Location Status */}
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              {isGettingLocation ? (
                <span className="text-gray-600">Getting your location...</span>
              ) : userLocation ? (
                <span className="text-green-600 font-medium">Location detected</span>
              ) : (
                <span className="text-red-600">Location not available</span>
              )}
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white rounded-lg p-4 shadow-md max-w-4xl mx-auto"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Radius (km)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={radius}
                        onChange={handleRadiusChange}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 min-w-[3rem]">{radius} km</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => getLocation()}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Refresh Location</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg max-w-md mx-auto">
          <button
            onClick={() => handleTabChange('restaurants')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'restaurants'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Restaurants</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('charities')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'charities'
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Charities</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding nearby places...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Failed to load nearby places</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Results Summary */}
            <div className="text-center">
              <p className="text-gray-600">
                Found <span className="font-semibold text-orange-600">{filteredData().length}</span> {activeTab} 
                {userLocation && ` within ${radius} km of your location`}
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData().map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="relative h-48 bg-gradient-to-br from-orange-100 to-yellow-100">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === 'restaurant' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.type === 'restaurant' ? 'Restaurant' : 'Charity'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDistanceColor(item.distance)} bg-white`}>
                          {item.distance} km
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                      <div className="flex items-center space-x-2 text-white text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{item.rating}</span>
                        <span>({item.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-3">
                      {/* Type/Category */}
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">
                          {item.cuisine || item.category}
                        </span>
                      </div>

                      {/* Address */}
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm text-gray-600">{item.address}</span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className={`text-sm font-medium ${getAvailabilityColor(item.availability)}`}>
                          {item.availability}
                        </span>
                      </div>

                      {/* Capacity (for restaurants) */}
                      {item.capacity && (
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            Capacity: {item.capacity} people
                          </span>
                        </div>
                      )}

                      {/* Speciality/Description */}
                      <div className="flex items-start space-x-2">
                        <Globe className="w-4 h-4 text-purple-600 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {item.speciality || item.description}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Call"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <a
                            href={`mailto:${item.email}`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>
                        
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredData().length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `No ${activeTab} match your search "${searchTerm}"`
                    : `No ${activeTab} found in your area. Try increasing the search radius.`
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}