# Deployment Guide - Personal Finance Visualizer

## 🚀 Quick Deployment to Get Live URL

### Prerequisites
- GitHub account
- MongoDB Atlas account (free)

---

## Step 1: Set Up MongoDB Atlas (Free Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Choose "Free" tier (M0)

### 1.2 Create Database Cluster
1. Click "Build a Database"
2. Choose "FREE" tier
3. Select your preferred cloud provider (AWS/Google Cloud/Azure)
4. Choose a region close to you
5. Click "Create"

### 1.3 Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password (save these!)
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 1.4 Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for deployment)
4. Click "Confirm"

### 1.5 Get Connection String
1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `personal-finance`

**Your connection string should look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/personal-finance?retryWrites=true&w=majority
```

---

## Step 2: Prepare Your Code

### 2.1 Commit Your Changes
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2.2 Verify Your Repository
Make sure your GitHub repository contains:
- ✅ All source code
- ✅ `package.json`
- ✅ `next.config.ts`
- ✅ `vercel.json` (for Vercel deployment)

---

## Step 3: Deploy to Vercel (Recommended)

### 3.1 Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

### 3.2 Deploy Your Project
1. Click "New Project"
2. Import your GitHub repository
3. Vercel will auto-detect it's a Next.js project
4. Click "Continue"

### 3.3 Configure Environment Variables
1. In the project settings, go to "Environment Variables"
2. Add a new variable:
   - **Name:** `MONGODB_URI`
   - **Value:** Your MongoDB Atlas connection string
3. Click "Save"

### 3.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your live URL will be: `https://your-project-name.vercel.app`

---

## Step 4: Test Your Live Application

### 4.1 Verify Deployment
1. Visit your live URL
2. Check that the application loads without errors
3. Test adding a transaction
4. Verify database connection works

### 4.2 Common Issues & Solutions

**Issue: "Database Connection Error"**
- Solution: Check your `MONGODB_URI` environment variable in Vercel
- Make sure the connection string is correct and includes your password

**Issue: "Build Failed"**
- Solution: Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`

**Issue: "Application Error"**
- Solution: Check the function logs in Vercel dashboard
- Verify your MongoDB Atlas network access allows connections

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

---

## Alternative Deployment Options

### Netlify Deployment
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub
3. Click "New site from Git"
4. Choose your repository
5. Set build command: `npm run build`
6. Set publish directory: `.next`
7. Add environment variable: `MONGODB_URI`
8. Deploy

### Railway Deployment
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Create new project
4. Deploy from GitHub repo
5. Add environment variable: `MONGODB_URI`
6. Deploy

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Live URL for your application
- ✅ Cloud database (MongoDB Atlas)
- ✅ Automatic deployments on code changes
- ✅ SSL certificate included
- ✅ Global CDN for fast loading

## 📞 Support

If you encounter issues:
1. Check the deployment logs in your platform dashboard
2. Verify your MongoDB Atlas connection
3. Ensure all environment variables are set correctly
4. Check that your code builds locally (`npm run build`)

---

## 🔄 Continuous Deployment

After initial deployment:
- Every push to your `main` branch will automatically deploy
- Your live URL will always have the latest version
- No manual deployment needed for updates 