const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI?.trim()) {
    throw new Error('MONGO_URI is missing from backend/.env.');
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
  });

  console.log('MongoDB Connected');
};

module.exports = connectDB;