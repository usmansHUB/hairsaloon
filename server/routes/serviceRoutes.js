import { Router } from 'express';
import { getServices, getService } from '../controllers/serviceController.js';

const router = Router();

router.get('/', getServices);
router.get('/:slug', getService);

export default router;
