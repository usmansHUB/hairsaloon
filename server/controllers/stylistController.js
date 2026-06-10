import Stylist from '../models/Stylist.js';

export const getStylists = async (req, res, next) => {
  try {
    const stylists = await Stylist.find({ available: true }).sort({ rating: -1 });
    res.json(stylists);
  } catch (err) {
    next(err);
  }
};

export const getStylist = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ message: 'Stylist not found' });
    res.json(stylist);
  } catch (err) {
    next(err);
  }
};
