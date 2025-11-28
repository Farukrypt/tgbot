const User = require('../models/User');
const crypto = require('crypto');

const genCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// Check if user exists by telegram id (GET /api/check?id=12345)
exports.checkUser = async (req, res) => {
  try {
    const telegramId = Number(req.query.id || req.body.telegramId);
    if (!telegramId)
      return res.status(400).json({ error: 'Invalid telegram id' });

    const user = await User.findOne({ telegramId }).select('-__v');
    if (!user) return res.json({ registered: false });
    return res.json({ registered: true, user });
  } catch (err) {
    console.error('checkUser error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Register a user (POST /api/register)
exports.register = async (req, res) => {
  try {
    const rawId = req.telegramUser?.id || req.body.telegramId;
    const telegramId = Number(rawId);
    if (!telegramId)
      return res.status(400).json({ error: 'Invalid telegram id' });

    const {
      name,
      firstName,
      lastName,
      email,
      country,
      phone,
      age,
      workplace,
      accountNumber,
      first_name,
      last_name,
    } = req.body;

    // If first_name/last_name provided (from Telegram), prefer them; otherwise use firstName/lastName from form
    const resolvedFirstName = firstName || first_name || 'User';
    const resolvedLastName = lastName || last_name || '';
    const resolvedName =
      name ||
      [resolvedFirstName, resolvedLastName].filter(Boolean).join(' ') ||
      'Unnamed';

    // If user already exists, return it (no duplicate registration)
    const existing = await User.findOne({ telegramId });
    if (existing)
      return res.status(200).json({ success: true, user: existing });

    // Generate 4 unique unlock codes for the user
    const unlockCodes = [1, 2, 3, 4].map((id) => ({
      rewardId: id,
      code: genCode(),
    }));

    const newUser = await User.create({
      telegramId,
      name: resolvedName,
      email,
      country,
      phone,
      age,
      workplace,
      accountNumber,
      unlockCodes,
    });

    // Return the new user (including unlock codes) for development convenience
    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('register error', err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

// Unlock reward by code (POST /api/unlock)
exports.unlockReward = async (req, res) => {
  try {
    const rawId = req.telegramUser?.id || req.body.telegramId;
    const telegramId = Number(rawId);
    const code = String(req.body.code || '').toUpperCase();

    if (!telegramId)
      return res.status(400).json({ error: 'Invalid telegram id' });
    if (!code) return res.status(400).json({ error: 'Code is required' });

    const user = await User.findOne({ telegramId });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

    const codeObj = user.unlockCodes.find((c) => c.code === code);
    if (!codeObj) return res.json({ success: false, message: 'Invalid Code' });
    if (codeObj.isUsed)
      return res.json({ success: false, message: 'Code already used' });

    codeObj.isUsed = true;
    if (!user.unlockedRewards.includes(codeObj.rewardId))
      user.unlockedRewards.push(codeObj.rewardId);
    await user.save();

    return res.json({ success: true, rewardId: codeObj.rewardId });
  } catch (err) {
    console.error('unlockReward error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Save quiz result (POST /api/quiz)
exports.saveQuizResult = async (req, res) => {
  try {
    const rawId = req.telegramUser?.id || req.body.telegramId;
    const telegramId = Number(rawId);
    const { score, passed } = req.body;

    if (!telegramId)
      return res.status(400).json({ error: 'Invalid telegram id' });

    const user = await User.findOneAndUpdate(
      { telegramId },
      { quizScore: Number(score) || 0, hasPassedQuiz: Boolean(passed) },
      { new: true },
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ success: true, user });
  } catch (err) {
    console.error('saveQuizResult error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Dev helper: list users (GET /api/dev/users) - remove or protect in production
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-__v');
    return res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('listUsers error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
