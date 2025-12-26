const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Company = require('../models/Company');

exports.createAssignment = async (req, res) => {
  try {
    const { employeeId, companyId, startDate, endDate, dailySalary, notes } = req.body;
    console.log(req.body);

    const employee = await User.findOne({ _id: employeeId, role: 'employee' });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const existingAssignment = await Assignment.findOne({
      employeeId,
      status: 'active',
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });

    if (existingAssignment) {
      return res.status(400).json({
        message: 'Employee already has an overlapping assignment'
      });
    }

    const assignment = new Assignment({
      employeeId,
      companyId,
      startDate: start,
      endDate: end,
      dailySalary,
      notes,
      assignedBy: req.userId,
      status: 'active'
    });

    await assignment.save();

    // Update employee profile with assigned company
    try {
      await User.findByIdAndUpdate(employeeId, { companyId: companyId, companyCode: company.companyCode });
    } catch (err) {
      console.error('Failed to update user company info:', err);
    }

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const { status, employeeId, companyId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;
    if (companyId) query.companyId = companyId;

    const assignments = await Assignment.find(query)
      .populate('employeeId', 'name email phone')
      .populate('companyId', 'name email companyCode')
      .populate('assignedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId)
      .populate('employeeId', 'name email phone aadhaar pan')
      .populate('companyId', 'name email companyCode')
      .populate('assignedBy', 'name');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { startDate, endDate, dailySalary, notes, status } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (startDate) assignment.startDate = new Date(startDate);
    if (endDate) assignment.endDate = new Date(endDate);
    if (dailySalary) assignment.dailySalary = dailySalary;
    if (notes !== undefined) assignment.notes = notes;
    if (status) assignment.status = status;

    assignment.updatedAt = Date.now();
    await assignment.save();

    // If assignment is active, ensure user's company is set to this assignment's company
    try {
      if (assignment.status === 'active') {
        const comp = await Company.findById(assignment.companyId);
        await User.findByIdAndUpdate(assignment.employeeId, { companyId: assignment.companyId, companyCode: comp?.companyCode });
      } else if (assignment.status === 'completed') {
        // if completed, check for other active assignments; if none, clear user's company
        const active = await Assignment.findOne({ employeeId: assignment.employeeId, status: 'active' });
        if (!active) {
          await User.findByIdAndUpdate(assignment.employeeId, { $unset: { companyId: 1, companyCode: 1 } });
        } else {
          const comp = await Company.findById(active.companyId);
          await User.findByIdAndUpdate(assignment.employeeId, { companyId: active.companyId, companyCode: comp?.companyCode });
        }
      }
    } catch (err) {
      console.error('Failed to sync user company after assignment update:', err);
    }

    res.json({
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.completeAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.status = 'completed';
    assignment.endDate = new Date();
    assignment.updatedAt = Date.now();
    await assignment.save();

    // If employee has no other active assignments, clear company on user profile
    try {
      const otherActive = await Assignment.findOne({ employeeId: assignment.employeeId, status: 'active' });
      if (!otherActive) {
        await User.findByIdAndUpdate(assignment.employeeId, { $unset: { companyId: 1, companyCode: 1 } });
      } else {
        const comp = await Company.findById(otherActive.companyId);
        await User.findByIdAndUpdate(assignment.employeeId, { companyId: otherActive.companyId, companyCode: comp?.companyCode });
      }
    } catch (err) {
      console.error('Failed to sync user company after completing assignment:', err);
    }

    res.json({
      message: 'Assignment completed successfully',
      assignment
    });
  } catch (error) {
    console.error('Complete assignment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanyAssignments = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const { status } = req.query;
    const query = { companyId };
    if (status) query.status = status;

    const assignments = await Assignment.find(query)
      .populate('employeeId', 'name email phone aadhaar pan')
      .populate('assignedBy', 'name')
      .sort({ startDate: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get company assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActiveEmployees = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const now = new Date();

    const assignments = await Assignment.find({
      companyId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('employeeId', 'name email phone salaryStructure');

    const employees = assignments.map(assignment => ({
      ...assignment.employeeId.toObject(),
      assignmentId: assignment._id,
      dailySalary: assignment.dailySalary,
      startDate: assignment.startDate,
      endDate: assignment.endDate
    }));

    res.json(employees);
  } catch (error) {
    console.error('Get active employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFreeEmployees = async (req, res) => {
  try {
    const now = new Date();

    const activeAssignments = await Assignment.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).select('employeeId');

    const assignedEmployeeIds = activeAssignments.map(a => a.employeeId);

    const freeEmployees = await User.find({
      role: 'employee',
      isActive: true,
      _id: { $nin: assignedEmployeeIds }
    }).select('name email phone aadhaar pan salaryStructure');

    res.json(freeEmployees);
  } catch (error) {
    console.error('Get free employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkAssignmentStatus = async (req, res) => {
  try {
    const now = new Date();

    const expiredAssignments = await Assignment.find({
      status: 'active',
      endDate: { $lt: now }
    });

    for (const assignment of expiredAssignments) {
      assignment.status = 'completed';
      assignment.updatedAt = Date.now();
      await assignment.save();
    }

    res.json({
      message: 'Assignment status checked',
      completedCount: expiredAssignments.length
    });
  } catch (error) {
    console.error('Check assignment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
