import { Blog, User } from '../models/index.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';

// Set up multer storage for blog images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/blogs/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    let { title, content, authorId, tags, status } = req.body;
    let image = null;
    if (req.file) {
      image = `/uploads/blogs/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }
    if (!authorId) {
      return res.status(400).json({ success: false, message: "authorId is required" });
    }
    
    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const blog = await Blog.create({
      title,
      content,
      authorId,
      image,
      tags: tags ? (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags) : [],
      status: status || 'published',
      slug
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog post',
      error: error.message
    });
  }
};

// Get all published blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, search, authorId } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    // If authorId is provided, show all blogs by that author (draft and published)
    if (authorId) {
      whereClause.authorId = authorId;
    } else {
      // Otherwise, only show published blogs
      whereClause.status = 'published';
    }

    if (tag) {
      whereClause.tags = { [Op.contains]: [tag] };
    }

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const blogs = await Blog.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: blogs.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(blogs.count / limit),
        totalItems: blogs.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting blogs',
      error: error.message
    });
  }
};

// Get blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await Blog.findOne({
      where: { slug, status: 'published' },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName']
      }]
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    await blog.increment('viewCount');

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error getting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting blog post',
      error: error.message
    });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image upload
    if (req.file) {
      updateData.image = `/uploads/blogs/${req.file.filename}`;
    } else if (typeof req.body.image === 'string') {
      updateData.image = req.body.image;
    } else if (typeof req.body.image === 'object' || Array.isArray(req.body.image)) {
      // Prevent Sequelize string violation
      delete updateData.image;
    }

    // Handle tags: ensure it's always an array of strings
    if (updateData.tags) {
      if (typeof updateData.tags === 'string') {
        updateData.tags = updateData.tags.split(',').map(t => t.trim());
      }
      // If it's already an array, leave as is
    } else {
      updateData.tags = [];
    }

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Update slug if title changed
    if (updateData.title && updateData.title !== blog.title) {
      updateData.slug = updateData.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await blog.update(updateData);

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog post',
      error: error.message
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByPk(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blog.destroy();

    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
};

// Get blog tags
export const getBlogTags = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { status: 'published' },
      attributes: ['tags']
    });

    const allTags = blogs.reduce((tags, blog) => {
      return tags.concat(blog.tags || []);
    }, []);

    const uniqueTags = [...new Set(allTags)];

    res.json({
      success: true,
      data: uniqueTags
    });
  } catch (error) {
    console.error('Error getting blog tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting blog tags',
      error: error.message
    });
  }
};

// Get blogs by author (user's own blogs)
export const getBlogsByAuthor = async (req, res) => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const blogs = await Blog.findAndCountAll({
      where: { authorId },
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'firstName', 'lastName', 'username']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: blogs.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(blogs.count / limit),
        totalItems: blogs.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting blogs by author:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting blogs by author',
      error: error.message
    });
  }
}; 