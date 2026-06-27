const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  id:       { type: String, required: true },
  name:     { type: String, required: true, trim: true },
  city:     { type: String, required: true, trim: true },
  category: {
    type: String, required: true,
    enum: ['Heritage', 'Nature', 'Religious', 'Adventure'],
  },
  desc:     { type: String, required: true },
  bestTime: { type: String, required: true },
  entryFee: { type: String, default: 'Check locally' },
  image:    { type: String, default: '' },
  images:   [{ type: String }],
  mapLink:  { type: String, default: '' },
  nearby:   [{ type: String }],
}, { _id: false });

const StateSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true, trim: true },
  name:      { type: String, required: true, trim: true },
  capital:   { type: String, required: true },
  region:    { type: String, required: true },
  tagline:   { type: String, required: true },
  category:  {
    type: String, required: true,
    enum: ['Heritage', 'Nature', 'Religious', 'Adventure'],
  },
  emoji:     { type: String, default: '📍' },
  about:     { type: String, required: true },
  bestTime:  { type: String, required: true },
  language:  { type: String, required: true },
  cuisine:   { type: String, required: true },
  area:      { type: String, required: true },
  image:     { type: String, default: '' },
  heroImage: { type: String, default: '' },
  places:    [PlaceSchema],
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// Full-text search index
StateSchema.index({
  name:          'text',
  'places.name': 'text',
  'places.city': 'text',
});

module.exports = mongoose.model('State', StateSchema);