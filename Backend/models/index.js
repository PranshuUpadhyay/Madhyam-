import sequelize from '../db.js';
import User from './User.js';
import Contact from './Contact.js';
import Vendor from './Vendor.js';

const db = {
  sequelize,
  User,
  Contact,
  Vendor
};

export default db;