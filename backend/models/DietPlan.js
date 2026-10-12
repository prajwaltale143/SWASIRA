const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DietPlan = sequelize.define('DietPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  meal_slot: {
    type: DataTypes.STRING,
    allowNull: false, // breakfast, lunch, activity_nudge, dinner
  },
  dish_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  dish_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reasoning: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'planned', // planned, done, flipped
  },
}, {
  tableName: 'diet_plans',
  timestamps: false,
});

module.exports = DietPlan;
