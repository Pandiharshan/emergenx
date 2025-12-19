#!/bin/bash

echo "🚨 Setting up EmergenX - Smart Medical Triage System"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install server dependencies
echo "📦 Installing server dependencies..."
cd Server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi
echo "✅ Server dependencies installed"

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi
echo "✅ Client dependencies installed"

# Create .env file for server if it doesn't exist
cd ../Server
if [ ! -f .env ]; then
    echo "🔧 Creating .env file for server..."
    cat > .env << EOF
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/emergenx

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update the .env file with your actual MongoDB connection and JWT secret"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To run the application:"
echo "1. Start MongoDB service"
echo "2. Open terminal in Server directory: npm run dev"
echo "3. Open another terminal in client directory: npm run dev"
echo ""
echo "🚨 EmergenX is ready to use!" 