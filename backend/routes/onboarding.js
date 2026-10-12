const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User, Condition, Allergy, RoutineAnswer, MedicalHistory, StreakLog } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'swasira_super_secret_jwt_key_2026_nutrition_health_secure';

// Helper to extract user ID from either token header or request body
function getUserId(req) {
  if (req.body && req.body.userId) {
    return parseInt(req.body.userId, 10);
  }
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
      } catch (err) {
        return null;
      }
    }
  }
  return null;
}

// POST /api/onboarding
router.post('/', async (req, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'User identification required to save onboarding data.' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const {
      step,
      name,
      age,
      weight,
      height,
      gender,
      conditions,
      allergies,
      diet_type,
      routineAnswers,
      medicalHistory,
    } = req.body;

    // Update basic user profile fields if provided
    const userUpdates = {};
    if (name !== undefined && name !== null) userUpdates.name = name.trim();
    if (age !== undefined && age !== null && age !== '') userUpdates.age = parseInt(age, 10);
    if (weight !== undefined && weight !== null && weight !== '') userUpdates.weight = parseFloat(weight);
    if (height !== undefined && height !== null && height !== '') userUpdates.height = parseFloat(height);
    if (gender !== undefined && gender !== null) userUpdates.gender = gender;
    if (diet_type !== undefined && diet_type !== null) userUpdates.diet_type = diet_type;

    if (Object.keys(userUpdates).length > 0) {
      await user.update(userUpdates);
    }

    // Save Conditions if provided
    if (Array.isArray(conditions)) {
      await Condition.destroy({ where: { user_id: userId } });
      const conditionRecords = conditions
        .filter(c => c && c.trim() !== '')
        .map(c => ({ user_id: userId, condition_name: c.trim() }));
      if (conditionRecords.length > 0) {
        await Condition.bulkCreate(conditionRecords);
      }
    }

    // Save Allergies if provided
    if (Array.isArray(allergies)) {
      await Allergy.destroy({ where: { user_id: userId } });
      const allergyRecords = allergies
        .filter(a => a && a.trim() !== '')
        .map(a => ({ user_id: userId, allergy_name: a.trim() }));
      if (allergyRecords.length > 0) {
        await Allergy.bulkCreate(allergyRecords);
      }
    }

    // Save Routine Answers if provided
    if (Array.isArray(routineAnswers)) {
      await RoutineAnswer.destroy({ where: { user_id: userId } });
      const routineRecords = routineAnswers
        .filter(r => r && r.trim() !== '')
        .map(r => ({ user_id: userId, answer: r.trim() }));
      if (routineRecords.length > 0) {
        await RoutineAnswer.bulkCreate(routineRecords);
      }
    }

    // Save Medical History if provided
    if (medicalHistory && typeof medicalHistory === 'object') {
      if (Array.isArray(medicalHistory)) {
        await MedicalHistory.destroy({ where: { user_id: userId } });
        const historyRecords = medicalHistory.map(item => ({
          user_id: userId,
          field: item.field || 'general',
          value: item.value || ''
        }));
        if (historyRecords.length > 0) {
          await MedicalHistory.bulkCreate(historyRecords);
        }
      } else {
        // Key-value object
        for (const [field, value] of Object.entries(medicalHistory)) {
          if (value !== undefined && value !== null) {
            const existing = await MedicalHistory.findOne({ where: { user_id: userId, field } });
            if (existing) {
              await existing.update({ value: String(value) });
            } else {
              await MedicalHistory.create({ user_id: userId, field, value: String(value) });
            }
          }
        }
      }
    }

    // Fetch updated user state
    const updatedUser = await User.findByPk(userId, {
      include: [
        { model: Condition, as: 'conditions' },
        { model: Allergy, as: 'allergies' },
        { model: RoutineAnswer, as: 'routine_answers' },
        { model: MedicalHistory, as: 'medical_history' },
        { model: StreakLog, as: 'streak_log' }
      ]
    });

    return res.status(200).json({
      message: 'Onboarding data saved successfully',
      step: step || 'updated',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        weight: updatedUser.weight,
        height: updatedUser.height,
        gender: updatedUser.gender,
        diet_type: updatedUser.diet_type,
        conditions: (updatedUser.conditions || []).map(c => c.condition_name),
        allergies: (updatedUser.allergies || []).map(a => a.allergy_name),
        routineAnswers: (updatedUser.routine_answers || []).map(r => r.answer),
        medicalHistory: (updatedUser.medical_history || []).map(m => ({ field: m.field, value: m.value })),
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
