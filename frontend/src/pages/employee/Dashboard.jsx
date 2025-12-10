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

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Employee Dashboard</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('attendance')}
            style={{ marginRight: '10px' }}
          >
            My Attendance
          </button>
          <button
            className={`btn ${activeTab === 'salary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('salary')}
            style={{ marginRight: '10px' }}
          >
            My Payslips
          </button>
          <button
            className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('profile')}
          >
            My Profile
          </button>
        </div>

        {activeTab === 'attendance' && (
          <>
            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Present</h3>
                <div className="value" style={{ color: '#16a34a' }}>{stats.present}</div>
              </div>
              <div className="stat-card">
                <h3>Absent</h3>
                <div className="value" style={{ color: '#dc2626' }}>{stats.absent}</div>
              </div>
              <div className="stat-card">
                <h3>Half-day</h3>
                <div className="value" style={{ color: '#f59e0b' }}>{stats.halfDay}</div>
              </div>
              <div className="stat-card">
                <h3>Leave</h3>
                <div className="value" style={{ color: '#3b82f6' }}>{stats.leave}</div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Attendance Records</h2>
                <div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    style={{ marginRight: '10px', padding: '8px' }}
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    style={{ padding: '8px' }}
                  >
                    {[...Array(5)].map((_, i) => {
                      const year = new Date().getFullYear() - 2 + i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <table className="table">
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
                  {attendance.length > 0 ? (
                    attendance.map((att) => (
                      <tr key={att._id}>
                        <td>{new Date(att.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge badge-${att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'danger' : 'warning'}`}>
                            {att.status}
                          </span>
                        </td>
                        <td>{att.checkInTime || '-'}</td>
                        <td>{att.checkOutTime || '-'}</td>
                        <td>{att.remarks || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center' }}>
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'salary' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>My Payslips</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Month/Year</th>
                  <th>Days Worked</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payslips.length > 0 ? (
                  payslips.map((sal) => (
                    <tr key={sal._id}>
                      <td>{new Date(2000, sal.month - 1, 1).toLocaleString('default', { month: 'long' })} {sal.year}</td>
                      <td>{sal.daysWorked}</td>
                      <td>₹{sal.grossSalary.toFixed(2)}</td>
                      <td>₹{sal.totalDeductions.toFixed(2)}</td>
                      <td>₹{sal.netSalary.toFixed(2)}</td>
                      <td>
                        <span className={`badge badge-${sal.status === 'generated' ? 'success' : 'warning'}`}>
                          {sal.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No payslips available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <>
            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>Personal Information</h2>
              <div>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || 'Not set'}</p>
                <p><strong>Address:</strong> {profile.address || 'Not set'}</p>
                <p><strong>Aadhaar:</strong> {profile.aadhaar || 'Not set'}</p>
                <p><strong>PAN:</strong> {profile.pan || 'Not set'}</p>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>Bank Details</h2>
              <div>
                <p><strong>Account Number:</strong> {profile.bankDetails?.accountNumber || 'Not set'}</p>
                <p><strong>IFSC Code:</strong> {profile.bankDetails?.ifscCode || 'Not set'}</p>
                <p><strong>Bank Name:</strong> {profile.bankDetails?.bankName || 'Not set'}</p>
                <p><strong>Account Holder:</strong> {profile.bankDetails?.accountHolderName || 'Not set'}</p>
              </div>
            </div>

            <div className="card">
              <h2 style={{ marginBottom: '20px' }}>Salary Structure</h2>
              <div>
                <p><strong>Basic Salary:</strong> ₹{profile.salaryStructure?.basicSalary || 0}</p>
                <p><strong>HRA:</strong> ₹{profile.salaryStructure?.hra || 0}</p>
                <p><strong>Allowances:</strong> ₹{profile.salaryStructure?.allowances || 0}</p>
                <p><strong>Gross Salary:</strong> ₹{profile.salaryStructure?.grossSalary || 0}</p>
                <p><strong>PF:</strong> {profile.salaryStructure?.pfApplicable ? `Yes (₹${profile.salaryStructure?.pfAmount || 0})` : 'No'}</p>
                <p><strong>ESI:</strong> {profile.salaryStructure?.esiApplicable ? `Yes (₹${profile.salaryStructure?.esiAmount || 0})` : 'No'}</p>
              </div>
            </div>

            {profile.documents && profile.documents.length > 0 && (
              <div className="card">
                <h2 style={{ marginBottom: '20px' }}>Documents</h2>
                <table className="table">
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
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
