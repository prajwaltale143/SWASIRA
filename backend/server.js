const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, Dish } = require('./models');
const { seedDishes } = require('./seed/seedDishes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const onboardingRoutes = require('./routes/onboarding');
const dietPlanRoutes = require('./routes/dietPlan');
const streakRoutes = require('./routes/streak');
const chatRoutes = require('./routes/chat');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check endpoint (Rule 6)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SWASIRA Backend API'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/diet-plan', dietPlanRoutes);
app.use('/api/streak', streakRoutes);
app.use('/api/chat', chatRoutes);

// JSON 404 handler
app.use(notFoundHandler);

// Global JSON error handler
app.use(errorHandler);

const PORT = parseInt(process.env.PORT, 10) || 5000;

async function startServer() {
  try {
    // Connect & Sync database models (Rule 2)
    await sequelize.authenticate();
    console.log('[DB] Connected to SQLite database.');

    await sequelize.sync();
    console.log('[DB] Database models synchronized.');

    // Seed dishes ONLY if empty (Rule 2)
    await seedDishes(Dish);

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🌿 SWASIRA Backend is running on http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });

    // Graceful port conflict handling (Rule 3)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ [PORT IN USE] Port ${PORT} is currently occupied by another process.`);
        console.error(`Please stop the process using port ${PORT} and try again.`);
        console.error(`To find and stop it on Windows PowerShell, run:`);
        console.error(`  Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process\n`);
        process.exit(1);
      } else {
        console.error('[ERROR] Failed to start server:', err.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('[DB FATAL] Failed to connect or initialize database:', error.message);
    process.exit(1);
  }
}

startServer();
