import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

// Custom email validation function
const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: true, unique: true },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, 
    validate: { 
      isValidEmail(value) {
        if (!validateEmail(value)) {
          throw new Error('Please enter a valid email address');
        }
      }
    } 
  },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'donor', 'volunteer'),
    defaultValue: 'user'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

export default User;