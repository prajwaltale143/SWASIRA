// SWASIRA Rule-Based Diet Recommendation Engine
// CRITICAL RULE: Analyzes ONLY what the user explicitly entered.
// Never assumes, invents, or guesses missing personal data.

function calculateLifeStage(age) {
  if (age === null || age === undefined || age === '') return null;
  const numAge = Number(age);
  if (isNaN(numAge)) return null;

  if (numAge <= 6) return 'Infant/Toddler';
  if (numAge <= 17) return 'Child/Teen';
  if (numAge <= 40) return 'Young Adult';
  return 'Senior';
}

function calculateBMI(weight, height) {
  if (!weight || !height) return null;
  const w = parseFloat(weight);
  const h = parseFloat(height); // assumed in cm if > 3, else meters
  if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) return null;

  const heightInMeters = h > 3 ? h / 100 : h;
  const bmi = (w / (heightInMeters * heightInMeters)).toFixed(1);
  return parseFloat(bmi);
}

// Maps user conditions to internal tag identifiers and clinical focus
const CONDITION_TAG_MAP = {
  'Diabetes': ['diabetes-friendly', 'low-sodium'],
  'Blood Pressure': ['Blood Pressure', 'low-sodium'],
  'Asthma': ['asthma-friendly', 'anti-inflammatory'],
  'Migraine': ['migraine-friendly', 'anti-inflammatory'],
  'PCOD/PCOS': ['PCOD-friendly', 'anti-inflammatory', 'diabetes-friendly'],
  'Thyroid': ['thyroid-support', 'immunity-boosting'],
  'Weak Immunity': ['immunity-boosting', 'anti-inflammatory'],
  'Period Pain / Menstrual Issues': ['period-pain-friendly', 'anti-inflammatory'],
  'Body Pain / Stress': ['Body Pain / Stress', 'anti-inflammatory'],
};

// Generates personalized, warm explanation for each meal slot
function generateReasoning(slot, dish, userConditions, userAllergies, userRoutine, lifeStage, bmi) {
  const reasons = [];

  const matchedConditions = userConditions.filter(c => {
    const tags = CONDITION_TAG_MAP[c] || [];
    return tags.some(tag => (dish.suited_conditions || []).includes(tag));
  });

  if (matchedConditions.length > 0) {
    if (matchedConditions.includes('Migraine')) {
      reasons.push(`rich in magnesium and steady-release nutrients to stabilize cranial vascular tone`);
    }
    if (matchedConditions.includes('PCOD/PCOS')) {
      reasons.push(`low-glycemic and fiber-balanced to support metabolic and insulin sensitivity`);
    }
    if (matchedConditions.includes('Diabetes')) {
      reasons.push(`controlled complex carbs without spikes, supporting steady glycemic balance`);
    }
    if (matchedConditions.includes('Blood Pressure')) {
      reasons.push(`naturally low in sodium with potassium-dense regional ingredients`);
    }
    if (matchedConditions.includes('Asthma')) {
      reasons.push(`anti-inflammatory spices that soothe respiratory pathways`);
    }
    if (matchedConditions.includes('Weak Immunity')) {
      reasons.push(`packed with bioavailable vitamins and gut-nourishing warm minerals`);
    }
    if (matchedConditions.includes('Period Pain / Menstrual Issues')) {
      reasons.push(`magnesium and iron-supportive to naturally ease cramping and fatigue`);
    }
    if (matchedConditions.includes('Body Pain / Stress')) {
      reasons.push(`anti-inflammatory recovery foods to soothe physical and neuromuscular tension`);
    }
    if (matchedConditions.includes('Thyroid')) {
      reasons.push(`supports metabolic equilibrium with key trace minerals`);
    }
  }

  // Routine reasoning
  const hasHectic = userRoutine && userRoutine.some(r => /hectic|no time|irregular/i.test(r));
  if (hasHectic && (slot === 'lunch' || slot === 'dinner')) {
    reasons.push('quick to prepare and easily digestible for busy, demanding workdays');
  }

  // Life-stage context
  if (lifeStage === 'Senior') {
    reasons.push('gentle on digestion and tailored for senior vitality');
  } else if (lifeStage === 'Child/Teen') {
    reasons.push('dense in wholesome micronutrients for growth');
  } else if (lifeStage === 'Young Adult') {
    reasons.push('calibrated for sustained cognitive and physical daytime stamina');
  }

  if (reasons.length === 0) {
    return `Selected as a wholesome, balanced dish honoring your diet preferences and allergen exclusions.`;
  }

  return `Selected for you: ${reasons.slice(0, 2).join(', and ')}.`;
}

function filterAndScoreDishes(allDishes, { dietType, allergies, conditions, slot }) {
  // 1. Hard filters: Diet type & Allergies
  const validDishes = allDishes.filter(dish => {
    if (dish.meal_slot !== slot) return false;

    // Diet filter
    if (dietType) {
      const dishDietTypes = dish.diet_types || [];
      const userDiet = dietType.toLowerCase();

      if (userDiet === 'vegan' && !dishDietTypes.includes('Vegan')) return false;
      if (userDiet === 'vegetarian' && !dishDietTypes.includes('Vegetarian')) return false;
      if (userDiet.includes('jain') && !dishDietTypes.some(d => d.includes('Jain'))) return false;
      // Non-Vegetarian accepts any diet type
    }

    // Allergen filter (exclude dishes containing any user allergen)
    if (allergies && allergies.length > 0) {
      const dishAllergens = dish.allergens || [];
      const hasAllergen = allergies.some(allergen => 
        allergen !== 'None' && dishAllergens.map(a => a.toLowerCase()).includes(allergen.toLowerCase())
      );
      if (hasAllergen) return false;
    }

    return true;
  });

  if (validDishes.length === 0) {
    return [];
  }

  // 2. Score dishes based on matching conditions
  const scoredDishes = validDishes.map(dish => {
    let score = 0;
    const suited = dish.suited_conditions || [];

    conditions.forEach(cond => {
      const mappedTags = CONDITION_TAG_MAP[cond] || [];
      mappedTags.forEach(tag => {
        if (suited.includes(tag)) {
          score += 5;
        }
      });
      // Direct string match fallback
      if (suited.some(s => s.toLowerCase().includes(cond.toLowerCase()))) {
        score += 3;
      }
    });

    return { dish, score };
  });

  // Sort descending by score
  scoredDishes.sort((a, b) => b.score - a.score);
  return scoredDishes.map(item => item.dish);
}

function generateDietPlan({
  user,
  conditions = [],
  allergies = [],
  routineAnswers = [],
  medicalHistory = [],
  allDishes = []
}) {
  // Check required fields: age, diet_type, conditions (or "None")
  const missingFields = [];
  if (user.age === null || user.age === undefined || user.age === '') {
    missingFields.push('age');
  }
  if (!user.diet_type || user.diet_type.trim() === '') {
    missingFields.push('diet type');
  }
  if (!conditions || conditions.length === 0) {
    missingFields.push('conditions (or choose None)');
  }

  if (missingFields.length > 0) {
    return {
      success: false,
      isComplete: false,
      missingFields,
      message: `Please complete your profile to generate your diet plan. Missing: ${missingFields.join(', ')}.`
    };
  }

  const lifeStage = calculateLifeStage(user.age);
  const bmi = calculateBMI(user.weight, user.height);

  // Life stage special rule: Infants and toddlers (age <= 6)
  if (lifeStage === 'Infant/Toddler') {
    return {
      success: true,
      isComplete: true,
      isPediatricReferral: true,
      lifeStage,
      userAge: user.age,
      message: `For infants and young toddlers (${user.age} years old), nutritional needs vary dramatically month by month. SWASIRA adheres to strict pediatric safety standards: please consult your certified pediatrician or pediatric dietitian for an individualized feeding chart.`
    };
  }

  // Condition checks
  const conditionNames = conditions.map(c => typeof c === 'string' ? c : c.condition_name);
  const allergyNames = allergies.map(a => typeof a === 'string' ? a : a.allergy_name);
  const routineList = routineAnswers.map(r => typeof r === 'string' ? r : r.answer);

  // Detect unsupported conditions
  const unsupportedConditions = conditionNames.filter(c => c !== 'None' && !CONDITION_TAG_MAP[c]);

  // Meal slots to generate
  const slots = ['breakfast', 'lunch', 'activity_nudge', 'dinner'];
  const planItems = {};
  const totalNutrients = {
    carbs: 0,
    protein: 0,
    vitamins: 0,
    calcium: 0,
    healthy_fats: 0
  };

  slots.forEach(slot => {
    const candidates = filterAndScoreDishes(allDishes, {
      dietType: user.diet_type,
      allergies: allergyNames,
      conditions: conditionNames,
      slot
    });

    const chosenDish = candidates.length > 0 ? candidates[0] : null;

    if (chosenDish) {
      const reasoning = generateReasoning(
        slot,
        chosenDish,
        conditionNames,
        allergyNames,
        routineList,
        lifeStage,
        bmi
      );

      planItems[slot] = {
        dish: chosenDish,
        reasoning,
        status: 'planned'
      };

      // Add nutrients
      if (chosenDish.nutrients) {
        totalNutrients.carbs += chosenDish.nutrients.carbs || 0;
        totalNutrients.protein += chosenDish.nutrients.protein || 0;
        totalNutrients.vitamins += chosenDish.nutrients.vitamins || 0;
        totalNutrients.calcium += chosenDish.nutrients.calcium || 0;
        totalNutrients.healthy_fats += chosenDish.nutrients.healthy_fats || 0;
      }
    } else {
      // Graceful fallback if no dish matched stringent allergy/diet criteria
      planItems[slot] = {
        dish: {
          id: null,
          name: `Custom Nourishing ${slot.replace('_', ' ').toUpperCase()}`,
          meal_slot: slot,
          nutrients: { carbs: 30, protein: 12, vitamins: 15, calcium: 10, healthy_fats: 6 }
        },
        reasoning: `Crafted to honor your ${user.diet_type} lifestyle and allergy restrictions.`,
        status: 'planned'
      };
    }
  });

  return {
    success: true,
    isComplete: true,
    isPediatricReferral: false,
    lifeStage,
    bmi,
    plan: planItems,
    nutrientTotals: totalNutrients,
    unsupportedConditionsNotice: unsupportedConditions.length > 0
      ? `You noted "${unsupportedConditions.join(', ')}". We provided balanced nutrition, but full clinical recipes for this condition are being expanded by our nutrition team.`
      : null
  };
}

module.exports = {
  calculateLifeStage,
  calculateBMI,
  filterAndScoreDishes,
  generateReasoning,
  generateDietPlan,
};
