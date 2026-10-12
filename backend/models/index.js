const sequelize = require('../config/database');
const User = require('./User');
const Condition = require('./Condition');
const Allergy = require('./Allergy');
const RoutineAnswer = require('./RoutineAnswer');
const MedicalHistory = require('./MedicalHistory');
const Dish = require('./Dish');
const DietPlan = require('./DietPlan');
const StreakLog = require('./StreakLog');

// Define relationships
User.hasMany(Condition, { foreignKey: 'user_id', as: 'conditions', onDelete: 'CASCADE' });
Condition.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Allergy, { foreignKey: 'user_id', as: 'allergies', onDelete: 'CASCADE' });
Allergy.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RoutineAnswer, { foreignKey: 'user_id', as: 'routine_answers', onDelete: 'CASCADE' });
RoutineAnswer.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(MedicalHistory, { foreignKey: 'user_id', as: 'medical_history', onDelete: 'CASCADE' });
MedicalHistory.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(DietPlan, { foreignKey: 'user_id', as: 'diet_plans', onDelete: 'CASCADE' });
DietPlan.belongsTo(User, { foreignKey: 'user_id' });

DietPlan.belongsTo(Dish, { foreignKey: 'dish_id', as: 'dish' });

User.hasOne(StreakLog, { foreignKey: 'user_id', as: 'streak_log', onDelete: 'CASCADE' });
StreakLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Condition,
  Allergy,
  RoutineAnswer,
  MedicalHistory,
  Dish,
  DietPlan,
  StreakLog,
};
