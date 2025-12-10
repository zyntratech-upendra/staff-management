const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('companyId');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    if (user.role === 'company' && user.companyId) {
      const company = await Company.findById(user.companyId);
      if (company && !company.isActive) {
        return res.status(403).json({ message: 'Company account is disabled' });
      }
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
        companyCode: user.companyCode
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('companyId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, profilePhoto, bankDetails } = req.body;

    const updateData = {
      updatedAt: Date.now()
    };

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profilePhoto) updateData.profilePhoto = profilePhoto;
    if (bankDetails) updateData.bankDetails = bankDetails;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userId);

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
