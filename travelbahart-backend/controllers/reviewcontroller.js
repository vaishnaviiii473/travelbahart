const Review = require('../models/Review');

// ── PUBLIC ─────────────────────────────────────────────────────

// GET /api/reviews?stateId=rajasthan&placeId=r1
exports.getReviews = async (req, res) => {
  try {
    const { stateId, placeId } = req.query;
    if (!stateId || !placeId)
      return res.status(400).json({ success: false, message: 'stateId and placeId are required' });

    const reviews = await Review.find({ stateId, placeId, isApproved: true })
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate average rating
    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

    res.json({ success: true, count: reviews.length, averageRating: avg, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { placeId, stateId, placeName, stateName, name, rating, comment } = req.body;

    if (!placeId || !stateId || !name || !rating || !comment)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    // Basic spam guard — one review per name+place per hour
    const recent = await Review.findOne({
      placeId,
      stateId,
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    });
    if (recent)
      return res.status(429).json({ success: false, message: 'You already reviewed this place recently.' });

    const review = await Review.create({
      placeId, stateId, placeName, stateName,
      name, rating: Number(rating), comment,
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/reviews/:id/helpful — increment helpful count
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    if (!review)
      return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, helpful: review.helpful });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ADMIN (protected) ─────────────────────────────────────────

// GET /api/reviews/all  — admin sees all including unapproved
exports.getAllReviews = async (req, res) => {
  try {
    const { stateId, placeId, approved } = req.query;
    const filter = {};
    if (stateId)  filter.stateId   = stateId;
    if (placeId)  filter.placeId   = placeId;
    if (approved !== undefined) filter.isApproved = approved === 'true';

    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/reviews/:id/approve — toggle approval
exports.toggleApproval = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review)
      return res.status(404).json({ success: false, message: 'Review not found' });
    review.isApproved = !review.isApproved;
    await review.save();
    res.json({ success: true, isApproved: review.isApproved });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};