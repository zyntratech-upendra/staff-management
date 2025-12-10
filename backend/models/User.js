const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'company', 'supervisor', 'employee'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  profilePhoto: {
    type: String
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  companyCode: {
    type: String
  },
  aadhaar: {
    type: String
  },
  pan: {
    type: String
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },
  salaryStructure: {
    basicSalary: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    pfApplicable: { type: Boolean, default: false },
    pfAmount: { type: Number, default: 0 },
    esiApplicable: { type: Boolean, default: false },
    esiAmount: { type: Number, default: 0 }
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
