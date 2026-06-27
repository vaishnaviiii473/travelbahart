const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  placeId:   { type: String, required: true, trim: true },
  stateId:   { type: String, required: true, trim: true },
  placeName: { type: String, required: true, trim: true },
  stateName: { type: String, required: true, trim: true },
  name:      { type: String, required: true, trim: true, maxlength: 60 },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true, trim: true, maxlength: 500 },
  helpful:   { type: Number, default: 0 },   // "helpful" upvotes
  isApproved:{ type: Boolean, default: true }, // admin can hide spam
}, { timestamps: true });

// Index for fast lookup by place
ReviewSchema.index({ stateId: 1, placeId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);