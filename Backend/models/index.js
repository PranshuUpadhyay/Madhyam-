import sequelize from '../db.js';
import User from './user.js';
import Contact from './contact.js';
import Vendor from './vendor.js';
import Donor from './donor.js';
import Blog from './blog.js';
import Special from './special.js';
import Volunteer from './volunteer.js';
import Donation from './donation.js';

// Define associations
User.hasOne(Donor, { foreignKey: 'userId', as: 'donorProfile' });
Donor.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Blog, { foreignKey: 'authorId', as: 'blogs' });
Blog.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Donation, { foreignKey: 'userId', as: 'donations' });
Donation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Named exports
export {
  sequelize,
  User,
  Contact,
  Vendor,
  Donor,
  Blog,
  Special,
  Volunteer,
  Donation
};

// Default export for backward compatibility
const db = {
  sequelize,
  User,
  Contact,
  Vendor,
  Donor,
  Blog,
  Special,
  Volunteer,
  Donation
};

export default db;