import { Router } from 'express';
import { signup, login, googleSignIn, getAllUsers, linkedinAuth, linkedinCallback } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleSignIn);
router.get('/users', getAllUsers);

// LinkedIn OAuth routes
router.get('/linkedin', linkedinAuth);
router.get('/linkedin/callback', linkedinCallback);

export default router;