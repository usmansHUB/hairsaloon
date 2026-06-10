import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Stylist from './models/Stylist.js';
import { seedAdminUser, seedServices, seedStylists } from './seedData.js';

const services = seedServices;
const stylists = seedStylists;

const seed = async () => {
  await connectDB();
  await Promise.all([Service.deleteMany(), Stylist.deleteMany(), User.deleteMany()]);

  await Service.insertMany(services);
  await Stylist.insertMany(stylists);

  await User.create(seedAdminUser);

  console.log('Database seeded successfully!');
  console.log('Admin login: admin@luxehair.com / admin123');
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
