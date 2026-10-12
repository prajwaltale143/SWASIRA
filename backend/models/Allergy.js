const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Allergy = sequelize.define('Allergy', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  allergy_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'allergies',
  timestamps: false,
});

module.exports = Allergy;
