import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post(
  '/register',
  validate([
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().trim().escape(),
  ]),
  register
);

router.post(
  '/login',
  validate([
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  login
);

router.get('/me', protect, getMe);

export default router;
