import express from 'express';
import { registerVolunteer, loginVolunteer, getAllVolunteers } from '../controllers/volunteersController.js';

const router = express.Router();

router.post('/register', registerVolunteer);
router.post('/login', loginVolunteer);
router.get('/', getAllVolunteers);

export default router; 