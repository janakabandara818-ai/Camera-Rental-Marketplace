const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '.env'),
});

const connectDB = require('./config/db');

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '100kb' }));

app.get('/', (req, res) => {
  res.json({
    message: 'Camera Rental API is running.',
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

app.use((req, res) => {
  res.status(404).json({
    message: 'API route not found.',
  });
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON request body.',
    });
  }

  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      message: 'Request body is too large.',
    });
  }

  console.error(
    'Unhandled API error:',
    error.name || 'Error'
  );

  return res.status(500).json({
    message: 'An unexpected server error occurred. Please try again.',
  });
});

async function startServer() {
  try {
    if (!process.env.JWT_SECRET?.trim()) {
      throw new Error('JWT_SECRET is missing.');
    }

    const port = Number(process.env.PORT || 5000);

    if (
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535
    ) {
      throw new Error('Invalid server port.');
    }

    await connectDB();

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${port} is already in use. Stop the other backend process and restart.`
        );
      } else {
        console.error(
          'Unable to start server:',
          error.code || error.name || 'Error'
        );
      }

      process.exit(1);
    });
  } catch (error) {
    console.error(
      'Backend startup failed:',
      error.name || 'Error',
      error.code || ''
    );

    console.error(
      'Check backend/.env configuration, MongoDB connectivity, and Atlas network access.'
    );

    process.exit(1);
  }
}

void startServer();