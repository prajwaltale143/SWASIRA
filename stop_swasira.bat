@echo off
title Stop SWASIRA Servers
color 0C

echo =================================================================
echo   Stopping SWASIRA Processes (Ports 5000 & 5173)...
echo =================================================================
echo.

powershell -NoProfile -Command "$ports = 5000, 5173; $pids = Get-NetTCPConnection -LocalPort $ports -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique; if ($pids) { Get-Process -Id $pids -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue; Write-Host 'Stopped processes with PIDs:' ($pids -join ', ') } else { Write-Host 'No active processes found on ports 5000 or 5173.' }"

echo.
echo [OK] All SWASIRA server processes have been stopped.
echo.
timeout /t 3 /nobreak >nul
