const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    dialectOptions: {
      ssl: process.env.DATABASE_URL.includes('sslmode=require') ? { require: true, rejectUnauthorized: false } : false
    }
  });
} else {
  const dbPath = path.join(__dirname, '..', 'swasira.sqlite');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false, // Keep console clean for Windows beginner users
  });
}

module.exports = sequelize;
