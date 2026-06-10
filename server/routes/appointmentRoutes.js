import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAvailableSlots,
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const appointmentValidation = validate([
  body('serviceIds')
    .isArray({ min: 1 })
    .withMessage('Select at least one service'),
  body('serviceIds.*')
    .isMongoId()
    .withMessage('Invalid service ID'),
  body('stylistId')
    .isMongoId()
    .withMessage('Invalid stylist ID'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('timeSlot')
    .matches(/^\d{2}:\d{2}$/)
    .withMessage('Valid time slot is required'),
  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  body('guestName')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
  body('guestEmail')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),
  body('guestPhone')
    .optional({ checkFalsy: true })
    .trim()
    .escape(),
]);

router.get('/slots', getAvailableSlots);
router.get('/mine', protect, getMyAppointments);
router.get('/', protect, adminOnly, getAllAppointments);
router.post('/', protect, appointmentValidation, createAppointment);
router.patch('/:id/cancel', protect, cancelAppointment);
router.patch('/:id/status', protect, adminOnly, updateAppointmentStatus);

export default router;
