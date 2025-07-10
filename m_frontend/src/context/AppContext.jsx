import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useQuery } from 'react-query';
import { specialsService, blogService } from '../api/services';

const AppContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  screenSize: 'desktop',
  theme: 'light',
  language: 'en',
  notifications: [],
  cart: [],
  favorites: []
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SCREEN_SIZE':
      return { ...state, screenSize: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_NOTIFICATION':
      return { 
        ...state, 
        notifications: [...state.notifications, action.payload] 
      };
    case 'REMOVE_NOTIFICATION':
      return { 
        ...state, 
        notifications: state.notifications.filter(n => n.id !== action.payload) 
      };
    case 'ADD_TO_CART':
      return { 
        ...state, 
        cart: [...state.cart, action.payload] 
      };
    case 'REMOVE_FROM_CART':
      return { 
        ...state, 
        cart: state.cart.filter(item => item.id !== action.payload) 
      };
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'ADD_TO_FAVORITES':
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload] 
      };
    case 'REMOVE_FROM_FAVORITES':
      return { 
        ...state, 
        favorites: state.favorites.filter(item => item.id !== action.payload) 
      };
    case 'LOGOUT':
      return { 
        ...initialState, 
        screenSize: state.screenSize,
        theme: state.theme,
        language: state.language
      };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Handle screen size changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let screenSize = 'desktop';
      
      if (width < 640) screenSize = 'mobile';
      else if (width < 1024) screenSize = 'tablet';
      else screenSize = 'desktop';
      
      dispatch({ type: 'SET_SCREEN_SIZE', payload: screenSize });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    dispatch({ type: 'SET_THEME', payload: savedTheme });
  }, []);

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'en';
    dispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
  }, []);

  // Load user and token from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
    }
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      state.notifications.forEach(notification => {
        if (Date.now() - notification.timestamp > 5000) {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id });
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [state.notifications]);

  // Listen for user changes in localStorage (e.g., after donor registration)
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'user') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          dispatch({ type: 'SET_USER', payload: JSON.parse(storedUser) });
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Fetch featured specials
  const { data: featuredSpecials, isLoading: specialsLoading } = useQuery(
    'featuredSpecials',
    () => specialsService.getFeaturedSpecials({ limit: 6 }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Fetch recent blogs
  const { data: recentBlogs, isLoading: blogsLoading } = useQuery(
    'recentBlogs',
    () => blogService.getAllBlogs({ limit: 3, page: 1 }),
    {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery(
    'categories',
    specialsService.getCategories,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 20 * 60 * 1000, // 20 minutes
    }
  );

  const value = {
    ...state,
    dispatch,
    featuredSpecials: featuredSpecials?.data || [],
    recentBlogs: recentBlogs?.data || [],
    categories: categories?.data || [],
    isLoading: specialsLoading || blogsLoading || categoriesLoading,
    
    // Helper functions
    addNotification: (message, type = 'info') => {
      const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: Date.now()
      };
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    },
    
    setTheme: (theme) => {
      localStorage.setItem('theme', theme);
      dispatch({ type: 'SET_THEME', payload: theme });
    },
    
    setLanguage: (language) => {
      localStorage.setItem('language', language);
      dispatch({ type: 'SET_LANGUAGE', payload: language });
    },
    
    login: (user) => {
      dispatch({ type: 'SET_USER', payload: user });
    },
    
    logout: () => {
      dispatch({ type: 'LOGOUT' });
    },
    
    addToCart: (item) => {
      dispatch({ type: 'ADD_TO_CART', payload: item });
    },
    
    removeFromCart: (itemId) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    },
    
    addToFavorites: (item) => {
      dispatch({ type: 'ADD_TO_FAVORITES', payload: item });
    },
    
    removeFromFavorites: (itemId) => {
      dispatch({ type: 'REMOVE_FROM_FAVORITES', payload: itemId });
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 