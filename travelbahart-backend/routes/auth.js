const express = require('express');
const router  = express.Router();

const {
  login,
  register,
  getMe,
} = require('../controllers/authcontroller');

const { protect } = require('../middleware/Auth');

// POST /api/auth/register  (first-time setup)
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe);

module.exports = router;