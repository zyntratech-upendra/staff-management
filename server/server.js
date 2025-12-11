require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const companyRoutes = require('./routes/company');
const attendanceRoutes = require('./routes/attendance');
const salaryRoutes = require('./routes/salary');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/salary', salaryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// --- Serve React static files when in production ---
if (process.env.NODE_ENV === 'production') {
  // Adjust 'client' if your frontend folder name differs
  const buildPath = path.join(__dirname, 'client', 'build');
  app.use(express.static(buildPath));

  // For any route not handled by API, serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // Helpful message when running in non-production
  app.get('/', (req, res) => res.send('API is running'));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});