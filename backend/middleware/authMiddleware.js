const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'swasira_super_secret_jwt_key_2026_nutrition_health_secure';

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Malformed authorization header' });
    }

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Session expired or invalid token' });
      }

      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User account not found' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Authentication processing failed' });
  }
}

module.exports = authenticateToken;
