import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { authAPI } from '../../services/api';

function CompanyProfile({ user, onLogout }) {
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

  // inject internal CSS once - SAME as AdminProfile
  useEffect(() => {
    const styleId = 'company-profile-styles';
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
        --sh-accent-green: #10b981;
        --sh-danger: #ef4444;
        --sh-success: #166534;
        --sh-radius-lg: 24px;
        --sh-radius-md: 16px;
        --sh-radius-pill: 999px;
        --sh-shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
        --sh-shadow-subtle: 0 10px 30px rgba(15, 23, 42, 0.05);
      }

      .company-root {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 0, #e0f7fb 0, #f9fdff 32%, #f5fafc 60%);
      }

      .company-shell {
        max-width: 1180px;
        margin: 90px auto 40px;
        padding: 0 1.5rem 3rem;
      }

      .company-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.8rem;
        gap: 1.5rem;
      }

      .company-title {
        font-size: 2.05rem;
        letter-spacing: -0.02em;
        color: var(--sh-text-main);
        margin: 0 0 0.3rem;
      }

      .company-subtitle {
        margin: 0;
        color: var(--sh-text-soft);
        font-size: 0.95rem;
      }

      .company-pill {
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
      }

      .alert-chip {
        padding: 0.65rem 1rem;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        font-size: 0.85rem;
        margin-bottom: 1rem;
        background: var(--sh-bg-soft);
        color: var(--sh-text-soft);
        border: 1px solid var(--sh-border-subtle);
      }

      .alert-success {
        background: #ecfdf5;
        color: var(--sh-success);
        border-color: #bbf7d0;
      }

      .alert-error {
        background: #fef2f2;
        color: #b91c1c;
        border-color: #fecaca;
      }

      .panel {
        border-radius: var(--sh-radius-lg);
        background: rgba(255, 255, 255, 0.96);
        box-shadow: var(--sh-shadow-subtle);
        padding: 1.2rem 1.25rem 1.4rem;
        border: 1px solid rgba(226, 237, 244, 0.9);
        margin-bottom: 1.3rem;
      }

      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 0.85rem;
      }

      .panel-title {
        margin: 0;
        font-size: 1.05rem;
        color: var(--sh-text-main);
      }

      .btn-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.48rem 1.05rem;
        font-size: 0.85rem;
        border: 1px solid transparent;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        white-space: nowrap;
        transition: all 0.18s ease;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--sh-primary), var(--sh-primary-deep));
        color: #ffffff;
        box-shadow: 0 10px 24px rgba(8, 145, 178, 0.4);
      }

      .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 32px rgba(8, 145, 178, 0.55);
      }

      .btn-outline {
        background: #ffffff;
        border-color: var(--sh-border-subtle);
        color: var(--sh-text-main);
      }

      .btn-outline:hover {
        background: var(--sh-bg-soft);
      }

      .profile-summary {
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        margin-top: 0.3rem;
      }

      .profile-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
      }

      .profile-row.single {
        grid-template-columns: minmax(0, 1fr);
      }

      .profile-summary .label {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--sh-text-soft);
        margin: 0 0 0.2rem;
      }

      .profile-summary .value {
        margin: 0;
        font-size: 0.9rem;
        color: var(--sh-text-main);
      }

      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: var(--sh-radius-pill);
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        display: inline-block;
      }

      .badge-success {
        background: #ecfdf5;
        color: var(--sh-accent-green);
        border: 1px solid #bbf7d0;
      }

      .badge-danger {
        background: #fef2f2;
        color: var(--sh-danger);
        border: 1px solid #fecaca;
      }

      .modal-form {
        padding: 0;
        overflow: visible;
      }

      .form-group {
        margin-bottom: 0.75rem;
      }

      .form-group label {
        display: block;
        font-size: 0.8rem;
        color: var(--sh-text-soft);
        margin-bottom: 0.25rem;
      }

      .form-group input,
      .form-group textarea {
        width: 100%;
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
        padding: 0.45rem 0.6rem;
        font-size: 0.85rem;
        outline: none;
        transition: border-color 0.16s ease, box-shadow 0.16s ease;
        background: #ffffff;
      }

      .form-group textarea {
        min-height: 70px;
        resize: vertical;
      }

      .form-group input:focus,
      .form-group textarea:focus {
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.2);
      }

      .form-group input:disabled {
        background: #f8fafc;
        color: var(--sh-text-soft);
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }

      .form-buttons {
        display: flex;
        gap: 0.6rem;
        margin-top: 0.5rem;
      }

      @media (max-width: 900px) {
        .company-shell {
          margin-top: 82px;
        }

        .company-header {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      @media (max-width: 720px) {
        .panel {
          padding: 1rem;
        }

        .form-row {
          grid-template-columns: minmax(0, 1fr);
        }

        .profile-row {
          grid-template-columns: minmax(0, 1fr);
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
      <div className="company-root">
        <Navbar user={user} onLogout={onLogout} />
        <main className="company-shell">
          <div className="panel">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="company-root">
      <Navbar user={user} onLogout={onLogout} />

      <main className="company-shell">
        <header className="company-header">
          <div>
            <h1 className="company-title">Company Profile</h1>
            <p className="company-subtitle">
              View and update your company details and password.
            </p>
          </div>
          <span className="company-pill">
            {profile.name?.[0]?.toUpperCase() || 'C'}
          </span>
        </header>

        {message && (
          <div
            className={`alert-chip ${
              message.toLowerCase().includes('success')
                ? 'alert-success'
                : 'alert-error'
            }`}
          >
            {message}
          </div>
        )}

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Company Information</h2>
            {!editing && (
              <button
                className="btn-pill btn-primary"
                onClick={() => setEditing(true)}
              >
                Edit profile
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate} className="modal-form">
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" value={profile.email} disabled />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Company Code</label>
                  <input type="text" value={profile.companyCode} disabled />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={profileForm.address}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      address: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn-pill btn-primary">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn-pill btn-outline"
                  onClick={() => {
                    setEditing(false);
                    setProfileForm({
                      name: profile.name,
                      phone: profile.phone || '',
                      address: profile.address || '',
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-summary">
              <div className="profile-row">
                <div>
                  <p className="label">Company Name</p>
                  <p className="value">{profile.name}</p>
                </div>
                <div>
                  <p className="label">Email</p>
                  <p className="value">{profile.email}</p>
                </div>
              </div>

              <div className="profile-row">
                <div>
                  <p className="label">Phone</p>
                  <p className="value">{profile.phone || 'Not set'}</p>
                </div>
                <div>
                  <p className="label">Company Code</p>
                  <p className="value">{profile.companyCode}</p>
                </div>
              </div>

              <div className="profile-row">
                <div>
                  <p className="label">Address</p>
                  <p className="value">
                    {profile.address && profile.address.trim()
                      ? profile.address
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="label">Status</p>
                  <p className="value">
                    <span className={`badge ${profile.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {profile.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordChange} className="modal-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-pill btn-primary">
              Change Password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CompanyProfile;
