const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Assignment = require('../models/Assignment');

const calculateDailySalary = (dailyRate, presentDays, halfDays, paidLeaves) => {
  const daysWorked = presentDays + paidLeaves + (halfDays * 0.5);
  const totalEarnings = dailyRate * daysWorked;

  return {
    dailyRate,
    daysWorked,
    totalEarnings
  };
};

exports.generateSalary = async (req, res) => {
  try {
    const { employeeId, month, year, assignmentId } = req.body;
    const companyId = req.user.companyId;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      employeeId,
      companyId,
      status: 'active'
    }).populate('employeeId', 'name email');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      employeeId,
      companyId,
      date: { $gte: startDate, $lte: endDate }
    });

    let presentDays = 0;
    let halfDays = 0;
    let paidLeaves = 0;
    let absentDays = 0;

    attendanceRecords.forEach(record => {
      switch (record.status) {
        case 'Present':
          presentDays++;
          break;
        case 'Half-day':
          halfDays++;
          break;
        case 'Leave':
          paidLeaves++;
          break;
        case 'Absent':
          absentDays++;
          break;
      }
    });

    const salaryCalculation = calculateDailySalary(
      assignment.dailySalary,
      presentDays,
      halfDays,
      paidLeaves
    );

    const existingSalary = await Salary.findOne({
      employeeId,
      companyId,
      month,
      year
    });

    if (existingSalary) {
      Object.assign(existingSalary, {
        presentDays,
        halfDays,
        paidLeaves,
        absentDays,
        dailySalary: assignment.dailySalary,
        daysWorked: salaryCalculation.daysWorked,
        totalEarnings: salaryCalculation.totalEarnings,
        status: 'generated',
        generatedAt: Date.now()
      });

      await existingSalary.save();

      return res.json({
        message: 'Salary updated successfully',
        salary: existingSalary
      });
    }

    const salary = new Salary({
      employeeId,
      companyId,
      month,
      year,
      presentDays,
      halfDays,
      paidLeaves,
      absentDays,
      dailySalary: assignment.dailySalary,
      daysWorked: salaryCalculation.daysWorked,
      totalEarnings: salaryCalculation.totalEarnings,
      assignmentId: assignment._id,
      status: 'generated'
    });

    await salary.save();

    res.status(201).json({
      message: 'Salary generated successfully',
      salary
    });
  } catch (error) {
    console.error('Generate salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSalaryByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const query = {
      employeeId
    };

    if (req.user.role === 'company') {
      query.companyId = req.user.companyId;
    }

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const salaries = await Salary.find(query)
      .populate('employeeId', 'name email')
      .sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (error) {
    console.error('Get salary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSalaries = async (req, res) => {
  try {
    const { month, year } = req.query;

    const query = {
      companyId: req.user.companyId
    };

    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const salaries = await Salary.find(query)
      .populate('employeeId', 'name email')
      .sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (error) {
    console.error('Get all salaries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyPayslips = async (req, res) => {
  try {
    const salaries = await Salary.find({
      employeeId: req.userId,
      status: { $in: ['generated', 'paid'] }
    }).sort({ year: -1, month: -1 });

    res.json(salaries);
  } catch (error) {
    console.error('Get payslips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
