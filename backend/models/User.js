const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username:        { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String, required: true, minlength: 6 },
  displayName:     { type: String, trim: true, maxlength: 50 },
  bio:             { type: String, maxlength: 200 },
  avatar:          { type: String, default: '' },
  isPrivate:       { type: Boolean, default: false },
  followers:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pendingFollowers:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.comparePassword = function (p) { return bcrypt.compare(p, this.password); };
userSchema.methods.toPublicJSON = function () {
  const o = this.toObject(); delete o.password; delete o.pendingFollowers; return o;
};

module.exports = mongoose.model('User', userSchema);
