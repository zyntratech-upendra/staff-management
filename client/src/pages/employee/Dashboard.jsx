import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { attendanceAPI, salaryAPI, authAPI } from '../../services/api';

function EmployeeDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendance, setAttendance] = useState([]);
  const [payslips, setPayslips] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Inject StaffHub Employee Dashboard styles - FULLY RESPONSIVE
  useEffect(() => {
    const styleId = 'employee-dashboard-styles';
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
        --sh-accent-blue: #3b82f6;
        --sh-accent-orange: #f59e0b;
        --sh-danger: #ef4444;
        --sh-radius-lg: 24px;
        --sh-radius-md: 16px;
        --sh-radius-pill: 999px;
        --sh-shadow-soft: 0 18px 45px rgba(15, 23, 42, 0.08);
        --sh-shadow-subtle: 0 10px 30px rgba(15, 23, 42, 0.05);
      }

      * { box-sizing: border-box; }

      .employee-root {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 0, #e0f7fb 0, #f9fdff 32%, #f5fafc 60%);
      }

      .employee-shell {
        max-width: 1180px;
        margin: 90px auto 40px;
        padding: 0 1.5rem 3rem;
      }

      .employee-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1.5rem;
      }

      .employee-title {
        font-size: clamp(1.75rem, 4vw, 2.05rem);
        letter-spacing: -0.02em;
        color: var(--sh-text-main);
        margin: 0 0 0.3rem;
        font-weight: 700;
      }

      .employee-subtitle {
        margin: 0;
        color: var(--sh-text-soft);
        font-size: 0.95rem;
      }

      .employee-pill {
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

      .tabs-scroll {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding: 0.5rem 0 1.5rem;
        margin-bottom: 2rem;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }

      .tabs-scroll::-webkit-scrollbar { display: none; }

      .tab-chip {
        border-radius: var(--sh-radius-pill);
        border: 1px solid transparent;
        padding: 0.65rem 1.4rem;
        font-size: 0.9rem;
        background: transparent;
        color: var(--sh-text-soft);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
        font-weight: 500;
        flex-shrink: 0;
      }

      .tab-chip:hover { 
        background: rgba(255, 255, 255, 0.9);
        border-color: var(--sh-border-subtle);
        color: var(--sh-text-main);
        transform: translateY(-1px);
      }

      .tab-chip-active {
        background: var(--sh-primary);
        color: #ffffff;
        border-color: transparent;
        box-shadow: 0 8px 25px rgba(8, 145, 178, 0.4);
        transform: translateY(-2px);
      }

      /* Stats Grid */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
      }

      .stat-card {
        background: var(--sh-surface);
        border-radius: var(--sh-radius-lg);
        padding: 1.8rem 1.5rem;
        border: 1px solid var(--sh-border-subtle);
        box-shadow: var(--sh-shadow-subtle);
        text-align: center;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
      }

      .stat-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--sh-primary), var(--sh-accent-green));
      }

      .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--sh-shadow-soft);
      }

      .stat-label {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--sh-text-soft);
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .stat-value {
        font-size: 2.25rem;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 0.25rem;
      }

      .stat-present .stat-value { color: var(--sh-accent-green); }
      .stat-absent .stat-value { color: var(--sh-danger); }
      .stat-halfday .stat-value { color: var(--sh-accent-orange); }
      .stat-leave .stat-value { color: var(--sh-accent-blue); }

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

      .filter-group {
        display: flex;
        gap: 0.75rem;
        align-items: center;
        flex-wrap: wrap;
      }

      .filter-select {
        padding: 0.65rem 1rem;
        border: 1px solid var(--sh-border-subtle);
        border-radius: 12px;
        background: var(--sh-surface);
        font-size: 0.9rem;
        min-width: 140px;
        transition: all 0.2s ease;
      }

      .filter-select:focus {
        outline: none;
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
      }

      .table-shell {
        width: 100%;
        overflow-x: auto;
        border-radius: var(--sh-radius-md);
        border: 1px solid var(--sh-border-subtle);
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
      }

      .ui-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.92rem;
        min-width: 700px;
      }

      .ui-table thead {
        background: var(--sh-bg-soft);
      }

      .ui-table th, .ui-table td {
        padding: 1.1rem 1.2rem;
        text-align: left;
      }

      .ui-table th {
        font-weight: 600;
        font-size: 0.82rem;
        color: var(--sh-text-soft);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 2px solid var(--sh-border-subtle);
        white-space: nowrap;
      }

      .ui-table tbody tr:nth-child(even) { background: #f9fafb; }
      .ui-table tbody tr:hover { background: #eef7fb; }

      .status-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.35rem 0.9rem;
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        border: 1px solid transparent;
      }

      .status-success { 
        background: #ecfdf5; 
        color: #15803d; 
        border-color: #bbf7d0; 
      }

      .status-warning { 
        background: #fef3c7; 
        color: #92400e; 
        border-color: #fcd34d; 
      }

      .profile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.8rem;
        margin-bottom: 2rem;
      }

      .profile-field {
        display: flex;
        gap: 1rem;
        padding: 1.2rem;
        background: var(--sh-bg-soft);
        border-radius: 12px;
        border: 1px solid var(--sh-border-subtle);
        margin-bottom: 1rem;
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
      }

      .salary-highlight {
        font-weight: 700;
        color: var(--sh-accent-green);
        font-size: 1.1rem;
      }

      .empty-state {
        text-align: center;
        padding: 4rem 2rem;
        color: var(--sh-text-soft);
      }

      .empty-state h3 {
        color: var(--sh-text-main);
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
      }

      /* PERFECT RESPONSIVE */
      @media (max-width: 900px) {
        .employee-shell { margin-top: 82px; padding: 0 1rem 2rem; }
        .employee-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
        .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 1.2rem; }
        .profile-grid { grid-template-columns: 1fr; }
      }

      @media (max-width: 720px) {
        .employee-shell { margin-top: 75px; padding: 0 1rem 2rem; }
        .panel { padding: 1.5rem 1.25rem; }
        .panel-header { flex-direction: column; align-items: stretch; gap: 1rem; text-align: center; }
        .tabs-scroll { flex-direction: column; align-items: stretch; gap: 0.5rem; }
        .tab-chip { justify-content: center; padding: 0.75rem 1rem; }
        .stats-grid { grid-template-columns: 1fr; }
        .filter-group { flex-direction: column; align-items: stretch; }
        .filter-select { min-width: 100%; }
        .profile-field { flex-direction: column; gap: 0.5rem; }
        .profile-label { min-width: auto; }
      }

      @media (max-width: 480px) {
        .ui-table { font-size: 0.88rem; min-width: 100%; }
        .ui-table th, .ui-table td { padding: 0.9rem 0.8rem; }
        .stat-value { font-size: 1.75rem; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    loadProfile();
    loadAttendance();
    loadPayslips();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [selectedMonth, selectedYear]);

  const loadProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const response = await attendanceAPI.getAttendanceByEmployee(user.id, {
        month: selectedMonth,
        year: selectedYear
      });
      setAttendance(response.data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadPayslips = async () => {
    try {
      const response = await salaryAPI.getMyPayslips();
      setPayslips(response.data);
    } catch (error) {
      console.error('Error loading payslips:', error);
    }
  };

  const getAttendanceStats = () => {
    const present = attendance.filter(a => a.status === 'Present').length;
    const absent = attendance.filter(a => a.status === 'Absent').length;
    const halfDay = attendance.filter(a => a.status === 'Half-day').length;
    const leave = attendance.filter(a => a.status === 'Leave').length;
    return { present, absent, halfDay, leave };
  };

  const stats = getAttendanceStats();

  if (!profile) {
    return (
      <div className="employee-root">
        <Navbar user={user} onLogout={onLogout} />
        <main className="employee-shell">
          <div style={{textAlign: 'center', padding: '4rem', color: 'var(--sh-text-soft)'}}>
            Loading dashboard...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="employee-root">
      <Navbar user={user} onLogout={onLogout} />

      <main className="employee-shell">
        <header className="employee-header">
          <div>
            <h1 className="employee-title">Employee Dashboard</h1>
            <p className="employee-subtitle">
              Welcome back, {profile.name}! Manage your attendance, salary & profile
            </p>
          </div>
          <span className="employee-pill">E</span>
        </header>

        <div className="tabs-scroll">
          <button 
            className={`tab-chip ${activeTab === 'attendance' ? 'tab-chip-active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            My Attendance
          </button>
          <button 
            className={`tab-chip ${activeTab === 'salary' ? 'tab-chip-active' : ''}`}
            onClick={() => setActiveTab('salary')}
          >
            My Payslips
          </button>
          <button 
            className={`tab-chip ${activeTab === 'profile' ? 'tab-chip-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
        </div>

        {activeTab === 'attendance' && (
          <>
            <div className="stats-grid">
              <div className="stat-card stat-present">
                <div className="stat-label">Present</div>
                <div className="stat-value">{stats.present}</div>
              </div>
              <div className="stat-card stat-absent">
                <div className="stat-label">Absent</div>
                <div className="stat-value">{stats.absent}</div>
              </div>
              <div className="stat-card stat-halfday">
                <div className="stat-label">Half-day</div>
                <div className="stat-value">{stats.halfDay}</div>
              </div>
              <div className="stat-card stat-leave">
                <div className="stat-label">Leave</div>
                <div className="stat-value">{stats.leave}</div>
              </div>
            </div>

            <section className="panel">
              <div className="panel-header">
                <h2 className="panel-title">Attendance Records</h2>
                <div className="filter-group">
                  <select
                    className="filter-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    className="filter-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return <option key={year} value={year}>{year}</option>;
                    })}
                  </select>
                </div>
              </div>

              {attendance.length > 0 ? (
                <div className="table-shell">
                  <table className="ui-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((att) => (
                        <tr key={att._id}>
                          <td>{new Date(att.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`status-pill ${
                              att.status === 'Present' ? 'status-success' :
                              att.status === 'Absent' ? 'status-warning' : 'status-warning'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td>{att.checkInTime || '-'}</td>
                          <td>{att.checkOutTime || '-'}</td>
                          <td>{att.remarks || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No attendance records</h3>
                  <p>No attendance found for selected month</p>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'salary' && (
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">My Payslips</h2>
            </div>
            {payslips.length > 0 ? (
              <div className="table-shell">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Month/Year</th>
                      <th>Days Worked</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payslips.map((sal) => (
                      <tr key={sal._id}>
                        <td>
                          {new Date(2000, sal.month - 1, 1).toLocaleString('default', { month: 'long' })} {sal.year}
                        </td>
                        <td>{sal.daysWorked}</td>
                        <td className="salary-highlight">₹{sal.totalEarnings?.toFixed(2) || 0}</td>
                        <td>
                          <span className={`status-pill ${
                            sal.status === 'generated' ? 'status-success' : 'status-warning'
                          }`}>
                            {sal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No payslips available</h3>
                <p>Your payslips will appear here once generated</p>
              </div>
            )}
          </section>
        )}

        {activeTab === 'profile' && (
          <div className="profile-grid">
            <section className="panel">
              <h2 className="panel-title" style={{marginBottom: '1.5rem'}}>Personal Information</h2>
              <div>
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
              </div>
            </section>

            <section className="panel">
              <h2 className="panel-title" style={{marginBottom: '1.5rem'}}>Bank Details</h2>
              <div>
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
            </section>

            <section className="panel">
              <h2 className="panel-title" style={{marginBottom: '1.5rem'}}>Salary Structure</h2>
              <div>
                <div className="profile-field">
                  <span className="profile-label">Basic Salary</span>
                  <span className="profile-value salary-highlight">
                    ₹{profile.salaryStructure?.basicSalary || 0}
                  </span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">HRA</span>
                  <span className="profile-value">₹{profile.salaryStructure?.hra || 0}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Allowances</span>
                  <span className="profile-value">₹{profile.salaryStructure?.allowances || 0}</span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Gross Salary</span>
                  <span className="profile-value salary-highlight">
                    ₹{profile.salaryStructure?.grossSalary || 0}
                  </span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">PF</span>
                  <span className="profile-value">
                    {profile.salaryStructure?.pfApplicable 
                      ? `Yes (₹${profile.salaryStructure?.pfAmount || 0})` 
                      : 'No'}
                  </span>
                </div>
                <div className="profile-field">
                  <span className="profile-label">ESI</span>
                  <span className="profile-value">
                    {profile.salaryStructure?.esiApplicable 
                      ? `Yes (₹${profile.salaryStructure?.esiAmount || 0})` 
                      : 'No'}
                  </span>
                </div>
              </div>
            </section>

            {profile.documents && profile.documents.length > 0 && (
              <section className="panel">
                <h2 className="panel-title" style={{marginBottom: '1.5rem'}}>Documents</h2>
                <div className="table-shell">
                  <table className="ui-table">
                    <thead>
                      <tr>
                        <th>Document Name</th>
                        <th>Uploaded Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.documents.map((doc, index) => (
                        <tr key={index}>
                          <td>{doc.name}</td>
                          <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
                          <td>
                            <a 
                              href={doc.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn-pill btn-primary"
                              style={{
                                padding: '0.5rem 1.2rem', 
                                fontSize: '0.85rem',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                            >
                              View Document
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default EmployeeDashboard;
