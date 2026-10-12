const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Condition = sequelize.define('Condition', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  condition_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'conditions',
  timestamps: false,
});

module.exports = Condition;
