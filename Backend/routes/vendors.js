import { Router } from 'express';
import { listVendors, addVendor } from '../controllers/vendorsController.js';

const router = Router();

router.get('/vendors', listVendors);
router.post('/vendors', addVendor);

export default router;