import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Special = sequelize.define('Special', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('food', 'beverage', 'dessert', 'snack'),
    allowNull: false
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isSpecial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  allergens: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  nutritionalInfo: {
    type: DataTypes.JSON,
    allowNull: true
  },
  preparationTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true
  }
}, {
  timestamps: true
});

export default Special; 