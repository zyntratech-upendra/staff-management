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
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
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
  presentDays: {
    type: Number,
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
  dailySalary: {
    type: Number,
    required: true
  },
  totalEarnings: {
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

salarySchema.index({ employeeId: 1, companyId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Salary', salarySchema);
