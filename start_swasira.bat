@echo off
title SWASIRA — Health & Nutrition Platform
color 0B

echo =================================================================
echo   SWASIRA — Personalized Life-Stage Aware Health & Nutrition
echo =================================================================
echo.
echo [1/3] Preparing workspace...
cd /d "%~dp0"

echo [2/3] Scheduling browser launch (http://localhost:5173)...
start "" cmd /c "timeout /t 4 /nobreak >nul & start http://localhost:5173"

echo [3/3] Starting Backend (Port 5000) and Frontend (Port 5173)...
echo.
echo -----------------------------------------------------------------
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Press Ctrl + C in this window anytime to stop the servers.
echo -----------------------------------------------------------------
echo.

call npm run dev
