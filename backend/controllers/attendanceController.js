const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

exports.markAttendance = async (req, res) => {
  try {
    const { employeeId, companyId, date, status, remarks, checkInTime, checkOutTime } = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee'
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const assignment = await Assignment.findOne({
      employeeId,
      companyId,
      status: 'active',
      startDate: { $lte: attendanceDate },
      endDate: { $gte: attendanceDate }
    });

    if (!assignment) {
      return res.status(400).json({ message: 'Employee not assigned to this company on the selected date' });
    }

    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: attendanceDate
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      existingAttendance.remarks = remarks;
      existingAttendance.checkInTime = checkInTime;
      existingAttendance.checkOutTime = checkOutTime;
      existingAttendance.updatedAt = Date.now();
      await existingAttendance.save();

      return res.json({
        message: 'Attendance updated successfully',
        attendance: existingAttendance
      });
    }

    const attendance = new Attendance({
      employeeId,
      companyId,
      supervisorId: req.userId,
      date: attendanceDate,
      status,
      remarks,
      checkInTime,
      checkOutTime
    });

    await attendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const query = {
      employeeId,
      companyId: req.user.companyId
    };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await Attendance.find(query)
      .populate('supervisorId', 'name')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployeesForAttendance = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const now = new Date();
    const assignments = await Assignment.find({
      companyId,
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    }).populate('employeeId', 'name email phone');

    const employees = assignments.map(assignment => ({
      _id: assignment.employeeId._id,
      name: assignment.employeeId.name,
      email: assignment.employeeId.email,
      phone: assignment.employeeId.phone,
      assignmentId: assignment._id
    }));

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({
      supervisorId: req.userId,
      date: today
    })
      .populate('employeeId', 'name email')
      .populate('companyId', 'name companyCode');

    res.json(attendance);
  } catch (error) {
    console.error('Get today attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCompaniesForSupervisor = async (req, res) => {
  try {
    const now = new Date();
    const assignments = await Assignment.find({
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    })
      .populate('companyId', 'name companyCode')
      .distinct('companyId');

    res.json(assignments);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
