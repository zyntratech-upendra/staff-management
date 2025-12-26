const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');

exports.getAssignedEmployees = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const now = new Date();

    const assignments = await Assignment.find({
      companyId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('employeeId', 'name email phone aadhaar pan salaryStructure');

    const employees = assignments.map(assignment => ({
      ...assignment.employeeId.toObject(),
      assignmentId: assignment._id,
      dailySalary: assignment.dailySalary,
      startDate: assignment.startDate,
      endDate: assignment.endDate
    }));

    res.json(employees);
  } catch (error) {
    console.error('Get assigned employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAssignments = async (req, res) => {
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
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({
      role: 'supervisor',
      isActive: true
    }).select('-password');

    res.json(supervisors);
  } catch (error) {
    console.error('Get supervisors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceSummary = async (req, res) => {
  try {
    const { month, year, employeeId } = req.query;

    const query = {
      companyId: req.user.companyId
    };

    if (employeeId) {
      query.employeeId = employeeId;
    }

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name email')
      .populate('supervisorId', 'name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.viewEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const companyId = req.user.companyId;
    const now = new Date();

    const assignment = await Assignment.findOne({
      employeeId,
      companyId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('employeeId', 'name email phone aadhaar pan bankDetails salaryStructure documents');

    if (!assignment) {
      return res.status(404).json({ message: 'Employee not currently assigned to your company' });
    }

    res.json({
      employee: assignment.employeeId,
      assignment: {
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        dailySalary: assignment.dailySalary,
        status: assignment.status
      }
    });
  } catch (error) {
    console.error('View employee details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
