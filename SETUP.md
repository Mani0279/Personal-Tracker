# Setup Guide - Personal Finance Visualizer

## Quick Fix for Database Connection Error

The application is currently showing a database connection error. Here's how to fix it:

### Option 1: Use MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier)
3. Get your connection string from the cluster
4. Create a `.env.local` file in the project root with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

### Option 2: Use Local MongoDB

1. Install MongoDB Community Edition:
   - **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS**: `brew install mongodb-community`
   - **Linux**: Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically as a service
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. Create `.env.local` file in the project root:
   ```
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   ```

### Option 3: Use Docker (Alternative)

1. Install Docker Desktop
2. Run MongoDB container:
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```
3. Create `.env.local` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/personal-finance
   ```

## After Setting Up MongoDB

1. Restart the development server:
   ```bash
   npm run dev
   ```

2. The application should now work without database errors

## Troubleshooting

### Common Issues:

1. **"ECONNREFUSED" error**: MongoDB is not running
   - Start MongoDB service
   - Check if port 27017 is available

2. **"Authentication failed" error**: Wrong connection string
   - Double-check your MongoDB Atlas connection string
   - Make sure username/password are correct

3. **"Network timeout" error**: Network connectivity issues
   - Check your internet connection
   - Verify MongoDB Atlas IP whitelist settings

### Test Database Connection:

You can test if MongoDB is working by visiting:
- `http://localhost:3000/api/transactions`

If it returns an empty array `[]`, the connection is working!

## Need Help?

If you're still having issues:
1. Check the browser console for detailed error messages
2. Check the terminal where `npm run dev` is running for server logs
3. Make sure the `.env.local` file is in the project root directory 