const User = require('../models/User');
const Company = require('../models/Company');

const generateCompanyCode = () => {
  return 'COMP' + Date.now().toString(36).toUpperCase();
};

exports.registerCompany = async (req, res) => {
  try {
    const { name, email, phone, address, gstNumber, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const companyCode = generateCompanyCode();

    const companyUser = new User({
      role: 'company',
      name,
      email,
      password,
      phone,
      address,
      companyCode
    });

    await companyUser.save();

    const company = new Company({
      name,
      email,
      phone,
      address,
      gstNumber,
      companyCode,
      userId: companyUser._id
    });

    await company.save();

    companyUser.companyId = company._id;
    await companyUser.save();

    res.status(201).json({
      message: 'Company registered successfully',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        companyCode: company.companyCode
      }
    });
  } catch (error) {
    console.error('Register company error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate('userId', 'name email phone isActive')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleCompanyStatus = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isActive = !company.isActive;
    await company.save();

    await User.findByIdAndUpdate(company.userId, { isActive: company.isActive });

    res.json({
      message: `Company ${company.isActive ? 'enabled' : 'disabled'} successfully`,
      company
    });
  } catch (error) {
    console.error('Toggle company status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalCompanies = await Company.countDocuments();
    const activeCompanies = await Company.countDocuments({ isActive: true });
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalSupervisors = await User.countDocuments({ role: 'supervisor' });

    res.json({
      totalCompanies,
      activeCompanies,
      totalEmployees,
      totalSupervisors,
      totalUsers: totalEmployees + totalSupervisors + totalCompanies
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetCompanyPassword = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { newPassword } = req.body;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const user = await User.findById(company.userId);
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
      salaryStructure
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

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({
      role: 'employee'
    }).select('-password');

    res.json(employees);
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateData = req.body;

    const employee = await User.findOne({
      _id: employeeId,
      role: 'employee'
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

exports.registerSupervisor = async (req, res) => {
  try {
    const { name, email, password, phone, address, companyId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (companyId) {
      const companyExists = await Company.findById(companyId);
      if (!companyExists) {
        return res.status(404).json({ message: 'Company not found' });
      }
    }

    const supervisor = new User({
      role: 'supervisor',
      name,
      email,
      password,
      phone,
      address,
      companyId: companyId || undefined
    });

    await supervisor.save();

    // If companyId provided, add supervisor to company's supervisors list
    if (companyId) {
      await Company.findByIdAndUpdate(companyId, { $push: { supervisors: supervisor._id } });
    }

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

exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({
      role: 'supervisor'
    }).select('-password').populate('companyId', 'name email phone');

    res.json(supervisors);
  } catch (error) {
    console.error('Get supervisors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.params;
    const { companyId, ...updateData } = req.body;

    const supervisor = await User.findOne({ _id: supervisorId, role: 'supervisor' });
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    const oldCompanyId = supervisor.companyId ? supervisor.companyId.toString() : null;

    // If companyId provided, validate
    if (companyId) {
      const newCompany = await Company.findById(companyId);
      if (!newCompany) {
        return res.status(404).json({ message: 'New company not found' });
      }
    }

    // Update supervisor fields
    Object.assign(supervisor, updateData);
    supervisor.companyId = companyId || undefined;
    supervisor.updatedAt = Date.now();
    await supervisor.save();

    // If changed company, update companies' supervisors arrays
    const newCompanyId = companyId ? companyId.toString() : null;
    if (oldCompanyId && oldCompanyId !== newCompanyId) {
      await Company.findByIdAndUpdate(oldCompanyId, { $pull: { supervisors: supervisor._id } });
    }
    if (newCompanyId && oldCompanyId !== newCompanyId) {
      await Company.findByIdAndUpdate(newCompanyId, { $addToSet: { supervisors: supervisor._id } });
    }

    res.json({ message: 'Supervisor updated successfully', supervisor });
  } catch (error) {
    console.error('Update supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.params;

    const supervisor = await User.findOne({ _id: supervisorId, role: 'supervisor' });
    if (!supervisor) {
      return res.status(404).json({ message: 'Supervisor not found' });
    }

    // Remove from company supervisors list if assigned
    if (supervisor.companyId) {
      await Company.findByIdAndUpdate(supervisor.companyId, { $pull: { supervisors: supervisor._id } });
    }

    await User.deleteOne({ _id: supervisorId });

    res.json({ message: 'Supervisor deleted successfully' });
  } catch (error) {
    console.error('Delete supervisor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceByDate = async (req, res) => {
  try {
    const { date, companyId } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date is required in query (YYYY-MM-DD)' });
    }

    const Attendance = require('../models/Attendance');

    const target = new Date(date);
    target.setUTCHours(0, 0, 0, 0);

    const query = { date: target };
    if (companyId) query.companyId = companyId;

    const attendanceRecords = await Attendance.find(query)
      .populate('employeeId', 'name email phone')
      .populate('companyId', 'name companyCode')
      .sort({ date: -1 });

    // return list of present employees (records with status 'Present' or similar)
    const present = attendanceRecords.filter(r => r.status && r.status.toLowerCase().includes('present'));

    res.json(present);
  } catch (error) {
    console.error('Get admin attendance by date error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
