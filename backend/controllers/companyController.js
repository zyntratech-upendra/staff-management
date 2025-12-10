const User = require('../models/User');
const Attendance = require('../models/Attendance');

exports.registerEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      aadhaar,
      pan,
      bankDetails,
      salaryStructure
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const employee = new User({
      role: 'employee',
      name,
      email,
      password,
      phone,
      address,
      aadhaar,
      pan,
      bankDetails,
      salaryStructure,
      companyId: req.user.companyId,
      companyCode: req.user.companyCode
    });

    await employee.save();

    res.status(201).json({
      message: 'Employee registered successfully',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email
      }
    });
  } catch (error) {
    console.error('Register employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerSupervisor = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const supervisor = new User({
      role: 'supervisor',
      name,
      email,
      password,
      phone,
      address,
      companyId: req.user.companyId,
      companyCode: req.user.companyCode
    });

    await supervisor.save();

    res.status(201).json({
      message: 'Supervisor registered successfully',
      supervisor: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email
      }
    });
  } catch (error) {
    console.error('Register supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: 'employee',
      companyId: req.user.companyId
    }).select('-password');

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({
      role: 'supervisor',
      companyId: req.user.companyId
    }).select('-password');

    res.json(supervisors);
  } catch (error) {
    console.error('Get supervisors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee',
      companyId: req.user.companyId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    Object.assign(employee, updateData);
    employee.updatedAt = Date.now();
    await employee.save();

    res.json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.promoteToSupervisor = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee',
      companyId: req.user.companyId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.role = 'supervisor';
    employee.updatedAt = Date.now();
    await employee.save();

    res.json({ message: 'Employee promoted to supervisor', supervisor: employee });
  } catch (error) {
    console.error('Promote employee error:', error);
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

exports.uploadDocument = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { name, url } = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee',
      companyId: req.user.companyId
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.documents.push({ name, url });
    await employee.save();

    res.json({
      message: 'Document uploaded successfully',
      documents: employee.documents
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
