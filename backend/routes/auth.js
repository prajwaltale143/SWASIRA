const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, StreakLog, Condition, Allergy } = require('../models');
const authenticateToken = require('../middleware/authMiddleware');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'swasira_super_secret_jwt_key_2026_nutrition_health_secure';

// Helper to determine onboarding completion
function checkOnboardingCompletion(user, conditionsCount) {
  return (
    user.age !== null &&
    user.diet_type !== null &&
    user.diet_type !== '' &&
    conditionsCount > 0
  );
}

// POST /api/auth/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Please provide your name.' });
    }
    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // CRITICAL DATA RULE: Personal info is not seeded or guessed; starts null
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
      age: null,
      weight: null,
      height: null,
      gender: null,
      diet_type: null,
    });

    // Create fresh streak log starting at 0 streak and 2 weekly flex passes
    await StreakLog.create({
      user_id: user.id,
      current_streak: 0,
      flex_passes_remaining: 2,
      last_active_date: null,
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        diet_type: user.diet_type,
      },
      token,
      hasCompletedOnboarding: false,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      where: { email: normalizedEmail },
      include: [
        { model: Condition, as: 'conditions' },
        { model: Allergy, as: 'allergies' },
        { model: StreakLog, as: 'streak_log' }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    const hasCompletedOnboarding = checkOnboardingCompletion(user, (user.conditions || []).length);

    return res.status(200).json({
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        diet_type: user.diet_type,
      },
      token,
      hasCompletedOnboarding,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Condition, as: 'conditions' },
        { model: Allergy, as: 'allergies' },
        { model: StreakLog, as: 'streak_log' }
      ]
    });

    const hasCompletedOnboarding = checkOnboardingCompletion(user, (user.conditions || []).length);

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        gender: user.gender,
        diet_type: user.diet_type,
        conditions: (user.conditions || []).map(c => c.condition_name),
        allergies: (user.allergies || []).map(a => a.allergy_name),
        streak: user.streak_log ? user.streak_log.current_streak : 0,
        flexPasses: user.streak_log ? user.streak_log.flex_passes_remaining : 2,
      },
      hasCompletedOnboarding,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
