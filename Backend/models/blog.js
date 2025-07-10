import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Blog = sequelize.define('Blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Blog; 