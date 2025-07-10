import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  item: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('food', 'clothes', 'books', 'money', 'other'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'completed'),
    defaultValue: 'active',
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true
});

export default Donation; 