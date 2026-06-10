import Service from '../models/Service.js';

export const getServices = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    const services = await Service.find(filter).sort({ price: 1 });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

export const getService = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    next(err);
  }
};
