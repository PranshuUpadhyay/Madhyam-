import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map initialization
const MapInitializer = ({ center, zoom, onMapReady }) => {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current && map) {
      try {
        map.setView(center, zoom);
        initializedRef.current = true;
        if (onMapReady) {
          onMapReady();
        }
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    }
  }, [map, center, zoom, onMapReady]);

  return null;
};

const DonorMap = ({ 
  donors = [], 
  userLocation = null, 
  onDonorSelect,
  height = '400px',
  showFilters = true 
}) => {
  const [filters, setFilters] = useState({
    donationType: '',
    maxDistance: 10,
    showUserLocation: true
  });
  
  const [filteredDonors, setFilteredDonors] = useState(donors);
  const [isMapReady, setIsMapReady] = useState(false);

  // Stable center value to prevent unnecessary re-renders
  const center = useMemo(() => 
    userLocation ? [userLocation.latitude, userLocation.longitude] : [20.5937, 78.9629], 
    [userLocation]
  );

  // Filter donors based on criteria
  useEffect(() => {
    let filtered = [...donors];

    if (filters.donationType) {
      filtered = filtered.filter(donor => 
        donor.donationType === filters.donationType
      );
    }

    if (filters.maxDistance && userLocation) {
      filtered = filtered.filter(donor => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          donor.latitude,
          donor.longitude
        );
        return distance <= filters.maxDistance;
      });
    }

    setFilteredDonors(filtered);
  }, [donors, filters, userLocation]);

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getDonationTypeColor = (type) => {
    const colors = {
      food: '#ff6b6b',
      clothes: '#4ecdc4',
      books: '#45b7d1',
      money: '#96ceb4',
      other: '#feca57'
    };
    return colors[type] || '#ff6b6b';
  };

  return (
    <div className="donor-map-container">
      {showFilters && (
        <div className="map-filters mb-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Filter Donors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donation Type
              </label>
              <select
                value={filters.donationType}
                onChange={(e) => handleFilterChange('donationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="food">Food</option>
                <option value="clothes">Clothes</option>
                <option value="books">Books</option>
                <option value="money">Money</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Distance (km)
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.maxDistance}
                onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{filters.maxDistance} km</span>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showUserLocation}
                  onChange={(e) => handleFilterChange('showUserLocation', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Show My Location</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div 
        className="map-wrapper relative"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={10}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          dragging={true}
          animate={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <MapInitializer center={center} zoom={10} onMapReady={() => setIsMapReady(true)} />

          {/* User location marker */}
          {userLocation && filters.showUserLocation && (
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}
            >
              <Popup>
                <div className="text-center">
                  <strong>Your Location</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Donor markers */}
          {filteredDonors.map((donor) => (
            <Marker
              key={donor.id}
              position={[Number(donor.latitude), Number(donor.longitude)]}
              icon={customIcon}
              eventHandlers={{
                click: () => onDonorSelect && onDonorSelect(donor)
              }}
            >
              <Popup>
                <div className="donor-popup">
                  <h3 className="font-semibold text-lg mb-2">
                    {donor.user?.firstName} {donor.user?.lastName}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Type:</span>{' '}
                      <span 
                        className="px-2 py-1 rounded text-white text-xs"
                        style={{ backgroundColor: getDonationTypeColor(donor.donationType) }}
                      >
                        {donor.donationType}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Location:</span> {donor.city}, {donor.state}
                    </p>
                    {donor.distance && (
                      <p>
                        <span className="font-medium">Distance:</span> {donor.distance} km
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Availability:</span> {donor.availability}
                    </p>
                    {donor.description && (
                      <p>
                        <span className="font-medium">Description:</span> {donor.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={() => onDonorSelect && onDonorSelect(donor)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      Contact Donor
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Loading overlay */}
        {!isMapReady && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}

        {/* No donors overlay */}
        {isMapReady && filteredDonors.length === 0 && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600">No donors found in this area</p>
            </div>
          </div>
        )}
      </div>

      {/* Map legend */}
      <div className="mt-4 p-3 bg-white rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          {userLocation && (
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>Your Location</span>
            </div>
          )}
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Donors</span>
          </div>
          {Object.entries({
            food: '#ff6b6b',
            clothes: '#4ecdc4',
            books: '#45b7d1',
            money: '#96ceb4',
            other: '#feca57'
          }).map(([type, color]) => (
            <div key={type} className="flex items-center">
              <div 
                className="w-3 h-3 rounded mr-1"
                style={{ backgroundColor: color }}
              ></div>
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonorMap; 