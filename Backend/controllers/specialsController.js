import { Special } from '../models/index.js';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';

// Set up multer storage for specials images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/specials/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage });

// Create a new special/menu item
export const createSpecial = async (req, res) => {
  try {
    const {
      name, description, price, image, category, isAvailable,
      isSpecial, ingredients, allergens, nutritionalInfo, preparationTime
    } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = `/uploads/specials/${req.file.filename}`;
    } else if (typeof image === 'string') {
      imagePath = image;
    }

    // Parse ingredients and allergens if they are strings
    const parseArray = val => (typeof val === 'string' ? val.split(',').map(v => v.trim()).filter(Boolean) : Array.isArray(val) ? val : []);
    const parseJSON = val => {
      if (typeof val === 'string' && val.trim() !== '') {
        try { return JSON.parse(val); } catch { return val; }
      }
      return typeof val === 'object' ? val : {};
    };
    const ingredientsArr = parseArray(ingredients);
    const allergensArr = parseArray(allergens);
    const nutritionalObj = parseJSON(nutritionalInfo);

    const special = await Special.create({
      name,
      description,
      price: parseFloat(price),
      image: imagePath,
      category,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isSpecial: isSpecial !== undefined ? isSpecial : false,
      ingredients: ingredientsArr,
      allergens: allergensArr,
      nutritionalInfo: nutritionalObj,
      preparationTime: preparationTime ? parseInt(preparationTime) : null
    });

    res.status(201).json({
      success: true,
      data: special
    });
  } catch (error) {
    console.error('Error creating special:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating special',
      error: error.message
    });
  }
};

// Get all specials/menu items
export const getAllSpecials = async (req, res) => {
  try {
    const { 
      page = 1, limit = 20, category, isSpecial, isAvailable, 
      search, minPrice, maxPrice, sortBy = 'name', sortOrder = 'ASC' 
    } = req.query;
    
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (category) whereClause.category = category;
    if (isSpecial !== undefined) whereClause.isSpecial = isSpecial === 'true';
    if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === 'true';
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    const specials = await Special.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder.toUpperCase()]]
    });

    res.json({
      success: true,
      data: specials.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(specials.count / limit),
        totalItems: specials.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting specials:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting specials',
      error: error.message
    });
  }
};

// Get special by ID
export const getSpecialById = async (req, res) => {
  try {
    const { id } = req.params;
    const special = await Special.findByPk(id);

    if (!special) {
      return res.status(404).json({
        success: false,
        message: 'Special not found'
      });
    }

    res.json({
      success: true,
      data: special
    });
  } catch (error) {
    console.error('Error getting special:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting special',
      error: error.message
    });
  }
};

// Update special
export const updateSpecial = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Handle image upload
    if (req.file) {
      updateData.image = `/uploads/specials/${req.file.filename}`;
    } else if (typeof req.body.image === 'string') {
      updateData.image = req.body.image;
    } else if (typeof req.body.image === 'object' || Array.isArray(req.body.image)) {
      delete updateData.image;
    }

    // Parse ingredients and allergens if they are strings
    const parseArray = val => (typeof val === 'string' ? val.split(',').map(v => v.trim()).filter(Boolean) : Array.isArray(val) ? val : []);
    const parseJSON = val => {
      if (typeof val === 'string' && val.trim() !== '') {
        try { return JSON.parse(val); } catch { return val; }
      }
      return typeof val === 'object' ? val : {};
    };
    if (updateData.ingredients) updateData.ingredients = parseArray(updateData.ingredients);
    if (updateData.allergens) updateData.allergens = parseArray(updateData.allergens);
    if (updateData.nutritionalInfo) updateData.nutritionalInfo = parseJSON(updateData.nutritionalInfo);

    const special = await Special.findByPk(id);
    if (!special) {
      return res.status(404).json({
        success: false,
        message: 'Special not found'
      });
    }

    await special.update(updateData);

    res.json({
      success: true,
      data: special
    });
  } catch (error) {
    console.error('Error updating special:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating special',
      error: error.message
    });
  }
};

// Delete special
export const deleteSpecial = async (req, res) => {
  try {
    const { id } = req.params;
    const special = await Special.findByPk(id);
    
    if (!special) {
      return res.status(404).json({
        success: false,
        message: 'Special not found'
      });
    }

    await special.destroy();

    res.json({
      success: true,
      message: 'Special deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting special:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting special',
      error: error.message
    });
  }
};

// Get specials by category
export const getSpecialsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const specials = await Special.findAll({
      where: { 
        category,
        isAvailable: true
      },
      limit: parseInt(limit),
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      data: specials,
      category
    });
  } catch (error) {
    console.error('Error getting specials by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting specials by category',
      error: error.message
    });
  }
};

// Get featured specials
export const getFeaturedSpecials = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const specials = await Special.findAll({
      where: { 
        isSpecial: true,
        isAvailable: true
      },
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: specials
    });
  } catch (error) {
    console.error('Error getting featured specials:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting featured specials',
      error: error.message
    });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Special.findAll({
      attributes: ['category'],
      group: ['category'],
      where: { isAvailable: true }
    });

    const categoryList = categories.map(item => item.category);

    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting categories',
      error: error.message
    });
  }
}; 