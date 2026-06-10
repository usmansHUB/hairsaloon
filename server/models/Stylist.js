import mongoose from 'mongoose';

const stylistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    bio: { type: String, required: true },
    specialties: [{ type: String }],
    image: { type: String, required: true },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    yearsExperience: { type: Number, default: 1 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Stylist', stylistSchema);
