require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { hashPassword } = require('../utils/hashPassword');

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin already exists');
  } else {
    await User.create({
      name: 'Admin',
      email,
      password: await hashPassword(password),
      role: 'admin'
    });
    console.log('Admin created');
  }

  await mongoose.disconnect();
}

createAdmin();
