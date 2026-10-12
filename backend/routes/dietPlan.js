const express = require('express');
const router = express.Router();
const { User, Condition, Allergy, RoutineAnswer, MedicalHistory, Dish, DietPlan, StreakLog } = require('../models');
const { generateDietPlan, filterAndScoreDishes, generateReasoning, calculateLifeStage, calculateBMI } = require('../services/recommendationEngine');

// Format date YYYY-MM-DD
function getTodayString() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

// GET /api/diet-plan/:userId
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByPk(userId, {
      include: [
        { model: Condition, as: 'conditions' },
        { model: Allergy, as: 'allergies' },
        { model: RoutineAnswer, as: 'routine_answers' },
        { model: MedicalHistory, as: 'medical_history' },
        { model: StreakLog, as: 'streak_log' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const allDishes = await Dish.findAll();
    const result = generateDietPlan({
      user,
      conditions: user.conditions || [],
      allergies: user.allergies || [],
      routineAnswers: user.routine_answers || [],
      medicalHistory: user.medical_history || [],
      allDishes
    });

    if (!result.isComplete) {
      return res.status(200).json({
        isComplete: false,
        missingFields: result.missingFields,
        message: result.message,
        userSummary: {
          name: user.name,
          age: user.age,
          diet_type: user.diet_type,
          conditions: (user.conditions || []).map(c => c.condition_name),
          allergies: (user.allergies || []).map(a => a.allergy_name),
        }
      });
    }

    if (result.isPediatricReferral) {
      return res.status(200).json({
        isComplete: true,
        isPediatricReferral: true,
        lifeStage: result.lifeStage,
        userAge: result.userAge,
        message: result.message,
      });
    }

    const today = getTodayString();

    // Persist or retrieve current day's plan in DietPlan table
    const slots = ['breakfast', 'lunch', 'activity_nudge', 'dinner'];
    for (const slot of slots) {
      const planItem = result.plan[slot];
      if (planItem && planItem.dish) {
        const existingRecord = await DietPlan.findOne({
          where: { user_id: userId, date: today, meal_slot: slot }
        });

        if (!existingRecord) {
          await DietPlan.create({
            user_id: userId,
            date: today,
            meal_slot: slot,
            dish_id: planItem.dish.id,
            dish_name: planItem.dish.name,
            reasoning: planItem.reasoning,
            status: 'planned'
          });
        } else {
          // Keep persistent status (done / flipped)
          planItem.status = existingRecord.status;
          planItem.reasoning = existingRecord.reasoning;
          if (existingRecord.dish_id && existingRecord.dish_id !== planItem.dish.id) {
            const swappedDish = await Dish.findByPk(existingRecord.dish_id);
            if (swappedDish) planItem.dish = swappedDish;
          }
        }
      }
    }

    return res.status(200).json({
      isComplete: true,
      isPediatricReferral: false,
      lifeStage: result.lifeStage,
      bmi: result.bmi,
      userSummary: {
        id: user.id,
        name: user.name,
        age: user.age,
        diet_type: user.diet_type,
        conditions: (user.conditions || []).map(c => c.condition_name),
        allergies: (user.allergies || []).map(a => a.allergy_name),
        streak: user.streak_log ? user.streak_log.current_streak : 0,
        flexPasses: user.streak_log ? user.streak_log.flex_passes_remaining : 2,
      },
      plan: result.plan,
      nutrientTotals: result.nutrientTotals,
      unsupportedConditionsNotice: result.unsupportedConditionsNotice,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/diet-plan/:userId/swap
router.post('/:userId/swap', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { mealSlot, currentDishId } = req.body;

    if (!mealSlot) {
      return res.status(400).json({ error: 'Please specify the meal slot to swap.' });
    }

    const user = await User.findByPk(userId, {
      include: [
        { model: Condition, as: 'conditions' },
        { model: Allergy, as: 'allergies' },
        { model: RoutineAnswer, as: 'routine_answers' },
        { model: StreakLog, as: 'streak_log' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Check streak log & flex passes
    let streakLog = user.streak_log;
    if (!streakLog) {
      streakLog = await StreakLog.create({
        user_id: userId,
        current_streak: 0,
        flex_passes_remaining: 2,
        last_active_date: null
      });
    }

    if (streakLog.flex_passes_remaining <= 0) {
      return res.status(400).json({
        error: 'No Flex Passes remaining this week. They will reset next week — your streak remains safe!',
        flexPassesRemaining: 0,
      });
    }

    // Find alternative dish that fits diet type and allergens, excluding currentDishId
    const allDishes = await Dish.findAll();
    const conditionNames = (user.conditions || []).map(c => c.condition_name);
    const allergyNames = (user.allergies || []).map(a => a.allergy_name);

    const candidates = filterAndScoreDishes(allDishes, {
      dietType: user.diet_type,
      allergies: allergyNames,
      conditions: conditionNames,
      slot: mealSlot
    }).filter(d => !currentDishId || d.id !== parseInt(currentDishId, 10));

    if (candidates.length === 0) {
      return res.status(404).json({
        error: `No alternative dish found matching your ${user.diet_type} diet and allergy restrictions.`
      });
    }

    // Deduct 1 Flex Pass
    streakLog.flex_passes_remaining -= 1;
    await streakLog.save();

    const newDish = candidates[0];
    const lifeStage = calculateLifeStage(user.age);
    const bmi = calculateBMI(user.weight, user.height);
    const reasoning = generateReasoning(
      mealSlot,
      newDish,
      conditionNames,
      allergyNames,
      (user.routine_answers || []).map(r => r.answer),
      lifeStage,
      bmi
    );

    const today = getTodayString();
    const existingPlan = await DietPlan.findOne({
      where: { user_id: userId, date: today, meal_slot: mealSlot }
    });

    if (existingPlan) {
      await existingPlan.update({
        dish_id: newDish.id,
        dish_name: newDish.name,
        reasoning: `${reasoning} (Swapped via Flex Pass)`,
        status: 'flipped'
      });
    } else {
      await DietPlan.create({
        user_id: userId,
        date: today,
        meal_slot: mealSlot,
        dish_id: newDish.id,
        dish_name: newDish.name,
        reasoning: `${reasoning} (Swapped via Flex Pass)`,
        status: 'flipped'
      });
    }

    return res.status(200).json({
      message: 'Meal swapped successfully using 1 Flex Pass.',
      flexPassesRemaining: streakLog.flex_passes_remaining,
      slot: mealSlot,
      newDish,
      reasoning: `${reasoning} (Swapped via Flex Pass)`,
      status: 'flipped'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/diet-plan/:userId/action (Mark Done)
router.post('/:userId/action', async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const { mealSlot, action } = req.body; // action: 'done'

    const today = getTodayString();
    const planItem = await DietPlan.findOne({
      where: { user_id: userId, date: today, meal_slot: mealSlot }
    });

    if (planItem) {
      await planItem.update({ status: action || 'done' });
    }

    // Update streak if today was not already counted
    const streakLog = await StreakLog.findOne({ where: { user_id: userId } });
    if (streakLog) {
      if (streakLog.last_active_date !== today) {
        streakLog.current_streak += 1;
        streakLog.last_active_date = today;
        await streakLog.save();
      }
    }

    return res.status(200).json({
      message: `Meal marked as ${action || 'done'}. Well done!`,
      currentStreak: streakLog ? streakLog.current_streak : 1,
      status: action || 'done'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
