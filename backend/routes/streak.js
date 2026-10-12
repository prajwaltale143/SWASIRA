const express = require('express');
const router = express.Router();
const { StreakLog, DietPlan } = require('../models');

// GET /api/streak/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    let streakLog = await StreakLog.findOne({ where: { user_id: userId } });
    if (!streakLog) {
      streakLog = await StreakLog.create({
        user_id: userId,
        current_streak: 0,
        flex_passes_remaining: 2,
        last_active_date: null
      });
    }

    // Build 7-day mini-calendar
    const days = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = dayNames[d.getDay()];

      // Check if plans exist for this date
      const plans = await DietPlan.findAll({
        where: { user_id: userId, date: dateStr }
      });

      let status = 'empty';
      if (plans.length > 0) {
        if (plans.some(p => p.status === 'flipped')) {
          status = 'flipped'; // Amber for flexed / flipped
        } else if (plans.some(p => p.status === 'done')) {
          status = 'done'; // Teal for done
        } else {
          status = 'planned';
        }
      }

      days.push({
        date: dateStr,
        dayName: dayLabel,
        isToday: i === 0,
        status, // 'done', 'flipped', 'planned', 'empty'
      });
    }

    return res.status(200).json({
      currentStreak: streakLog.current_streak,
      flexPassesRemaining: streakLog.flex_passes_remaining,
      lastActiveDate: streakLog.last_active_date,
      history7Days: days,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
