require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'pranav@gmail.com' });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@staffing.com');
      process.exit(0);
    }

    const admin = new User({
      role: 'admin',
      name: 'System Administrator',
      email: 'pranav@gmail.com',
      password: 'Vivek@123',
      phone: '1234567890',
      isActive: true
    });

    await admin.save();

    console.log('Admin user created successfully!');
    console.log('Email: admin@staffing.com');
    console.log('Password: admin123');
    console.log('\nIMPORTANT: Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
