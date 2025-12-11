import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { authAPI } from '../../services/api';

function EmployeeProfile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    address: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
      setProfileForm({
        name: response.data.name,
        phone: response.data.phone || '',
        address: response.data.address || '',
        bankDetails: response.data.bankDetails || {
          accountNumber: '',
          ifscCode: '',
          bankName: '',
          accountHolderName: ''
        }
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await authAPI.updateProfile(profileForm);
      setMessage('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    try {
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setMessage('Password changed successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to change password');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Employee Profile</h1>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Profile Information</h2>
            {!editing && (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                />
              </div>

              <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Bank Details</h3>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={profileForm.bankDetails.accountNumber}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    bankDetails: { ...profileForm.bankDetails, accountNumber: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  value={profileForm.bankDetails.ifscCode}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    bankDetails: { ...profileForm.bankDetails, ifscCode: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  value={profileForm.bankDetails.bankName}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    bankDetails: { ...profileForm.bankDetails, bankName: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  value={profileForm.bankDetails.accountHolderName}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    bankDetails: { ...profileForm.bankDetails, accountHolderName: e.target.value }
                  })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
              <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
              <p><strong>Aadhaar:</strong> {profile.aadhaar || 'Not set'}</p>
              <p><strong>PAN:</strong> {profile.pan || 'Not set'}</p>
              <p><strong>Company Code:</strong> {profile.companyCode}</p>

              <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Bank Details</h3>
              <p><strong>Account Number:</strong> {profile.bankDetails?.accountNumber || 'Not set'}</p>
              <p><strong>IFSC Code:</strong> {profile.bankDetails?.ifscCode || 'Not set'}</p>
              <p><strong>Bank Name:</strong> {profile.bankDetails?.bankName || 'Not set'}</p>
              <p><strong>Account Holder:</strong> {profile.bankDetails?.accountHolderName || 'Not set'}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Change Password</h2>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
