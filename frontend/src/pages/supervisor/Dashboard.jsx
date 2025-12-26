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
      setCompanies(response.data);
      if (response.data.length > 0) {
        setSelectedCompanyId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await attendanceAPI.getEmployees({ companyId: selectedCompanyId });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadTodayAttendance = async () => {
    try {
      const response = await attendanceAPI.getTodayAttendance();
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

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Supervisor Dashboard</h1>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
          <label style={{ marginRight: '15px', fontWeight: 'bold' }}>Select Company:</label>
          <select
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '14px',
              minWidth: '250px'
            }}
          >
            <option value="">Choose a company</option>
            {companies.map((comp) => (
              <option key={comp._id} value={comp._id}>
                {comp.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            className={`btn ${activeTab === 'today' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('today')}
            style={{ marginRight: '10px' }}
          >
            Today's Attendance
          </button>
          <button
            className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('employees')}
          >
            Company Employees
          </button>
        </div>

        {activeTab === 'today' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Today's Attendance</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
                disabled={!selectedCompanyId}
              >
                Mark Attendance
              </button>
            </div>

            {!selectedCompanyId ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Please select a company above to mark attendance
              </div>
            ) : (
              <table className="table">
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
                  {todayAttendance.length > 0 ? (
                    todayAttendance.map((att) => (
                      <tr key={att._id}>
                        <td>{att.employeeId?.name}</td>
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
                        No attendance marked today
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>
              {selectedCompanyId ? 'Company Employees' : 'Select a company to view employees'}
            </h2>

            {!selectedCompanyId ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                Please select a company above to view employees
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Assignment End</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length > 0 ? (
                    employees.map((emp) => (
                      <tr key={emp._id}>
                        <td>{emp.name}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone || '-'}</td>
                        <td>{emp.endDate ? new Date(emp.endDate).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center' }}>
                        No employees assigned to this company
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {showModal && selectedCompanyId && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Mark Attendance</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Employee</label>
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
                  <label>Date</label>
                  <input
                    type="date"
                    value={attendanceForm.date}
                    onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
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
                    rows="3"
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Mark Attendance'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SupervisorDashboard;
