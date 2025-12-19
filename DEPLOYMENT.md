# 🚀 EmergenX Deployment Guide

This guide will help you deploy EmergenX to production platforms.

## 📋 Prerequisites

- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

## 🗄️ Step 1: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account
   - Create a new cluster (free tier)

2. **Configure Database**
   - Create a database named `emergenx`
   - Create a user with read/write permissions
   - Get your connection string

3. **Network Access**
   - Add `0.0.0.0/0` to IP whitelist (for Render deployment)

## 🔧 Step 2: Deploy Backend to Render

1. **Connect GitHub Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Backend Service**
   ```
   Name: emergenx-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/emergenx
   JWT_SECRET=your-super-secret-jwt-key-for-production
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL (e.g., `https://emergenx-backend.onrender.com`)

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Frontend**
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   ```

3. **Set Environment Variables**
   ```
   VITE_API_URL=https://emergenx-backend.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Note your frontend URL (e.g., `https://emergenx.vercel.app`)

## 🔗 Step 4: Update README with Live Links

After deployment, update your README.md with:

```markdown
## 🌐 Live Demo

- **Frontend**: https://emergenx.vercel.app
- **Backend API**: https://emergenx-backend.onrender.com

## 🚀 Quick Access

Click the link above to try EmergenX immediately - no setup required!
```

## ✅ Step 5: Test Deployment

1. **Test Backend**
   ```bash
   curl https://emergenx-backend.onrender.com/
   # Should return: {"message":"EmergenX Backend API is running!"}
   ```

2. **Test Frontend**
   - Open your Vercel URL
   - Try registering a new user
   - Test the triage functionality

## 🔧 Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure environment variables are set

### Frontend Issues
- Check Vercel build logs
- Verify API URL is correct
- Test API endpoints directly

### Database Issues
- Check MongoDB Atlas network access
- Verify database user permissions
- Test connection string locally

## 📊 Monitoring

- **Render**: Monitor backend performance and logs
- **Vercel**: Monitor frontend analytics and performance
- **MongoDB Atlas**: Monitor database usage and performance

## 🔄 Updates

To update your deployment:

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "Update deployment"
   git push origin main
   ```

2. **Automatic Deployment**
   - Render and Vercel will automatically redeploy
   - Monitor deployment status in dashboards

---

**🎉 Congratulations!** Your EmergenX application is now live and accessible to everyone! 