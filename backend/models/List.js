const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true, maxlength: 60 },
  description: { type: String, maxlength: 200 },
  emoji:       { type: String, default: '📍' },
  places:      [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
  isPublic:    { type: Boolean, default: true },
  likeCount:   { type: Number, default: 0 },
}, { timestamps: true });

listSchema.index({ user: 1 });
module.exports = mongoose.model('List', listSchema);
