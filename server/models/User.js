const mongoose = require('mongoose');

const UnlockCodeSchema = new mongoose.Schema(
  {
    rewardId: Number,
    code: String,
    isUsed: { type: Boolean, default: false },
    isSent: { type: Boolean, default: false }, // Added to track if admin sent it
  },
  { _id: false },
);

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String },

  // NEW FIELDS
  country: { type: String, default: '' },
  phone: { type: String, default: '' },
  age: { type: Number, default: 0 },

  // REMOVED: workplace (replaced by country/phone in importance usually, but kept if you want)
  workplace: String,
  accountNumber: String,

  // QUIZ FIELDS
  hasPassedQuiz: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },

  unlockCodes: [UnlockCodeSchema],
  unlockedRewards: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
