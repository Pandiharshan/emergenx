@echo off
echo 🚨 Setting up EmergenX - Smart Medical Triage System
echo ==================================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install server dependencies
echo 📦 Installing server dependencies...
cd Server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)
echo ✅ Server dependencies installed

REM Install client dependencies
echo 📦 Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
echo ✅ Client dependencies installed

REM Create .env file for server if it doesn't exist
cd ..\Server
if not exist .env (
    echo 🔧 Creating .env file for server...
    (
        echo # MongoDB Connection String
        echo MONGODB_URI=mongodb://localhost:27017/emergenx
        echo.
        echo # JWT Secret
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo.
        echo # Server Port
        echo PORT=5000
    ) > .env
    echo ✅ .env file created
    echo ⚠️  Please update the .env file with your actual MongoDB connection and JWT secret
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo To run the application:
echo 1. Start MongoDB service
echo 2. Open terminal in Server directory: npm run dev
echo 3. Open another terminal in client directory: npm run dev
echo.
echo 🚨 EmergenX is ready to use!
pause 