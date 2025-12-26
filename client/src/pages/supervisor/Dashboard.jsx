import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { attendanceAPI } from '../../services/api';

function SupervisorDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('today');
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: '',
    companyId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: '',
    checkInTime: '',
    checkOutTime: ''
  });

  // Inject StaffHub Admin Dashboard styles - FULLY RESPONSIVE
  useEffect(() => {
    const styleId = 'supervisor-dashboard-styles';
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

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      }

      .supervisor-root {
        min-height: 100vh;
        background: radial-gradient(circle at 10% 0, #e0f7fb 0, #f9fdff 32%, #f5fafc 60%);
      }

      .supervisor-shell {
        max-width: 1180px;
        margin: 90px auto 40px;
        padding: 0 1.5rem 3rem;
      }

      .supervisor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2rem;
        gap: 1.5rem;
      }

      .supervisor-title {
        font-size: clamp(1.75rem, 4vw, 2.05rem);
        letter-spacing: -0.02em;
        color: var(--sh-text-main);
        margin: 0 0 0.3rem;
        font-weight: 700;
      }

      .supervisor-subtitle {
        margin: 0;
        color: var(--sh-text-soft);
        font-size: 0.95rem;
      }

      .supervisor-pill {
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
        flex-shrink: 0;
      }

      .alert-chip {
        padding: 0.75rem 1.25rem;
        border-radius: 999px;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
        background: var(--sh-bg-soft);
        color: var(--sh-text-soft);
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

      .company-selector {
        background: var(--sh-surface);
        border-radius: var(--sh-radius-lg);
        padding: 1.5rem 1.8rem;
        margin-bottom: 2rem;
        border: 1px solid var(--sh-border-subtle);
        box-shadow: var(--sh-shadow-subtle);
      }

      .company-selector h3 {
        margin: 0 0 1rem 0;
        color: var(--sh-text-main);
        font-size: 1.1rem;
        font-weight: 600;
      }

      .company-single {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        color: var(--sh-text-main);
        font-weight: 600;
        font-size: 1.05rem;
      }

      .company-select-wrapper {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .company-select-label {
        font-weight: 500;
        color: var(--sh-text-main);
        white-space: nowrap;
        font-size: 0.95rem;
      }

      .company-select {
        padding: 0.75rem 1.1rem;
        border: 1px solid var(--sh-border-subtle);
        border-radius: 12px;
        background: var(--sh-surface);
        font-size: 0.95rem;
        min-width: 280px;
        flex: 1;
        max-width: 400px;
        transition: all 0.2s ease;
      }

      .company-select:focus {
        outline: none;
        border-color: var(--sh-primary);
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
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

      .tabs-scroll::-webkit-scrollbar {
        display: none;
      }

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
        margin-bottom: 1.5rem;
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

      .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
      }

      .btn-full {
        width: 100%;
        justify-content: center;
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
        font-weight: 600;
      }

      .empty-state p {
        margin: 0;
        font-size: 1rem;
        opacity: 0.8;
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

      .ui-table th,
      .ui-table td {
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

      .ui-table tbody tr:nth-child(even) {
        background: #f9fafb;
      }

      .ui-table tbody tr:hover {
        background: #eef7fb;
      }

      .status-pill {
        border-radius: var(--sh-radius-pill);
        padding: 0.35rem 0.9rem;
        font-size: 0.78rem;
        font-weight: 600;
        text-transform: uppercase;
        border: 1px solid transparent;
      }

      .status-pill-success {
        background: #ecfdf5;
        color: #15803d;
        border-color: #bbf7d0;
      }

      .status-pill-danger {
        background: #fef2f2;
        color: #b91c1c;
        border-color: #fecaca;
      }

      .status-pill-warning {
        background: #fef3c7;
        color: #92400e;
        border-color: #fcd34d;
      }

      .modal-layer {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1.5rem;
        animation: modalFadeIn 0.2s ease;
      }

      @keyframes modalFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .modal-card {
        background: #ffffff;
        border-radius: var(--sh-radius-lg);
        border: 1px solid rgba(226, 237, 244, 0.95);
        box-shadow: var(--sh-shadow-soft);
        width: 100%;
        max-width: 540px;
        max-height: 90vh;
        overflow: hidden;
        animation: modalSlideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }

      @keyframes modalSlideUp {
        from {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .modal-header {
        padding: 1.6rem 1.8rem 1.2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--sh-border-subtle);
      }

      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        color: var(--sh-text-main);
        font-weight: 600;
      }

      .icon-btn {
        border-radius: 999px;
        width: 40px;
        height: 40px;
        border: none;
        cursor: pointer;
        background: #f9fafb;
        font-size: 1.4rem;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--sh-text-soft);
        transition: all 0.2s ease;
        flex-shrink: 0;
      }

      .icon-btn:hover {
        background: #e5eff8;
        color: var(--sh-text-main);
        transform: scale(1.05);
      }

      .modal-form {
        padding: 1.8rem;
        overflow-y: auto;
        max-height: 70vh;
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
        box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15);
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1.2rem;
      }

      /* PERFECT RESPONSIVE BREAKPOINTS */
      
      /* Large Desktop */
      @media (min-width: 1200px) {
        .supervisor-shell {
          padding: 0 2rem 3rem;
        }
      }

      /* Desktop */
      @media (max-width: 1024px) {
        .supervisor-shell {
          padding: 0 1.25rem 3rem;
        }
      }

      /* Tablet */
      @media (max-width: 900px) {
        .supervisor-shell {
          margin-top: 82px;
          padding: 0 1rem 2rem;
        }
        .supervisor-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
          text-align: left;
        }
        .tabs-scroll {
          justify-content: center;
        }
        .company-select {
          min-width: 100%;
          max-width: none;
        }
        .company-select-wrapper {
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
        }
      }

      /* Mobile */
      @media (max-width: 720px) {
        .supervisor-shell {
          margin-top: 75px;
          padding: 0 1rem 2rem;
        }
        
        .panel {
          padding: 1.5rem 1.25rem;
        }
        
        .panel-header {
          flex-direction: column;
          align-items: stretch;
          gap: 1rem;
          text-align: center;
        }
        
        .tabs-scroll {
          flex-direction: column;
          align-items: stretch;
          gap: 0.5rem;
        }
        
        .tab-chip {
          justify-content: center;
          padding: 0.75rem 1rem;
        }
        
        .company-selector {
          padding: 1.25rem 1rem;
        }
        
        .form-row {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        
        .ui-table {
          min-width: 100%;
          font-size: 0.88rem;
        }
        
        .ui-table th,
        .ui-table td {
          padding: 0.9rem 0.8rem;
        }
        
        .company-select-wrapper {
          gap: 0.5rem;
        }
      }

      /* Small Mobile */
      @media (max-width: 480px) {
        .panel {
          padding: 1.25rem 1rem;
        }
        
        .ui-table th {
          font-size: 0.75rem;
          padding: 0.75rem 0.6rem;
        }
        
        .ui-table td {
          padding: 0.75rem 0.6rem;
          font-size: 0.85rem;
        }
        
        .status-pill {
          padding: 0.3rem 0.7rem;
          font-size: 0.7rem;
        }
        
        .modal-card {
          margin: 1rem;
          max-width: calc(100% - 2rem);
        }
      }

      /* Loading state */
      .loading {
        opacity: 0.6;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    loadCompanies();
    loadTodayAttendance();
  }, []);

  useEffect(() => {
    if (selectedCompanyId) {
      loadEmployees();
      setAttendanceForm(prev => ({ ...prev, companyId: selectedCompanyId }));
    }
  }, [selectedCompanyId]);

  const loadCompanies = async () => {
    try {
      const response = await attendanceAPI.getCompanies();
      console.log(response);
      setCompanies(response.data);
      if (response.data.length === 1) {
        setSelectedCompanyId(response.data[0]._id);
        setAttendanceForm(prev => ({ ...prev, companyId: response.data[0]._id }));
      } else {
        setSelectedCompanyId('');
        setAttendanceForm(prev => ({ ...prev, companyId: '' }));
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await attendanceAPI.getEmployees({ 
        companyId: selectedCompanyId, 
        date: attendanceForm.date 
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const response = await attendanceAPI.getTodayAttendance();
      console.log(response);
      setTodayAttendance(response.data);
    } catch (error) {
      console.error('Error loading today attendance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!selectedCompanyId) {
      setMessage('Please select a company first');
      setLoading(false);
      return;
    }

    try {
      const formData = {
        ...attendanceForm,
        companyId: selectedCompanyId
      };
      await attendanceAPI.markAttendance(formData);
      setMessage('Attendance marked successfully');
      setShowModal(false);
      setAttendanceForm({
        employeeId: '',
        companyId: selectedCompanyId,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        remarks: '',
        checkInTime: '',
        checkOutTime: ''
      });
      loadTodayAttendance();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="supervisor-root">
        <Navbar user={user} onLogout={onLogout} />
        <main className="supervisor-shell">
          <div className="panel">
            <div className="empty-state">
              <h3>No Companies Assigned</h3>
              <p>You are not assigned to any company yet.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="supervisor-root">
      <Navbar user={user} onLogout={onLogout} />

      <main className="supervisor-shell">
        <header className="supervisor-header">
          <div>
            <h1 className="supervisor-title">Supervisor Dashboard</h1>
            <p className="supervisor-subtitle">
              Manage attendance and view company employees
            </p>
          </div>
          <span className="supervisor-pill">S</span>
        </header>

        {message && (
          <div className={`alert-chip ${message.toLowerCase().includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="company-selector">
          <h3>Company Selection</h3>
          {companies.length === 1 ? (
            <div className="company-single">
              <span style={{fontWeight: 600, color: 'var(--sh-accent-green)'}}>✓</span>
              {companies[0].name}
            </div>
          ) : (
            <div className="company-select-wrapper">
              <label className="company-select-label">Select Company:</label>
              <select
                className="company-select"
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Choose a company</option>
                {companies.map((comp) => (
                  <option key={comp._id} value={comp._id}>
                    {comp.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="tabs-scroll">
          <button 
            className={`tab-chip ${activeTab === 'today' ? 'tab-chip-active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            Today's Attendance
          </button>
          <button 
            className={`tab-chip ${activeTab === 'employees' ? 'tab-chip-active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Company Employees
          </button>
        </div>

        {activeTab === 'today' && (
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Today's Attendance</h2>
              <button
                className="btn-pill btn-primary"
                onClick={() => setShowModal(true)}
                disabled={!selectedCompanyId}
              >
                Mark Attendance
              </button>
            </div>

            {!selectedCompanyId ? (
              <div className="empty-state">
                <h3>Please select a company</h3>
                <p>Select a company above to mark attendance</p>
              </div>
            ) : todayAttendance.length === 0 ? (
              <div className="empty-state">
                <h3>No attendance records</h3>
                <p>No attendance marked today for selected company</p>
              </div>
            ) : (
              <div className="table-shell">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Status</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAttendance.map((att) => (
                      <tr key={att._id}>
                        <td>{att.employeeId?.name || 'N/A'}</td>
                        <td>
                          <span className={`status-pill ${
                            att.status === 'Present' ? 'status-pill-success' :
                            att.status === 'Absent' ? 'status-pill-danger' : 'status-pill-warning'
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
            )}
          </section>
        )}

        {activeTab === 'employees' && (
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Company Employees</h2>
            </div>

            {!selectedCompanyId ? (
              <div className="empty-state">
                <h3>Please select a company</h3>
                <p>Select a company above to view employees</p>
              </div>
            ) : employees.length === 0 ? (
              <div className="empty-state">
                <h3>No employees found</h3>
                <p>No employees assigned to this company</p>
              </div>
            ) : (
              <div className="table-shell">
                <table className="ui-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Assignment End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone || '-'}</td>
                        <td>{emp.endDate ? new Date(emp.endDate).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* Modal - FIXED CLASS ISSUE */}
        {showModal && selectedCompanyId && (
          <div className="modal-layer" onClick={() => setShowModal(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Mark Attendance</h3>
                <button className="icon-btn" onClick={() => setShowModal(false)}>
                  ×
                </button>
              </div>
              <div className="modal-form">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Employee *</label>
                    <select
                      value={attendanceForm.employeeId}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })}
                      required
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      value={attendanceForm.date}
                      onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        value={attendanceForm.status}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, status: e.target.value })}
                        required
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Half-day">Half-day</option>
                        <option value="Leave">Leave</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Check In Time</label>
                      <input
                        type="time"
                        value={attendanceForm.checkInTime}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, checkInTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Check Out Time</label>
                      <input
                        type="time"
                        value={attendanceForm.checkOutTime}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, checkOutTime: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Remarks</label>
                      <textarea
                        value={attendanceForm.remarks}
                        onChange={(e) => setAttendanceForm({ ...attendanceForm, remarks: e.target.value })}
                        placeholder="Optional remarks..."
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-pill btn-primary btn-full" 
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Mark Attendance'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SupervisorDashboard;
