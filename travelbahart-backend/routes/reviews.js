const express = require('express');
const router  = express.Router();

const {
  getReviews,
  addReview,
  markHelpful,
  getAllReviews,
  toggleApproval,
  deleteReview,
} = require('../controllers/reviewcontroller');

const { protect } = require('../middleware/Auth');

// ── Public ───────────────────────────────────────────────────
// GET  /api/reviews?stateId=rajasthan&placeId=r1
router.get('/',              getReviews);

// POST /api/reviews
router.post('/',             addReview);

// PATCH /api/reviews/:id/helpful
router.patch('/:id/helpful', markHelpful);

// ── Admin Protected ──────────────────────────────────────────
// GET  /api/reviews/all
router.get('/all',              protect, getAllReviews);

// PATCH /api/reviews/:id/approve
router.patch('/:id/approve',    protect, toggleApproval);

// DELETE /api/reviews/:id
router.delete('/:id',           protect, deleteReview);

module.exports = router;