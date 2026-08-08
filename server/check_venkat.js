const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne({ name: 'venkat' });
  console.log('User found:', user);
  process.exit();
}
check();
