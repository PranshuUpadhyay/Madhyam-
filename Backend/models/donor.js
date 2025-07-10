import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Donor = sequelize.define('Donor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  donationType: {
    type: DataTypes.ENUM('food', 'clothing', 'books', 'electronics', 'furniture', 'other'),
    allowNull: false
  },
  availability: {
    type: DataTypes.ENUM('immediate', 'scheduled', 'on-demand'),
    defaultValue: 'immediate'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalDonations: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['latitude', 'longitude']
    },
    {
      fields: ['donationType']
    },
    {
      fields: ['isAvailable']
    }
  ]
});

export default Donor; 
