import express from 'express';
import {
  createSpecial,
  getAllSpecials,
  getSpecialById,
  updateSpecial,
  deleteSpecial,
  getSpecialsByCategory,
  getFeaturedSpecials,
  getCategories,
  upload
} from '../controllers/specialsController.js';

const router = express.Router();

// Create a new special/menu item
router.post('/', upload.single('image'), createSpecial);

// Get all specials/menu items with filters and pagination
router.get('/', getAllSpecials);

// Get featured specials
router.get('/featured', getFeaturedSpecials);

// Get categories
router.get('/categories', getCategories);

// Get specials by category
router.get('/category/:category', getSpecialsByCategory);

// Get special by ID
router.get('/:id', getSpecialById);

// Update special
router.put('/:id', upload.single('image'), updateSpecial);

// Delete special
router.delete('/:id', deleteSpecial);

export default router;