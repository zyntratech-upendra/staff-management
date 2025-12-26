import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { authAPI } from '../../services/api';

function SupervisorProfile({ user, onLogout }) {
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
    address: ''
  });

  // Inject StaffHub Admin Dashboard styles
  useEffect(() => {
    const styleId = 'supervisor-profile-styles';
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
        --sh-warning-soft: #fef3c7;
        --sh-radius-lg: 24px;
        --sh-radius-md: 16px;
        --sh-radius-pill: 999px;
        --sh-shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
        --sh-shadow-subtle: 0 10px 30px rgba(15, 23, 42, 0.05);
      }

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
        font-size: 2.05rem;
        letter-spacing: -0.02em;
        color: var(--sh-text-main);
        margin: 0 0 0.3rem;
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
        background: linear-gradient(145deg, var(--sh-primary), var(--sh-primary-deep));
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-weight: 700;
        letter-spacing: 0.08em;
        box-shadow: var(--sh-shadow-soft);
        content: 'S';
      }

      .alert-chip {
        padding: 0.65rem 1rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
        background: var(--sh-bg-soft);
        color: var(--sh-text-soft);
        border: 1px solid var(--sh-border-subtle);
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

      .profile-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.8rem;
        margin-bottom: 2rem;
      }

      .panel {
        border-radius: var(--sh-radius-lg);
        background: rgba(255, 255, 255, 0.96);
        box-shadow: var(--sh-shadow-subtle);
        padding: 2rem 2.2rem;
        border: 1px solid rgba(226, 237, 244, 0.9);
        overflow: hidden;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--sh-border-subtle);
      }

      .panel-title {
        margin: 0;
        font-size: 1.25rem;
        color: var(--sh-text-main);
        font-weight: 600;
      }

      .profile-view {
        display: grid;
        gap: 1.2rem;
      }

      .profile-field {
        display: flex;
        gap: 0.8rem;
        padding: 1rem;
        background: var(--sh-bg-soft);
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
      }

      .profile-label {
        font-weight: 600;
        color: var(--sh-text-main);
        min-width: 120px;
        font-size: 0.95rem;
      }

      .profile-value {
        color: var(--sh-text-soft);
        font-size: 0.95rem;
        flex: 1;
      }

      .btn-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.55rem 1.3rem;
        font-size: 0.88rem;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        white-space: nowrap;
        transition: all 0.18s ease;
        font-weight: 500;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--sh-primary), var(--sh-primary-deep));
        color: #ffffff;
        box-shadow: 0 10px 24px rgba(8, 145, 178, 0.4);
      }

      .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 14px 32px rgba(8, 145, 178, 0.55);
      }

      .btn-secondary {
        background: #ffffff;
        border-color: var(--sh-border-subtle);
        color: var(--sh-text-main);
      }

      .btn-secondary:hover {
        background: var(--sh-bg-soft);
        border-color: var(--sh-primary);
      }

      .btn-group {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      .form-group {
        margin-bottom: 1.4rem;
      }

      .form-group label {
        display: block;
        font-size: 0.9rem;
        color: var(--sh-text-soft);
        margin-bottom: 0.5rem;
        font-weight: 500;
      }

      .form-group input,
      .form-group textarea,
      .form-group select {
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
        padding: 0.75rem 1.1rem;
        font-size: 0.95rem;
        outline: none;
        transition: all 0.18s ease;
        background: var(--sh-surface);
        box-sizing: border-box;
      }

      .form-group textarea {
        min-height: 100px;
        resize: vertical;
      }

      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
      }

      .form-group input:disabled {
        background: #f8fafc;
        color: var(--sh-text-soft);
        cursor: not-allowed;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.2rem;
      }

      .password-hint {
        background: var(--sh-primary-soft);
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 8px;
        padding: 0.8rem 1rem;
        font-size: 0.85rem;
        color: var(--sh-primary-deep);
        margin-top: 0.5rem;
      }

      .loading {
        text-align: center;
        padding: 3rem;
        color: var(--sh-text-soft);
      }

      .modal-layer {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1.5rem;
      }

      /* Responsive */
      @media (max-width: 900px) {
        .profile-shell {
          margin-top: 82px;
        }
        .profile-header {
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }
        .profile-grid {
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
      }

      @media (max-width: 720px) {
        .panel {
          padding: 1.5rem 1.5rem;
        }
        .panel-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }
        .btn-group {
          width: 100%;
          justify-content: stretch;
        }
        .btn-pill {
          flex: 1;
          justify-content: center;
        }
        .form-row {
          grid-template-columns: 1fr;
        }
        .profile-field {
          flex-direction: column;
          gap: 0.5rem;
        }
        .profile-label {
          min-width: auto;
          font-size: 0.9rem;
        }
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
        name: response.data.name,
        phone: response.data.phone || '',
        address: response.data.address || ''
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
    return (
      <div className="profile-root">
        <Navbar user={user} onLogout={onLogout} />
        <main className="profile-shell">
          <div className="loading">Loading profile...</div>
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
            <h1 className="profile-title">Supervisor Profile</h1>
            <p className="profile-subtitle">Manage your account information and security</p>
          </div>
          <span className="profile-pill">S</span>
        </header>

        {message && (
          <div className={`alert-chip ${message.toLowerCase().includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="profile-grid">
          {/* Profile Information Card */}
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Profile Information</h2>
              {!editing && (
                <button className="btn-pill btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
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
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="btn-group">
                  <button type="submit" className="btn-pill btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-pill btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setMessage('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-view">
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
                  <span className="profile-label">Company Code</span>
                  <span className="profile-value">{profile.companyCode}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Role</span>
                  <span className="profile-value">{profile.role}</span>
                </div>
              </div>
            )}
          </section>

          {/* Change Password Card */}
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password *</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                  <div className="password-hint">
                    Password must be at least 8 characters long
                  </div>
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

              <button type="submit" className="btn-pill btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                Change Password
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SupervisorProfile;
