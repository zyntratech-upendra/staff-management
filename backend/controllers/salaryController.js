const Salary = require('../models/Salary');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const calculateSalary = (salaryStructure, presentDays, halfDays, paidLeaves, totalWorkingDays) => {
  const { basicSalary, hra, allowances, pfApplicable, pfAmount, esiApplicable, esiAmount } = salaryStructure;

  const grossSalary = basicSalary + hra + allowances;
  const perDaySalary = grossSalary / totalWorkingDays;
  const daysWorked = presentDays + paidLeaves + (halfDays * 0.5);
  const monthlyEarnings = perDaySalary * daysWorked;

  let pfDeduction = 0;
  let esiDeduction = 0;

  if (pfApplicable) {
    pfDeduction = pfAmount || (basicSalary * 0.12);
  }

  if (esiApplicable) {
    esiDeduction = esiAmount || (grossSalary * 0.0075);
  }

  const totalDeductions = pfDeduction + esiDeduction;
  const netSalary = monthlyEarnings - totalDeductions;

  return {
    grossSalary,
    perDaySalary,
    daysWorked,
    monthlyEarnings,
    pfDeduction,
    esiDeduction,
    totalDeductions,
    netSalary
  };
};

exports.generateSalary = async (req, res) => {
  try {
    const { employeeId, month, year, totalWorkingDays } = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee',
      companyId: req.user.companyId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendanceRecords = await Attendance.find({
      employeeId,
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

    const salaryCalculation = calculateSalary(
      employee.salaryStructure,
      presentDays,
      halfDays,
      paidLeaves,
      totalWorkingDays
    );

    const existingSalary = await Salary.findOne({ employeeId, month, year });

    if (existingSalary) {
      Object.assign(existingSalary, {
        totalWorkingDays,
        presentDays,
        halfDays,
        paidLeaves,
        absentDays,
        basicSalary: employee.salaryStructure.basicSalary,
        hra: employee.salaryStructure.hra,
        allowances: employee.salaryStructure.allowances,
        ...salaryCalculation,
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
      companyId: req.user.companyId,
      month,
      year,
      totalWorkingDays,
      presentDays,
      halfDays,
      paidLeaves,
      absentDays,
      basicSalary: employee.salaryStructure.basicSalary,
      hra: employee.salaryStructure.hra,
      allowances: employee.salaryStructure.allowances,
      ...salaryCalculation,
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

exports.generateSalariesForAll = async (req, res) => {
  try {
    const { month, year, totalWorkingDays } = req.body;

    if (!month || !year || !totalWorkingDays) {
      return res.status(400).json({ message: 'month, year and totalWorkingDays are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // get all employees for the company
    const employees = await User.find({ companyId: req.user.companyId, role: 'employee' });

    const results = [];

    for (const employee of employees) {
      const attendanceRecords = await Attendance.find({
        employeeId: employee._id,
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

      const salaryCalculation = calculateSalary(
        employee.salaryStructure,
        presentDays,
        halfDays,
        paidLeaves,
        totalWorkingDays
      );

      const existingSalary = await Salary.findOne({ employeeId: employee._id, month, year });

      if (existingSalary) {
        Object.assign(existingSalary, {
          totalWorkingDays,
          presentDays,
          halfDays,
          paidLeaves,
          absentDays,
          basicSalary: employee.salaryStructure.basicSalary,
          hra: employee.salaryStructure.hra,
          allowances: employee.salaryStructure.allowances,
          ...salaryCalculation,
          status: 'generated',
          generatedAt: Date.now()
        });

        await existingSalary.save();
        results.push({ employeeId: employee._id, status: 'updated', salaryId: existingSalary._id });
      } else {
        const salary = new Salary({
          employeeId: employee._id,
          companyId: req.user.companyId,
          month,
          year,
          totalWorkingDays,
          presentDays,
          halfDays,
          paidLeaves,
          absentDays,
          basicSalary: employee.salaryStructure.basicSalary,
          hra: employee.salaryStructure.hra,
          allowances: employee.salaryStructure.allowances,
          ...salaryCalculation,
          status: 'generated'
        });

        await salary.save();
        results.push({ employeeId: employee._id, status: 'created', salaryId: salary._id });
      }
    }

    res.json({ message: 'Bulk salary generation completed', results });
  } catch (error) {
    console.error('Bulk generate salaries error:', error);
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
