# Complete Setup Guide

This guide will walk you through setting up the Staffing Management System from scratch.

## Prerequisites

Before starting, ensure you have the following installed:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MongoDB**
   - Option A: Install locally from https://www.mongodb.com/try/download/community
   - Option B: Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas
   - Verify local installation: `mongod --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Step-by-Step Setup

### Step 1: Setup MongoDB

#### Option A: Local MongoDB

1. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB

   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux
   sudo systemctl start mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongo --eval "db.version()"
   ```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/atlas
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### Step 2: Setup Backend

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file**
   Open `.env` in a text editor and configure:

   For local MongoDB:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/staffing_management
   JWT_SECRET=your_secure_random_string_here_minimum_32_characters
   NODE_ENV=development
   ```

   For MongoDB Atlas:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/staffing_management
   JWT_SECRET=your_secure_random_string_here_minimum_32_characters
   NODE_ENV=development
   ```

   **Important:** Replace `your_secure_random_string_here_minimum_32_characters` with a strong random string.

5. **Create the first admin user**
   ```bash
   node scripts/createAdmin.js
   ```

   You should see:
   ```
   Admin user created successfully!
   Email: admin@staffing.com
   Password: admin123
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server running on port 5000
   ```

7. **Test the backend** (open a new terminal)
   ```bash
   curl http://localhost:5000/api/health
   ```

   Should return: `{"status":"OK","message":"Server is running"}`

### Step 3: Setup Frontend

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file**
   Open `.env` in a text editor:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

### Step 4: Access the Application

1. **Open your browser and go to:**
   ```
   http://localhost:3000
   ```

2. **Login with default admin credentials:**
   - Email: `admin@staffing.com`
   - Password: `admin123`

3. **Change the admin password immediately!**
   - Click on "Profile" in the navigation
   - Use the "Change Password" section

## Testing the System

### Test Admin Functions

1. Login as admin
2. Go to Dashboard
3. Click "Companies" tab
4. Click "Register Company" button
5. Fill in company details:
   - Company Name: Test Company
   - Email: company@test.com
   - Phone: 9876543210
   - Address: Test Address
   - GST Number: 12ABCDE3456F7Z8
   - Password: company123
6. Click "Register Company"
7. Verify company appears in the list

### Test Company Functions

1. Logout from admin
2. Login as company:
   - Email: company@test.com
   - Password: company123
3. Test registering a supervisor:
   - Go to "Supervisors" tab
   - Click "Add Supervisor"
   - Fill details and submit
4. Test registering an employee:
   - Go to "Employees" tab
   - Click "Add Employee"
   - Fill all details including salary structure
   - Submit

### Test Supervisor Functions

1. Logout and login as supervisor
2. Go to "Today's Attendance"
3. Click "Mark Attendance"
4. Select an employee
5. Select date and status
6. Submit

### Test Employee Functions

1. Logout and login as employee
2. View "My Attendance" tab
3. View "My Payslips" tab
4. View "My Profile" tab

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env file
- For MongoDB Atlas, verify IP whitelist and credentials

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000
kill -9 <PID>

# Or change PORT in backend/.env to another port like 5001
```

### Issue 3: JWT Authentication Error

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
- Clear browser localStorage
- Logout and login again
- Verify JWT_SECRET is set in backend/.env

### Issue 4: CORS Error in Browser

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
- Verify VITE_API_URL in frontend/.env
- Ensure backend server is running
- Check browser console for exact error

### Issue 5: npm install fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Directory Structure After Setup

```
staffing-management/
├── backend/
│   ├── node_modules/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── node_modules/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Next Steps

1. **Change Default Passwords**
   - Change admin password
   - Change any test user passwords

2. **Configure Email (Optional)**
   - Setup email service for notifications
   - Configure SMTP settings

3. **Customize Branding**
   - Update colors in CSS
   - Add company logo
   - Customize text and labels

4. **Setup Backup**
   - Configure MongoDB backup schedule
   - Setup automated backups

5. **Security Hardening**
   - Implement rate limiting
   - Add input validation
   - Setup SSL/HTTPS for production

## Development Tips

### Running Both Servers Simultaneously

Use two terminal windows:

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Using nodemon for Auto-Reload (Backend)

```bash
cd backend
npm run dev
```

### Viewing Logs

Backend logs appear in the terminal running the backend server.
Frontend logs appear in browser console (F12 > Console).

### Database GUI Tools

For easier MongoDB management:
- MongoDB Compass (official GUI): https://www.mongodb.com/products/compass
- Robo 3T: https://robomongo.org/

## Production Deployment

When ready to deploy to production:

1. Read `DEPLOYMENT.md` for detailed deployment instructions
2. Setup proper environment variables
3. Configure HTTPS/SSL
4. Setup reverse proxy (Nginx/Apache)
5. Configure firewall rules
6. Setup monitoring and logging

## Getting Help

If you encounter issues:

1. Check this guide thoroughly
2. Review error messages in terminal and browser console
3. Check MongoDB connection and logs
4. Verify all environment variables are set correctly
5. Ensure all ports are available and not blocked by firewall

## Stopping the Application

To stop the servers:

1. Press `Ctrl + C` in the terminal running backend
2. Press `Ctrl + C` in the terminal running frontend
3. Stop MongoDB (if running locally):
   ```bash
   # Windows
   net stop MongoDB

   # macOS
   brew services stop mongodb-community

   # Linux
   sudo systemctl stop mongod
   ```

## Summary

You now have:
- Backend API running on http://localhost:5000
- Frontend application running on http://localhost:3000
- MongoDB database for data storage
- Admin user to manage the system
- Complete staffing management system with 4 user roles

Start by logging in as admin and creating your first company!
