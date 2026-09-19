import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import accidentRoutes from './routes/accidentRoutes.js';
import { getDbStatus } from './config/db.js';

// Load environment variables if not already loaded
dotenv.config();

const app = express();

// CORS Configuration - allow all client origins (including Cloud Run previews and local dev)
app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body Parser Middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbStatus();
  res.status(200).json({
    success: true,
    message: 'AcciAlert API is running',
    database: {
      connected: dbStatus.connected,
      status: dbStatus.connected ? 'online' : 'fallback-transient',
    },
  });
});

// API Routes
app.use('/api/accidents', accidentRoutes);

// 404 Handler for undefined API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);

  // Mongoose CastError or ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field: ${err.path}`,
    });
  }

  // Generic internal server error (never leak stack trace or sensitive info)
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred. Please try again later.',
  });
});

export default app;
