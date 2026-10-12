const express = require('express');
const router = express.Router();
const { User, Condition, Allergy, MedicalHistory } = require('../models');
const { processChatMessage, getPersonalizedQuestions } = require('../services/aiService');

// POST /api/chat/init - Start the intake conversation
router.post('/init', async (req, res, next) => {
  try {
    const { userId, conditions = [], allergies = [] } = req.body;

    let userConditions = conditions;
    let userAllergies = allergies;

    if (userId && (!userConditions.length || !userAllergies.length)) {
      const user = await User.findByPk(userId, {
        include: [
          { model: Condition, as: 'conditions' },
          { model: Allergy, as: 'allergies' }
        ]
      });
      if (user) {
        if (!userConditions.length) userConditions = (user.conditions || []).map(c => c.condition_name);
        if (!userAllergies.length) userAllergies = (user.allergies || []).map(a => a.allergy_name);
      }
    }

    const questions = getPersonalizedQuestions(userConditions, userAllergies);

    return res.status(200).json({
      greeting: `Hello! I am your SWASIRA health intake companion. Based on the conditions you selected, I have just ${questions.length} gentle follow-up questions to tailor your daily nutrition.`,
      firstQuestion: questions[0] || 'How would you describe your overall daily energy levels?',
      totalQuestions: questions.length,
      questions
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/chat - Process message exchange
router.post('/', async (req, res, next) => {
  try {
    const { userId, message, history = [], conditions = [], allergies = [] } = req.body;

    let userConditions = conditions;
    let userAllergies = allergies;

    if (userId && (!userConditions.length || !userAllergies.length)) {
      const user = await User.findByPk(userId, {
        include: [
          { model: Condition, as: 'conditions' },
          { model: Allergy, as: 'allergies' }
        ]
      });
      if (user) {
        if (!userConditions.length) userConditions = (user.conditions || []).map(c => c.condition_name);
        if (!userAllergies.length) userAllergies = (user.allergies || []).map(a => a.allergy_name);
      }
    }

    const result = await processChatMessage({
      conditions: userConditions,
      allergies: userAllergies,
      history,
      currentMessage: message,
    });

    // If intake complete and userId is present, save structured notes into MedicalHistory
    if (result.isComplete && userId) {
      await MedicalHistory.create({
        user_id: userId,
        field: 'ai_intake_summary',
        value: `User answers: ${message}`
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
