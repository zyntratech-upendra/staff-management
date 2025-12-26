import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { authAPI } from '../../services/api';

function EmployeeProfile({ user, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

  // Inject StaffHub Employee Profile styles - FULLY RESPONSIVE
  useEffect(() => {
    const styleId = 'employee-profile-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      :root {
        --sh-bg: #f5fafc;
        --sh-bg-soft: #f0f7fb;
        --sh-surface: #ffffff;
        --sh-border-subtle: #e2edf4;
        --sh-text-main: #0f172a;
        --sh-text-soft: #6b7280;
        --sh-primary: #06b6d4;
        --sh-primary-deep: #0891b2;
        --sh-primary-soft: #e0f7fb;
        --sh-accent-green: #10b981;
        --sh-danger: #ef4444;
        --sh-warning: #f59e0b;
        --sh-radius-lg: 24px;
        --sh-radius-md: 16px;
        --sh-radius-pill: 999px;
        --sh-shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
        --sh-shadow-subtle: 0 10px 30px rgba(15, 23, 42, 0.05);
      }

      * { box-sizing: border-box; }

      .profile-root {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 0, #e0f7fb 0, #f9fdff 32%, #f5fafc 60%);
      }

      .profile-shell {
        max-width: 1180px;
        margin: 90px auto 40px;
        padding: 0 1.5rem 3rem;
      }

      .profile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1.5rem;
      }

      .profile-title {
        font-size: clamp(1.75rem, 4vw, 2.05rem);
        letter-spacing: -0.02em;
        color: var(--sh-text-main);
        margin: 0 0 0.3rem;
        font-weight: 700;
      }

      .profile-subtitle {
        margin: 0;
        color: var(--sh-text-soft);
        font-size: 0.95rem;
      }

      .profile-pill {
        width: 54px;
        height: 54px;
        border-radius: 20px;
        background: linear-gradient(145deg, var(--sh-accent-green), #059669);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        letter-spacing: 0.08em;
        box-shadow: var(--sh-shadow-soft);
        flex-shrink: 0;
      }

      .alert-chip {
        padding: 0.75rem 1.25rem;
        border-radius: 999px;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        border: 1px solid var(--sh-border-subtle);
        box-shadow: var(--sh-shadow-subtle);
      }

      .alert-success {
        background: #ecfdf5;
        color: #166534;
        border-color: #bbf7d0;
      }

      .alert-error {
        background: #fef2f2;
        color: #b91c1c;
        border-color: #fecaca;
      }

      .panel {
        border-radius: var(--sh-radius-lg);
        background: rgba(255, 255, 255, 0.97);
        box-shadow: var(--sh-shadow-subtle);
        padding: 2rem 2.2rem;
        border: 1px solid rgba(226, 237, 244, 0.95);
        margin-bottom: 2rem;
        backdrop-filter: blur(10px);
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.2rem;
        margin-bottom: 1.8rem;
        flex-wrap: wrap;
      }

      .panel-title {
        margin: 0;
        font-size: 1.25rem;
        color: var(--sh-text-main);
        font-weight: 600;
      }

      .btn-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.65rem 1.5rem;
        font-size: 0.9rem;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        white-space: nowrap;
        transition: all 0.2s ease;
        font-weight: 600;
        text-decoration: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--sh-primary), var(--sh-primary-deep));
        color: #ffffff;
        box-shadow: 0 10px 25px rgba(8, 145, 178, 0.4);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 15px 35px rgba(8, 145, 178, 0.5);
      }

      .btn-secondary {
        background: transparent;
        border-color: var(--sh-border-subtle);
        color: var(--sh-text-main);
      }

      .btn-secondary:hover {
        background: var(--sh-bg-soft);
      }

      .btn-full { width: 100%; justify-content: center; }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }

      .form-group {
        margin-bottom: 1.4rem;
      }

      .form-group label {
        display: block;
        font-size: 0.9rem;
        color: var(--sh-text-soft);
        margin-bottom: 0.6rem;
        font-weight: 500;
      }

      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
        padding: 0.85rem 1.2rem;
        font-size: 0.95rem;
        outline: none;
        transition: all 0.2s ease;
        background: var(--sh-surface);
      }

      .form-group textarea {
        min-height: 100px;
        resize: vertical;
      }

      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
      }

      .form-group input:disabled {
        background: #f8fafc;
        color: var(--sh-text-soft);
        cursor: not-allowed;
      }

      .profile-display {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.2rem;
      }

      .profile-field {
        display: flex;
        gap: 1rem;
        padding: 1.2rem;
        background: var(--sh-bg-soft);
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
      }

      .profile-label {
        font-weight: 600;
        color: var(--sh-text-main);
        min-width: 140px;
        font-size: 0.95rem;
      }

      .profile-value {
        color: var(--sh-text-soft);
        flex: 1;
        font-size: 0.95rem;
        word-break: break-word;
      }

      .section-divider {
        border-top: 1px solid var(--sh-border-subtle);
        margin: 2rem 0;
        padding-top: 2rem;
      }

      .btn-group {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--sh-text-soft);
      }

      /* PERFECT RESPONSIVE */
      @media (max-width: 900px) {
        .profile-shell { margin-top: 82px; padding: 0 1rem 2rem; }
        .profile-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        .form-grid { grid-template-columns: 1fr; }
        .profile-display { grid-template-columns: 1fr; }
      }

      @media (max-width: 720px) {
        .profile-shell { margin-top: 75px; padding: 0 1rem 2rem; }
        .panel { padding: 1.5rem 1.25rem; }
        .panel-header { flex-direction: column; align-items: stretch; gap: 1rem; text-align: center; }
        .btn-group { flex-direction: column; }
        .btn-pill { justify-content: center; }
        .profile-field { flex-direction: column; gap: 0.5rem; padding: 1rem; }
        .profile-label { min-width: auto; }
      }

      @media (max-width: 480px) {
        .profile-field { padding: 0.9rem; }
        .form-group input,
        .form-group textarea { padding: 0.75rem 1rem; font-size: 0.9rem; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
      setProfileForm({
        name: response.data.name || '',
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
      setMessage('Failed to load profile');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await authAPI.updateProfile(profileForm);
      setMessage('Profile updated successfully');
      setEditing(false);
      loadProfile();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters');
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
    return (
      <div className="profile-root">
        <Navbar user={user} onLogout={onLogout} />
        <main className="profile-shell">
          <div className="empty-state">
            <h3>Loading Profile...</h3>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <Navbar user={user} onLogout={onLogout} />

      <main className="profile-shell">
        <header className="profile-header">
          <div>
            <h1 className="profile-title">Employee Profile</h1>
            <p className="profile-subtitle">
              Manage your personal information and security settings
            </p>
          </div>
          <span className="profile-pill">E</span>
        </header>

        {message && (
          <div className={`alert-chip ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        {/* Profile Information Section */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Profile Information</h2>
            {!editing && (
              <button 
                className="btn-pill btn-primary" 
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    disabled 
                  />
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
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>

              <div className="section-divider">
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: 'var(--sh-text-main)' }}>
                  Bank Details
                </h3>
                <div className="form-grid">
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
                </div>
              </div>

              <div className="btn-group">
                <button 
                  type="submit" 
                  className="btn-pill btn-primary" 
                  disabled={loading}
                  style={{ flex: 1, minWidth: '140px' }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn-pill btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setMessage('');
                  }}
                  disabled={loading}
                  style={{ flex: 1, minWidth: '100px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-display">
              <div className="profile-field">
                <span className="profile-label">Name</span>
                <span className="profile-value">{profile.name}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Phone</span>
                <span className="profile-value">{profile.phone || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Address</span>
                <span className="profile-value">{profile.address || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Aadhaar</span>
                <span className="profile-value">{profile.aadhaar || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">PAN</span>
                <span className="profile-value">{profile.pan || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Company Code</span>
                <span className="profile-value">{profile.companyCode || 'Not assigned'}</span>
              </div>

              <div className="section-divider"></div>

              <div className="profile-field">
                <span className="profile-label">Account Number</span>
                <span className="profile-value">{profile.bankDetails?.accountNumber || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">IFSC Code</span>
                <span className="profile-value">{profile.bankDetails?.ifscCode || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Bank Name</span>
                <span className="profile-value">{profile.bankDetails?.bankName || 'Not set'}</span>
              </div>
              <div className="profile-field">
                <span className="profile-label">Account Holder</span>
                <span className="profile-value">{profile.bankDetails?.accountHolderName || 'Not set'}</span>
              </div>
            </div>
          )}
        </section>

        {/* Password Change Section */}
        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="form-grid">
              <div className="form-group">
                <label>Current Password *</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-pill btn-primary btn-full">
              Change Password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default EmployeeProfile;
