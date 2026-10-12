const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dish = sequelize.define('Dish', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meal_slot: {
    type: DataTypes.STRING,
    allowNull: false, // breakfast, lunch, dinner, snack, activity_nudge
  },
  diet_types: {
    type: DataTypes.JSON,
    allowNull: false, // e.g. ["Vegetarian", "Vegan", "Jain-friendly", "Non-Vegetarian"]
  },
  allergens: {
    type: DataTypes.JSON,
    defaultValue: [], // e.g. ["Nuts", "Dairy", "Gluten", "Shellfish", "Soy", "Eggs"]
  },
  nutrients: {
    type: DataTypes.JSON,
    defaultValue: {}, // e.g. { carbs: 40, protein: 15, vitamins: 20, calcium: 15, healthy_fats: 10 }
  },
  suited_conditions: {
    type: DataTypes.JSON,
    defaultValue: [], // e.g. ["migraine-friendly", "immunity-boosting", "diabetes-friendly", ...]
  },
}, {
  tableName: 'dishes',
  timestamps: false,
});

module.exports = Dish;
