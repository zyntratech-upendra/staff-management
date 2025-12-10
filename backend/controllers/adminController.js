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
