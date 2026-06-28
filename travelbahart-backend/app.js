const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── Middleware (MUST come before routes) ────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ── Static Files ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────
const stateRoutes  = require('./routes/states');
const authRoutes   = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const reviewRoutes = require('./routes/reviews');

app.use('/api/states',  stateRoutes);
app.use('/api/auth',    authRoutes);
app.use('/api/upload',  uploadRoutes);
app.use('/api/reviews', reviewRoutes);

// ── Root Test Route ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'TravelBharat API Running ✅',
    version: '1.0.0',
    endpoints: {
      states:  '/api/states',
      auth:    '/api/auth',
      upload:  '/api/upload',
      reviews: '/api/reviews',
    },
  });
});

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ── MongoDB Connect + Start Server ──────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 TravelBharat API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });
