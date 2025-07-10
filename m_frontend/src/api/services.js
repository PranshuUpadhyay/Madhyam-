import apiInstance from './apiInstance.js';

// Auth Services
export const authService = {
  login: (credentials) => apiInstance.post('/auth/login', credentials),
  register: (userData) => apiInstance.post('/auth/register', userData),
  logout: () => apiInstance.post('/auth/logout'),
  getProfile: () => apiInstance.get('/auth/profile'),
  updateProfile: (data) => apiInstance.put('/auth/profile', data)
};

// Donor Services
export const donorService = {
  createDonor: (donorData) => apiInstance.post('/donors', donorData),
  findNearestDonors: (params) => apiInstance.get('/donors/nearest', { params }),
  getAllDonors: (params) => apiInstance.get('/donors', { params }),
  getDonorById: (id) => apiInstance.get(`/donors/${id}`),
  updateDonor: (id, data) => apiInstance.put(`/donors/${id}`, data),
  deleteDonor: (id) => apiInstance.delete(`/donors/${id}`),
  getSummaryStats: () => apiInstance.get('/donors/stats/summary'),
};

// Blog Services
export const blogService = {
  createBlog: (blogData, isMultipart = false) => {
    if (isMultipart) {
      return apiInstance.post('/blogs', blogData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiInstance.post('/blogs', blogData);
  },
  getAllBlogs: (params) => apiInstance.get('/blogs', { params }),
  getBlogsByAuthor: (authorId, params) => apiInstance.get(`/blogs/author/${authorId}`, { params }),
  getBlogBySlug: (slug) => apiInstance.get(`/blogs/slug/${slug}`),
  getBlogTags: () => apiInstance.get('/blogs/tags'),
  updateBlog: (id, data) => {
    // Check if data contains a File (for image upload)
    if (data && data.image instanceof File) {
      const formData = new FormData();
      // Append all fields except image
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      return apiInstance.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    // Otherwise, send as JSON
    return apiInstance.put(`/blogs/${id}`, data);
  },
  deleteBlog: (id) => apiInstance.delete(`/blogs/${id}`)
};

// Specials/Menu Services
export const specialsService = {
  createSpecial: (specialData) => apiInstance.post('/specials', specialData),
  getAllSpecials: (params) => apiInstance.get('/specials', { params }),
  getFeaturedSpecials: (params) => apiInstance.get('/specials/featured', { params }),
  getCategories: () => apiInstance.get('/specials/categories'),
  getSpecialsByCategory: (category, params) => 
    apiInstance.get(`/specials/category/${category}`, { params }),
  getSpecialById: (id) => apiInstance.get(`/specials/${id}`),
  updateSpecial: (id, data) => apiInstance.put(`/specials/${id}`, data),
  deleteSpecial: (id) => apiInstance.delete(`/specials/${id}`)
};

// Contact Services
export const contactService = {
  submitContact: (contactData) => apiInstance.post('/contact', contactData),
  getAllContacts: (params) => apiInstance.get('/contact', { params }),
  getContactById: (id) => apiInstance.get(`/contact/${id}`),
  deleteContact: (id) => apiInstance.delete(`/contact/${id}`)
};

// Vendor Services
export const vendorService = {
  createVendor: (vendorData) => apiInstance.post('/vendors', vendorData),
  getAllVendors: (params) => apiInstance.get('/vendors', { params }),
  getVendorById: (id) => apiInstance.get(`/vendors/${id}`),
  updateVendor: (id, data) => apiInstance.put(`/vendors/${id}`, data),
  deleteVendor: (id) => apiInstance.delete(`/vendors/${id}`)
};

// Donation Services
export const donationService = {
  createDonation: (data) => apiInstance.post('/donors/donations', data),
  getUserDonations: (userId) => apiInstance.get(`/donors/donations/user/${userId}`),
  getAllDonations: (params) => apiInstance.get('/donors/donations', { params }),
  updateDonation: (id, data) => apiInstance.put(`/donors/donations/${id}`, data),
  deleteDonation: (id) => apiInstance.delete(`/donors/donations/${id}`),
};

// Utility function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Network error
    return {
      message: 'Network error. Please check your connection.',
      status: 0
    };
  } else {
    // Other error
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0
    };
  }
};

// Utility function to get user location
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}; 
