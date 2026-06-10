import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    guestPhone: { type: String, trim: true },
    services: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    ],
    stylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Stylist', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String, trim: true, maxlength: 500 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: { type: Number, required: true },
    totalDuration: { type: Number, required: true },
  },
  { timestamps: true }
);

// Compound index to prevent double-booking the same stylist at the same time
// The unique index ensures no two active appointments share the same slot
appointmentSchema.index({ stylist: 1, date: 1, timeSlot: 1 });

// Validate at least one service is selected
appointmentSchema.path('services').validate(
  (val) => val && val.length > 0,
  'At least one service must be selected.'
);

export default mongoose.model('Appointment', appointmentSchema);
