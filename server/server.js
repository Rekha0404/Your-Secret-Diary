const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { connectDB, dbState } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const entryRoutes = require('./routes/entryRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Simple logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Secret Diary API is running ♡',
    database: {
      connected: dbState.connected,
      mode: dbState.mode,
    },
    timestamp: new Date().toISOString(),
  });
});

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/entries', entryRoutes);

// Static frontend serving (for single-port deployment or production)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  console.log('Serving frontend build from dist directory');
  app.use(express.static(distPath));
  // Express 5 compatible SPA fallback
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Secret Diary Backend API is running! Start the frontend dev server or run `npm run build`.');
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`\n=================================================`);
      console.log(` Secret Diary Server is running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================\n`);
    });
    await connectDB();
    console.log(` Database status initialized. Active mode: ${dbState.mode.toUpperCase()}`);
  } catch (error) {
    console.error('Server startup error:', error);
  }
};

startServer();
