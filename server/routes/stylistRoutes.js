import { Router } from 'express';
import { getStylists, getStylist } from '../controllers/stylistController.js';

const router = Router();

router.get('/', getStylists);
router.get('/:id', getStylist);

export default router;
