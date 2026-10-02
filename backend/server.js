const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 Camera Rental API is running!' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});