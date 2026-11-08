const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'client' },
    // Account lockout (never returned unless a query asks for them with select)
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

