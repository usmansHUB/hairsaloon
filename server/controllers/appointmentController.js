import Appointment from '../models/Appointment.js';
import Service from '../models/Service.js';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30',
];

export const getAvailableSlots = async (req, res, next) => {
  try {
    const { stylistId, date, serviceIds } = req.query;
    if (!stylistId || !date) {
      return res.status(400).json({ message: 'stylistId and date are required' });
    }

    const selectedServiceIds = Array.isArray(serviceIds)
      ? serviceIds
      : serviceIds
          ? serviceIds.split(',').map((id) => id.trim()).filter(Boolean)
          : [];

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const booked = await Appointment.find({
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: 'cancelled' },
      ...(selectedServiceIds.length
        ? { services: { $in: selectedServiceIds } }
        : { stylist: stylistId }),
    }).select('timeSlot');

    const bookedSet = new Set(booked.map((a) => a.timeSlot));
    const bookedSlots = [...bookedSet].sort((a, b) => a.localeCompare(b));
    const available = TIME_SLOTS.filter((slot) => !bookedSet.has(slot));

    res.json({ slots: available, bookedSlots, allSlots: TIME_SLOTS });
  } catch (err) {
    next(err);
  }
};

export const createAppointment = async (req, res, next) => {
  try {
    const {
      serviceIds, stylistId, date, timeSlot,
      notes, guestName, guestEmail, guestPhone,
    } = req.body;

    // --- Validate guest bookings require name and email ---
    if (!req.user && (!guestName || !guestEmail)) {
      return res.status(400).json({
        message: 'For guest bookings, name and email are required.',
      });
    }

    // --- Look up all selected services ---
    const services = await Service.find({ _id: { $in: serviceIds } });
    if (services.length === 0) {
      return res.status(404).json({ message: 'No valid services found' });
    }
    if (services.length !== serviceIds.length) {
      return res.status(400).json({ message: 'One or more selected services are invalid' });
    }

    const totalPrice = services.reduce((sum, s) => sum + s.price, 0);
    const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);

    // --- Explicit double-booking check ---
    // Prevents the SAME stylist from being booked at the SAME date+time,
    // even if two clients submit simultaneously (race-condition safe with
    // the DB-level unique index as a backup).
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const conflict = await Appointment.findOne({
      date: { $gte: dayStart, $lte: dayEnd },
      timeSlot,
      status: { $ne: 'cancelled' },
      services: { $in: serviceIds },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'This service is already booked for that date and time. Please choose another slot.',
      });
    }

    // --- Create the appointment ---
    const appointment = await Appointment.create({
      user: req.user ? req.user._id : undefined,
      guestName: guestName?.trim(),
      guestEmail: guestEmail?.trim().toLowerCase(),
      guestPhone: guestPhone?.trim(),
      services: serviceIds,
      stylist: stylistId,
      date: new Date(date),
      timeSlot,
      notes: notes?.trim(),
      totalPrice,
      totalDuration,
    });

    await appointment.populate(['services', 'stylist', 'user']);

    res.status(201).json(appointment);
  } catch (err) {
    // Handle MongoDB duplicate key error (backup for race conditions)
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This time slot was just booked by another client. Please choose another.',
      });
    }
    next(err);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('services')
      .populate('stylist')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Allow cancel by the owning user or admin
    const isOwner = appointment.user && appointment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};

export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('services')
      .populate('stylist')
      .populate('user', 'name email phone')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (err) {
    next(err);
  }
};

export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('services')
      .populate('stylist')
      .populate('user', 'name email');

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    next(err);
  }
};
