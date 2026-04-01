const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  mapboxId:      { type: String, unique: true, sparse: true },
  name:          { type: String, required: true, trim: true },
  address:       String,
  city:          { type: String, trim: true },
  country:       { type: String, trim: true },
  coordinates:   { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], required: true } },
  category:      { type: String, default: 'other' },
  bookmarkCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewCount:   { type: Number, default: 0 },
}, { timestamps: true });

placeSchema.index({ coordinates: '2dsphere' });
placeSchema.index({ city: 1 });
placeSchema.index({ name: 'text', city: 'text' });

module.exports = mongoose.model('Place', placeSchema);
