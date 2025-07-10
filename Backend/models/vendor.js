import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Vendor = sequelize.define('Vendor', {
  name: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  contact: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('vendor', 'donor'), allowNull: false, defaultValue: 'donor' },
  description: { type: DataTypes.TEXT, allowNull: true }
}, {
  timestamps: false
});

export default Vendor;