const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StreakLog = sequelize.define('StreakLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
  current_streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  flex_passes_remaining: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  last_active_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'streak_logs',
  timestamps: false,
});

module.exports = StreakLog;
