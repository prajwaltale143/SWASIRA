const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalHistory = sequelize.define('MedicalHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  field: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'medical_history',
  timestamps: false,
});

module.exports = MedicalHistory;
