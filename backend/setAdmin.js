const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

async function setAdmin() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is missing from backend/.env');
      process.exitCode = 1;
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email: 'admin@camerarental.test' },
      { $set: { role: 'admin' } },
      {
        returnDocument: 'after',
        runValidators: true,
      }
    ).select('name email role');

    if (!user) {
      console.error(
        'Account not found. Register admin@camerarental.test on the website first.'
      );
      process.exitCode = 1;
      return;
    }

    console.log('Admin account is ready.');
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Sign out and sign in again on the website.');
  } catch {
    console.error(
      'Admin setup failed. Check your MongoDB connection and backend/.env.'
    );
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

setAdmin();