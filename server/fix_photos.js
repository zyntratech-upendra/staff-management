const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const placeholderAadhaar = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
  const placeholderPan = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
  
  const result = await User.updateMany(
    { 
      $or: [
        { aadhaarPhoto: { $exists: false } },
        { aadhaarPhoto: '' },
        { aadhaarPhoto: null }
      ]
    },
    { 
      $set: { 
        aadhaarPhoto: placeholderAadhaar,
        panPhoto: placeholderPan
      } 
    }
  );
  
  console.log('Updated users:', result.modifiedCount);
  process.exit();
}
fix();
