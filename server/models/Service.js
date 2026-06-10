import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    category: {
      type: String,
      enum: ['cut', 'color', 'style', 'treatment', 'grooming'],
      required: true,
    },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
