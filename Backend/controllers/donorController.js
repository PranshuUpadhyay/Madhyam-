import { Donor, User, Donation } from '../models/index.js';
import { Op } from 'sequelize';

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Create a new donor
export const createDonor = async (req, res) => {
  try {
    const { 
      userId, latitude, longitude, address, city, state, 
      zipCode, donationType, availability, description 
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User must be logged in to register as a donor.'
      });
    }

    if (
      latitude === undefined || longitude === undefined ||
      isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required and must be valid numbers.'
      });
    }

    const donor = await Donor.create({
      userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      city,
      state,
      zipCode,
      donationType,
      availability,
      description
    });

    // Set user role to 'donor' if not already
    const user = await User.findByPk(userId);
    if (user && user.role !== 'donor') {
      user.role = 'donor';
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: donor,
      user: user
    });
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating donor',
      error: error.message
    });
  }
};

// Create a new donation
export const createDonation = async (req, res) => {
  try {
    const { userId, item, type, status, quantity, description } = req.body;
    if (!userId || !item || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const donation = await Donation.create({ userId, item, type, status, quantity, description });
    res.status(201).json({ success: true, data: donation });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ success: false, message: 'Error creating donation', error: error.message });
  }
};

// Get donations by user ID
export const getUserDonations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const donations = await Donation.findAll({
      where: { userId: parseInt(userId) },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: donations,
      count: donations.length
    });
  } catch (error) {
    console.error('Error getting user donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user donations',
      error: error.message
    });
  }
};

// Get all donations (for admin)
export const listAllDonations = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;

    const donations = await Donation.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: donations.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(donations.count / limit),
        totalItems: donations.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting all donations:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting all donations',
      error: error.message
    });
  }
};

// Find nearest donors based on location
export const findNearestDonors = async (req, res) => {
  try {
    const { 
      latitude, longitude, radius = 10, donationType, limit = 20 
    } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
    const searchRadius = parseFloat(radius);

    // Get all available donors
    const whereClause = {
      isAvailable: true
    };

    if (donationType) {
      whereClause.donationType = donationType;
    }

    // In findNearestDonors, include donations in the donor include, and filter for donors with at least one active donation
    const donors = await Donor.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'phone', 'email'],
          include: [
            {
              model: Donation,
              as: 'donations',
              where: { status: 'active' },
              required: false
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    const validDonors = donors.filter(donor => donor.user && donor.user.donations && donor.user.donations.length > 0);

    const donorsWithDistance = validDonors
      .map(donor => {
        const distance = calculateDistance(
          userLat, userLon, 
          parseFloat(donor.latitude), parseFloat(donor.longitude)
        );
        return {
          ...donor.toJSON(),
          distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
        };
      })
      .filter(donor => donor.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: donorsWithDistance,
      count: donorsWithDistance.length,
      searchRadius,
      userLocation: { latitude: userLat, longitude: userLon }
    });
  } catch (error) {
    console.error('Error finding nearest donors:', error);
    res.status(500).json({
      success: false,
      message: 'Error finding nearest donors',
      error: error.message
    });
  }
};

// Get all donors
export const getAllDonors = async (req, res) => {
  try {
    const { page = 1, limit = 10, donationType, city } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (donationType) whereClause.donationType = donationType;
    if (city) whereClause.city = { [Op.iLike]: `%${city}%` };

    // In getAllDonors, do the same include and filter
    const donors = await Donor.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'phone', 'email'],
          include: [
            {
              model: Donation,
              as: 'donations',
              where: { status: 'active' },
              required: false
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });
    const filteredDonors = donors.rows.filter(donor => donor.user && donor.user.donations && donor.user.donations.length > 0);

    res.json({
      success: true,
      data: filteredDonors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(donors.count / limit),
        totalItems: donors.count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting donors:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting donors',
      error: error.message
    });
  }
};

// Get donor by ID
export const getDonorById = async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'phone', 'email'],
        include: [{
          model: Donation,
          as: 'donations',
          required: false
        }]
      }]
    });

    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    res.json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error getting donor:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting donor',
      error: error.message
    });
  }
};

// Update donor
export const updateDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const donor = await Donor.findByPk(id);
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    await donor.update(updateData);

    res.json({
      success: true,
      data: donor
    });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donor',
      error: error.message
    });
  }
};

// Delete donor
export const deleteDonor = async (req, res) => {
  try {
    const { id } = req.params;
    const donor = await Donor.findByPk(id);
    
    if (!donor) {
      return res.status(404).json({
        success: false,
        message: 'Donor not found'
      });
    }

    await donor.destroy();

    res.json({
      success: true,
      message: 'Donor deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting donor',
      error: error.message
    });
  }
};

// Update a donation
export const updateDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const donation = await Donation.findByPk(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await donation.update(updateData);

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating donation',
      error: error.message
    });
  }
};

// Delete a donation
export const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await Donation.findByPk(id);
    
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    await donation.destroy();

    res.json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting donation',
      error: error.message
    });
  }
}; 
