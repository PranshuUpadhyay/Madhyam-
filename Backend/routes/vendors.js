import { Router } from 'express';
import { listVendors, addVendor } from '../controllers/vendorsController.js';

const router = Router();

router.get('/', listVendors);
router.post('/', addVendor);

export default router;