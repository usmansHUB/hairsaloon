export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const status = err.statusCode || 500;
  const message = err.message || 'Server error';

  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      message: 'This time slot is already booked. Please choose another.',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const firstMsg = Object.values(err.errors)[0]?.message || 'Validation failed';
    return res.status(400).json({ message: firstMsg });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  res.status(status).json({ message });
};
