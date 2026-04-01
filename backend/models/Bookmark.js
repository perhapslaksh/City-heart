const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  place:    { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  type:     { type: String, enum: ['heart','bookmark','visited','want_to_go'], default: 'bookmark' },
  review:   {
    text:   { type: String, maxlength: 500 },
    rating: { type: Number, min: 1, max: 5 },
    tags:   [String],
    photos: [String],
  },
  note:     { type: String, maxlength: 200 },
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

bookmarkSchema.index({ user: 1, place: 1 }, { unique: true });
bookmarkSchema.index({ user: 1 });
bookmarkSchema.index({ place: 1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
