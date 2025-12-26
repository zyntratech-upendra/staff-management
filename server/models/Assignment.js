const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  dailySalary: {
    type: Number,
    required: true
  },
  notes: {
    type: String
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

assignmentSchema.index({ employeeId: 1, startDate: 1, endDate: 1 });
assignmentSchema.index({ companyId: 1, status: 1 });

assignmentSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'active' &&
         this.startDate <= now &&
         this.endDate >= now;
};

assignmentSchema.statics.getActiveAssignment = async function(employeeId) {
  const now = new Date();
  return this.findOne({
    employeeId,
    status: 'active',
    startDate: { $lte: now },
    endDate: { $gte: now }
  }).populate('companyId');
};

module.exports = mongoose.model('Assignment', assignmentSchema);
