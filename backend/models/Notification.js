const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type:      { type: String, enum: ['follow','follow_request','review_like','new_review'], required: true },
  data:      { placeName: String, listName: String },
  read:      { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });
module.exports = mongoose.model('Notification', notificationSchema);
