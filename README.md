# 🚨 EmergenX - Smart Medical Triage System

A full-stack web application for intelligent medical triage and symptom assessment, built with React, Node.js, and MongoDB.

## 🎯 Project Overview

EmergenX combines "Emergency" and "Next-gen execution", symbolizing speed, innovation, and efficiency in medical triage. The application helps users quickly assess the urgency of their symptoms and receive intelligent triage suggestions.

## ✨ Features

- **User Authentication**: Secure registration and login system
- **Symptom Assessment**: Interactive form for symptom input and analysis
- **Smart Triage**: Intelligent suggestions based on symptom analysis
- **Triage History**: Track and review previous assessments
- **Modern UI/UX**: Responsive design with intuitive user interface
- **Real-time Processing**: Fast and efficient symptom evaluation

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router** for navigation
- **Context API** for state management
- **Axios** for API communication
- **Lucide React** for modern icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Quick Start
```bash
# 1. Clone and setup
git clone https://github.com/your-username/emergenx.git
cd emergenx
./setup.sh  # or setup.bat on Windows

# 2. Start MongoDB service

# 3. Run the application
cd Server && npm run dev    # Terminal 1
cd client && npm run dev    # Terminal 2

# 4. Open http://localhost:5173 in your browser
```

### Installation

#### Quick Setup (Recommended)
```bash
# Clone the repository
git clone https://github.com/your-username/emergenx.git
cd emergenx

# Run setup script
# For Linux/Mac:
chmod +x setup.sh
./setup.sh

# For Windows:
setup.bat
```

#### Manual Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/emergenx.git
   cd emergenx
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd Server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   - Create `.env` file in the Server directory
   - Add your MongoDB connection string and JWT secret

4. **Run the application**
   ```bash
   # Start the server (from Server directory)
   npm run dev
   
   # Start the client (from client directory)
   npm run dev
   ```

## 📁 Project Structure

```
emergenx/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Application pages
│   │   ├── context/      # React context providers
│   │   └── services/     # API service functions
│   └── public/           # Static assets
├── Server/               # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── middleware/      # Custom middleware
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Triage
- `POST /api/triage/assess` - Submit symptoms for assessment
- `GET /api/triage/history` - Get user's triage history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**PandiHarshan** - Full Stack Developer

---

**EmergenX** - Where speed meets intelligence in medical triage. 🚨⚡ 