const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RoutineAnswer = sequelize.define('RoutineAnswer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'routine_answers',
  timestamps: false,
});

module.exports = RoutineAnswer;
