import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Volunteer = sequelize.define('Volunteer', {
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('coordinator', 'driver', 'packer', 'distributor'), allowNull: false },
  organization: { type: DataTypes.STRING, allowNull: true }
}, {
  timestamps: true
});

export default Volunteer; 