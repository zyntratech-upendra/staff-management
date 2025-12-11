const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  totalWorkingDays: {
    type: Number,
    required: true
  },
  presentDays: {
    type: Number,
    required: true,
    default: 0
  },
  halfDays: {
    type: Number,
    default: 0
  },
  paidLeaves: {
    type: Number,
    default: 0
  },
  absentDays: {
    type: Number,
    default: 0
  },
  daysWorked: {
    type: Number,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true
  },
  hra: {
    type: Number,
    default: 0
  },
  allowances: {
    type: Number,
    default: 0
  },
  grossSalary: {
    type: Number,
    required: true
  },
  perDaySalary: {
    type: Number,
    required: true
  },
  monthlyEarnings: {
    type: Number,
    required: true
  },
  pfDeduction: {
    type: Number,
    default: 0
  },
  esiDeduction: {
    type: Number,
    default: 0
  },
  totalDeductions: {
    type: Number,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'generated', 'paid'],
    default: 'pending'
  },
  generatedAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

salarySchema.index({ employeeId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
