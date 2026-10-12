// Seed data: At least 30 authentic homemade Indian dishes + activity nudges
// Only food data is seeded. Absolutely NO user data is ever seeded.

const dishes = [
  // --- BREAKFAST ---
  {
    name: "Moong Dal Cheela with Mint Coriander Chutney",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 32, protein: 16, vitamins: 18, calcium: 12, healthy_fats: 6 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "anti-inflammatory", "low-sodium", "period-pain-friendly"]
  },
  {
    name: "Rolled Oats Upma with Carrots & Curry Leaves",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Gluten"],
    nutrients: { carbs: 38, protein: 9, vitamins: 20, calcium: 8, healthy_fats: 7 },
    suited_conditions: ["diabetes-friendly", "Blood Pressure", "migraine-friendly", "anti-inflammatory"]
  },
  {
    name: "Spinach & Flaxseed Poha with Roasted Peanuts",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Nuts"],
    nutrients: { carbs: 40, protein: 8, vitamins: 22, calcium: 14, healthy_fats: 10 },
    suited_conditions: ["period-pain-friendly", "migraine-friendly", "anti-inflammatory", "thyroid-support"]
  },
  {
    name: "Steamed Ragi & Urad Idli with Coconut Chutney",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 36, protein: 11, vitamins: 15, calcium: 24, healthy_fats: 5 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "immunity-boosting", "period-pain-friendly"]
  },
  {
    name: "Boiled Eggs with Turmeric Pepper Dust & Multigrain Toast",
    meal_slot: "breakfast",
    diet_types: ["Non-Vegetarian", "Eggetarian/Jain-friendly"],
    allergens: ["Eggs", "Gluten"],
    nutrients: { carbs: 22, protein: 18, vitamins: 16, calcium: 10, healthy_fats: 12 },
    suited_conditions: ["immunity-boosting", "asthma-friendly", "thyroid-support", "PCOD-friendly"]
  },
  {
    name: "Sprouted Green Moong & Methi Salad with Lemon Zest",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 28, protein: 15, vitamins: 30, calcium: 14, healthy_fats: 4 },
    suited_conditions: ["diabetes-friendly", "immunity-boosting", "PCOD-friendly", "low-sodium"]
  },
  {
    name: "Besan Cheela with Grated Paneer & Carom Seeds (Ajwain)",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Dairy"],
    nutrients: { carbs: 26, protein: 17, vitamins: 14, calcium: 22, healthy_fats: 11 },
    suited_conditions: ["PCOD-friendly", "diabetes-friendly", "anti-inflammatory", "migraine-friendly"]
  },
  {
    name: "Warm Almond Spiced Porridge with Chia Seeds",
    meal_slot: "breakfast",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Nuts"],
    nutrients: { carbs: 34, protein: 10, vitamins: 20, calcium: 18, healthy_fats: 14 },
    suited_conditions: ["migraine-friendly", "Body Pain / Stress", "immunity-boosting"]
  },

  // --- LUNCH ---
  {
    name: "Palak (Spinach) Dal with Brown Rice & Cucumber Raita",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Dairy"],
    nutrients: { carbs: 48, protein: 18, vitamins: 28, calcium: 20, healthy_fats: 8 },
    suited_conditions: ["period-pain-friendly", "Blood Pressure", "migraine-friendly", "anti-inflammatory"]
  },
  {
    name: "Vegan Yellow Moong Dal with Quinoa & Steamed French Beans",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 44, protein: 16, vitamins: 22, calcium: 12, healthy_fats: 6 },
    suited_conditions: ["diabetes-friendly", "Blood Pressure", "asthma-friendly", "low-sodium"]
  },
  {
    name: "Grilled Herb Chicken Breast with Steamed Brown Rice & Veggies",
    meal_slot: "lunch",
    diet_types: ["Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 35, protein: 32, vitamins: 18, calcium: 8, healthy_fats: 10 },
    suited_conditions: ["immunity-boosting", "thyroid-support", "PCOD-friendly", "anti-inflammatory"]
  },
  {
    name: "Methi Thepla with Ginger Curd & Stir-Fried Ivy Gourd (Tindora)",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Gluten", "Dairy"],
    nutrients: { carbs: 42, protein: 13, vitamins: 20, calcium: 18, healthy_fats: 9 },
    suited_conditions: ["diabetes-friendly", "migraine-friendly", "Body Pain / Stress"]
  },
  {
    name: "Chole (Chickpea Stew) with Jeera Red Rice & Onion Salad",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Vegan", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 54, protein: 19, vitamins: 16, calcium: 14, healthy_fats: 7 },
    suited_conditions: ["PCOD-friendly", "period-pain-friendly", "anti-inflammatory"]
  },
  {
    name: "Sambar with Foxtail Millet & Ash Gourd (Petha) Kootu",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 46, protein: 14, vitamins: 26, calcium: 16, healthy_fats: 5 },
    suited_conditions: ["Blood Pressure", "diabetes-friendly", "low-sodium", "migraine-friendly"]
  },
  {
    name: "Steamed Rohu Fish Curry with Turmeric & Steamed Rice",
    meal_slot: "lunch",
    diet_types: ["Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 36, protein: 28, vitamins: 20, calcium: 14, healthy_fats: 11 },
    suited_conditions: ["asthma-friendly", "anti-inflammatory", "Body Pain / Stress", "immunity-boosting"]
  },
  {
    name: "Tofu Palak with Jowar (Sorghum) Roti & Tomato Relish",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Soy"],
    nutrients: { carbs: 38, protein: 20, vitamins: 25, calcium: 26, healthy_fats: 8 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "period-pain-friendly"]
  },
  {
    name: "Kadhi Pakora (Low-oil) with Millet Khichdi",
    meal_slot: "lunch",
    diet_types: ["Vegetarian", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Dairy"],
    nutrients: { carbs: 44, protein: 13, vitamins: 15, calcium: 18, healthy_fats: 9 },
    suited_conditions: ["immunity-boosting", "anti-inflammatory", "Body Pain / Stress"]
  },

  // --- DINNER ---
  {
    name: "Warm Moong Dal Khichdi with Roasted Cumin & Steamed Carrots",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 42, protein: 14, vitamins: 22, calcium: 10, healthy_fats: 6 },
    suited_conditions: ["migraine-friendly", "immunity-boosting", "Blood Pressure", "Body Pain / Stress", "asthma-friendly"]
  },
  {
    name: "Lauki (Bottle Gourd) & Tomato Soup with Toasted Pumpkin Seeds",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 24, protein: 9, vitamins: 26, calcium: 12, healthy_fats: 7 },
    suited_conditions: ["Blood Pressure", "diabetes-friendly", "low-sodium", "migraine-friendly"]
  },
  {
    name: "Paneer Bhurji with 2 Jowar Rotis & Warm Clear Soup",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Dairy"],
    nutrients: { carbs: 34, protein: 22, vitamins: 16, calcium: 28, healthy_fats: 12 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "period-pain-friendly", "thyroid-support"]
  },
  {
    name: "Baked Salmon or Pomfret with Ginger, Garlic & Steamed Cauliflower",
    meal_slot: "dinner",
    diet_types: ["Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 12, protein: 30, vitamins: 18, calcium: 14, healthy_fats: 15 },
    suited_conditions: ["asthma-friendly", "anti-inflammatory", "Body Pain / Stress", "migraine-friendly"]
  },
  {
    name: "Egg Curry (Mild Gravy) with Multigrain Phulka",
    meal_slot: "dinner",
    diet_types: ["Non-Vegetarian", "Eggetarian/Jain-friendly"],
    allergens: ["Eggs", "Gluten"],
    nutrients: { carbs: 32, protein: 19, vitamins: 16, calcium: 12, healthy_fats: 10 },
    suited_conditions: ["immunity-boosting", "thyroid-support", "Body Pain / Stress"]
  },
  {
    name: "Pumpkin & Coconut Milk Curry with Steamed Barnyard Millet",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 38, protein: 8, vitamins: 28, calcium: 14, healthy_fats: 11 },
    suited_conditions: ["Blood Pressure", "migraine-friendly", "anti-inflammatory", "low-sodium"]
  },
  {
    name: "Stir-Fried Beans & Tofu with Cumin & Amaranth Roti",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Soy"],
    nutrients: { carbs: 30, protein: 19, vitamins: 22, calcium: 24, healthy_fats: 8 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "period-pain-friendly"]
  },
  {
    name: "Masoor Dal (Brown Lentil) Soup with Sautéed Zucchini & Jeera",
    meal_slot: "dinner",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 32, protein: 15, vitamins: 24, calcium: 11, healthy_fats: 5 },
    suited_conditions: ["immunity-boosting", "asthma-friendly", "Blood Pressure", "Body Pain / Stress"]
  },

  // --- SNACKS / REPLACEMENTS ---
  {
    name: "Roasted Makhana (Fox Nuts) with Turmeric & Himalayan Pink Salt",
    meal_slot: "snack",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 22, protein: 5, vitamins: 10, calcium: 12, healthy_fats: 3 },
    suited_conditions: ["Blood Pressure", "diabetes-friendly", "migraine-friendly", "Body Pain / Stress"]
  },
  {
    name: "Soaked Walnuts & Dried Black Raisins",
    meal_slot: "snack",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Nuts"],
    nutrients: { carbs: 18, protein: 6, vitamins: 12, calcium: 8, healthy_fats: 16 },
    suited_conditions: ["migraine-friendly", "Body Pain / Stress", "period-pain-friendly", "immunity-boosting"]
  },
  {
    name: "Golden Turmeric Ashwagandha Almond Milk (or Warm Oat Milk)",
    meal_slot: "snack",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: ["Nuts"],
    nutrients: { carbs: 14, protein: 5, vitamins: 16, calcium: 20, healthy_fats: 7 },
    suited_conditions: ["anti-inflammatory", "Body Pain / Stress", "immunity-boosting", "period-pain-friendly"]
  },

  // --- ACTIVITY NUDGES ---
  {
    name: "Gentle Anulom Vilom Pranayama (10 mins) & Warm Water Hydration",
    meal_slot: "activity_nudge",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 0, protein: 0, vitamins: 0, calcium: 0, healthy_fats: 0 },
    suited_conditions: ["asthma-friendly", "Blood Pressure", "migraine-friendly", "Body Pain / Stress"]
  },
  {
    name: "Brisk 15-Minute Sunlight Walk & Spinal Stretches",
    meal_slot: "activity_nudge",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 0, protein: 0, vitamins: 0, calcium: 0, healthy_fats: 0 },
    suited_conditions: ["diabetes-friendly", "PCOD-friendly", "immunity-boosting", "thyroid-support"]
  },
  {
    name: "Post-Meal 1000 Steps Stroll (Shatapawali) & Pelvic Relaxation",
    meal_slot: "activity_nudge",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 0, protein: 0, vitamins: 0, calcium: 0, healthy_fats: 0 },
    suited_conditions: ["period-pain-friendly", "diabetes-friendly", "Body Pain / Stress"]
  },
  {
    name: "Deep Diaphragmatic Breathing & Neck Mobility Release",
    meal_slot: "activity_nudge",
    diet_types: ["Vegetarian", "Vegan", "Jain-friendly", "Eggetarian/Jain-friendly", "Non-Vegetarian"],
    allergens: [],
    nutrients: { carbs: 0, protein: 0, vitamins: 0, calcium: 0, healthy_fats: 0 },
    suited_conditions: ["migraine-friendly", "Body Pain / Stress", "asthma-friendly", "Blood Pressure"]
  }
];

async function seedDishes(DishModel) {
  const count = await DishModel.count();
  if (count === 0) {
    console.log(`[SEED] Seeding ${dishes.length} homemade Indian dishes into database...`);
    await DishModel.bulkCreate(dishes);
    console.log(`[SEED] Successfully seeded ${dishes.length} dishes.`);
  } else {
    console.log(`[SEED] Dishes table already contains ${count} records. Skipping seed.`);
  }
}

module.exports = {
  dishes,
  seedDishes,
};
