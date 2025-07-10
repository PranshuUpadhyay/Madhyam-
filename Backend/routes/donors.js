import express from 'express';
import {
  createDonor,
  findNearestDonors,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
  createDonation,
  listAllDonations,
  getUserDonations,
  updateDonation,
  deleteDonation
} from '../controllers/donorController.js';
import { getSummaryStats } from '../controllers/statsController.js';

const router = express.Router();

// Create a new donor
router.post('/', createDonor);

// Find nearest donors based on location (GIS functionality)
router.get('/nearest', findNearestDonors);

// Get all donors with pagination and filters
router.get('/', getAllDonors);

// Get donor by ID
router.get('/:id', getDonorById);

// Update donor
router.put('/:id', updateDonor);

// Delete donor
router.delete('/:id', deleteDonor);

// Create a new donation
router.post('/donations', createDonation);

// Get all donations (for admin)
router.get('/donations', listAllDonations);

// Get donations by user ID
router.get('/donations/user/:userId', getUserDonations);

// Update a donation
router.put('/donations/:id', updateDonation);

// Delete a donation
router.delete('/donations/:id', deleteDonation);

// Get summary stats for dashboard/homepage
router.get('/stats/summary', getSummaryStats);

export default router; 
