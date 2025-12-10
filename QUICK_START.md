# Quick Start Guide

Get the Staffing Management System running in 5 minutes!

## Prerequisites

- Node.js installed
- MongoDB installed (or MongoDB Atlas account)

## Quick Setup

### 1. Install Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/staffing_management
JWT_SECRET=my_super_secret_jwt_key_minimum_32_chars_long_12345
NODE_ENV=development
```

Create admin & start:
```bash
node scripts/createAdmin.js
npm start
```

### 2. Install Frontend (Terminal 2)

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start:
```bash
npm run dev
```

### 3. Access Application

Open browser: `http://localhost:3000`

Login:
- Email: `admin@staffing.com`
- Password: `admin123`

## First Steps After Login

### As Admin:

1. **Change Password** (Profile > Change Password)

2. **Register a Company:**
   - Dashboard > Companies > Register Company
   - Fill details:
     - Name: My Company
     - Email: company@example.com
     - Phone: 9876543210
     - Address: Company Address
     - Password: company123

### As Company (Login with company@example.com):

3. **Register a Supervisor:**
   - Dashboard > Supervisors > Add Supervisor
   - Name: John Supervisor
   - Email: supervisor@example.com
   - Password: super123

4. **Register an Employee:**
   - Dashboard > Employees > Add Employee
   - Basic Info: Name, Email, Phone
   - Salary Structure:
     - Basic: 30000
     - HRA: 10000
     - Allowances: 5000
   - Password: emp123

### As Supervisor (Login with supervisor@example.com):

5. **Mark Attendance:**
   - Dashboard > Mark Attendance
   - Select Employee
   - Select Date (today)
   - Status: Present
   - Check In: 09:00
   - Check Out: 18:00
   - Submit

### As Company (Login again):

6. **Generate Salary:**
   - Dashboard > Salary > Generate Salary
   - Select Employee
   - Month: Current month
   - Year: Current year
   - Working Days: 26
   - Submit

### As Employee (Login with employee email):

7. **View Results:**
   - My Attendance: See attendance records
   - My Payslips: See generated salary

## System Overview

### 4 User Roles

```
┌─────────────┐
│    Admin    │ ← Manages Companies
└─────────────┘
       │
       ├─────────────────┐
       │                 │
┌─────────────┐   ┌─────────────┐
│  Company A  │   │  Company B  │
└─────────────┘   └─────────────┘
       │
       ├──────────┬──────────┐
       │          │          │
┌──────────┐ ┌──────────┐ ┌──────────┐
│Supervisor│ │Employee 1│ │Employee 2│
└──────────┘ └──────────┘ └──────────┘
       │          ▲          ▲
       └──────────┴──────────┘
         Marks Attendance
```

### Data Flow

```
1. Admin → Creates Company
2. Company → Creates Supervisor & Employee
3. Company → Sets Employee Salary Structure
4. Supervisor → Marks Daily Attendance
5. Company → Generates Monthly Salary
6. Employee → Views Attendance & Salary
```

## Key Features Per Role

| Feature | Admin | Company | Supervisor | Employee |
|---------|-------|---------|------------|----------|
| Create Companies | ✓ | - | - | - |
| Enable/Disable Companies | ✓ | - | - | - |
| Create Employees | - | ✓ | - | - |
| Create Supervisors | - | ✓ | - | - |
| Set Salary Structure | - | ✓ | - | - |
| Mark Attendance | - | - | ✓ | - |
| Generate Salary | - | ✓ | - | - |
| View Attendance | - | ✓ | ✓ | ✓ |
| View Salary | - | ✓ | - | ✓ |
| Update Profile | ✓ | ✓ | ✓ | ✓ |

## Important Endpoints

| Action | URL |
|--------|-----|
| Login | http://localhost:3000/login |
| Admin Dashboard | http://localhost:3000/admin |
| Company Dashboard | http://localhost:3000/company |
| Supervisor Dashboard | http://localhost:3000/supervisor |
| Employee Dashboard | http://localhost:3000/employee |

## Default Ports

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Common Commands

### Backend
```bash
# Install
npm install

# Start
npm start

# Development (auto-reload)
npm run dev

# Create admin
node scripts/createAdmin.js
```

### Frontend
```bash
# Install
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### MongoDB
```bash
# Start MongoDB
mongod

# Stop MongoDB (Ctrl+C)

# Access MongoDB shell
mongo

# Show databases
show dbs

# Use database
use staffing_management

# Show collections
show collections

# View users
db.users.find().pretty()
```

## Troubleshooting Quick Fixes

### Backend won't start
```bash
# Check if port 5000 is free
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Change port in backend/.env if needed
PORT=5001
```

### Frontend can't connect
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check frontend .env
cat frontend/.env
```

### MongoDB connection error
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas URI in .env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

### Login fails
```bash
# Recreate admin
cd backend
node scripts/createAdmin.js
```

### Clear all data (fresh start)
```bash
# In MongoDB shell
mongo
use staffing_management
db.dropDatabase()

# Then recreate admin
node scripts/createAdmin.js
```

## Testing Checklist

- [ ] Admin can login
- [ ] Admin can create company
- [ ] Company can login
- [ ] Company can create supervisor
- [ ] Company can create employee
- [ ] Supervisor can login
- [ ] Supervisor can mark attendance
- [ ] Employee can login
- [ ] Employee can view attendance
- [ ] Company can generate salary
- [ ] Employee can view payslip

## Sample Test Data

### Test Company
```
Name: Tech Solutions
Email: tech@solutions.com
Phone: 9876543210
GST: 27AABCT1234F1Z5
Password: tech123
```

### Test Supervisor
```
Name: Sarah Manager
Email: sarah@tech.com
Password: sarah123
```

### Test Employee
```
Name: Mike Developer
Email: mike@tech.com
Password: mike123
Basic: 40000
HRA: 15000
Allowances: 8000
```

## Production Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT secret (32+ chars)
- [ ] Setup MongoDB Atlas or production DB
- [ ] Configure HTTPS/SSL
- [ ] Setup environment variables on server
- [ ] Configure CORS properly
- [ ] Setup backup schedule
- [ ] Enable error logging
- [ ] Setup monitoring
- [ ] Test all features
- [ ] Create admin documentation
- [ ] Create user training materials

## Support

For detailed information:
- Setup: See `SETUP_GUIDE.md`
- Deployment: See `DEPLOYMENT.md`
- API: See `API_DOCUMENTATION.md`
- General: See `README.md`

---

**You're ready to go! Start by logging in as admin and exploring the system.**
