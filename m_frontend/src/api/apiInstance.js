import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // Production (Render)
  if (process.env.NODE_ENV === 'production') {
    return process.env.REACT_APP_BACKEND_URL || 'https://madhyam-backend.onrender.com/api';
  }

  // Development
  return process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';
};

export const baseURL = getBaseURL();

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
  withCredentials: true // Include credentials for CORS
});

// Request interceptor for logging (development only)
if (process.env.NODE_ENV === 'development') {
  axiosInstance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Network error
      console.error('❌ Network Error:', error.message);
    } else {
      // Other error
      console.error('❌ Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
