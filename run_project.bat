@echo off
title Ceylon Harvest Organics - SE102.3 Web Application Development
cd /d "%~dp0"

echo =========================================================
echo   CEYLON HARVEST ORGANICS - WEB APPLICATION SERVER
echo   Module: SE102.3 Web Based Application Development
echo =========================================================
echo.

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

if not exist db\database.db (
    echo Initializing and seeding SQLite database...
    call npm run seed
    echo.
)

echo Starting Web Server at http://localhost:3000
start http://localhost:3000

node server.js
pause
