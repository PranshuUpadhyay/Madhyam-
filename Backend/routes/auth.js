import { Router } from 'express';
import { signup, login, googleSignIn, getAllUsers } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleSignIn);
router.get('/users', getAllUsers);

export default router;