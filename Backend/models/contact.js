import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Contact = sequelize.define('Contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  message: { type: DataTypes.TEXT, allowNull: false }
}, {
  timestamps: true
});

export default Contact;