@echo off
title Your Secret Diary - MERN FullStack Server
echo ===================================================
echo   Starting Your Secret Diary (Full-Stack MERN)
echo ===================================================
cd /d "%~dp0"
echo.
echo Opening browser at http://localhost:5000 ...
timeout /t 2 /nobreak >nul
start http://localhost:5000
echo.
echo Server is running on port 5000. Press Ctrl+C to stop.
echo.
npm start
pause
