import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogTags,
  getBlogsByAuthor,
  upload
} from '../controllers/blogController.js';

const router = express.Router();

// Create a new blog post
router.post('/', upload.single('image'), createBlog);

// Get all published blogs with pagination and filters
router.get('/', getAllBlogs);

// Get blogs by author (user's own blogs)
router.get('/author/:authorId', getBlogsByAuthor);

// Get blog by slug
router.get('/slug/:slug', getBlogBySlug);

// Get blog tags
router.get('/tags', getBlogTags);

// Update blog
router.put('/:id', upload.single('image'), updateBlog);

// Delete blog
router.delete('/:id', deleteBlog);

export default router; 