import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationContainer = () => {
  const { notifications, dispatch } = useApp();

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.5 }}
            transition={{ duration: 0.3 }}
            className={`max-w-sm w-full p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer; 