import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { companyAPI, salaryAPI } from '../../services/api';

function CompanyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [salaryForm, setSalaryForm] = useState({
    employeeId: '',
    assignmentId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadEmployees();
    loadSupervisors();
    loadAssignments();
    loadAttendance();
    loadSalaries();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await companyAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadSupervisors = async () => {
    try {
      const response = await companyAPI.getSupervisors();
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error loading supervisors:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await companyAPI.getAssignments();
      setAssignments(response.data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const loadAttendance = async () => {
    try {
      const response = await companyAPI.getAttendance();
      setAttendance(response.data);
    } catch (error) {
      console.error('Error loading attendance:', error);
    }
  };

  const loadSalaries = async () => {
    try {
      const response = await salaryAPI.getAllSalaries();
      setSalaries(response.data);
    } catch (error) {
      console.error('Error loading salaries:', error);
    }
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await salaryAPI.generateSalary(salaryForm);
      setMessage('Salary generated successfully');
      setShowModal(false);
      setSalaryForm({
        employeeId: '',
        assignmentId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
      loadSalaries();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate salary');
    } finally {
      setLoading(false);
    }
  };

console.log(salaries)


  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSalaryForm({ ...salaryForm, employeeId });

    const assignment = assignments.find(a => a.employeeId?._id === employeeId);
    if (assignment) {
      setSalaryForm(prev => ({ ...prev, assignmentId: assignment._id }));
    }
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Company Dashboard</h1>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <button
            className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('employees')}
            style={{ marginRight: '10px' }}
          >
            Assigned Employees
          </button>
          <button
            className={`btn ${activeTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('assignments')}
            style={{ marginRight: '10px' }}
          >
            Assignments
          </button>
          <button
            className={`btn ${activeTab === 'supervisors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('supervisors')}
            style={{ marginRight: '10px' }}
          >
            Supervisors
          </button>
          <button
            className={`btn ${activeTab === 'attendance' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('attendance')}
            style={{ marginRight: '10px' }}
          >
            Attendance
          </button>
          <button
            className={`btn ${activeTab === 'salary' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('salary')}
          >
            Salary
          </button>
        </div>

        {activeTab === 'employees' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Currently Assigned Employees</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Daily Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{new Date(emp.startDate).toLocaleDateString()}</td>
                      <td>{new Date(emp.endDate).toLocaleDateString()}</td>
                      <td>₹{emp.dailySalary}</td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No employees currently assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Assignment History</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Daily Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((assign) => (
                    <tr key={assign._id}>
                      <td>{assign.employeeId?.name}</td>
                      <td>{new Date(assign.startDate).toLocaleDateString()}</td>
                      <td>{new Date(assign.endDate).toLocaleDateString()}</td>
                      <td>₹{assign.dailySalary}</td>
                      <td>
                        <span className={`badge badge-${assign.status === 'active' ? 'success' : assign.status === 'completed' ? 'secondary' : 'danger'}`}>
                          {assign.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No assignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'supervisors' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Supervisors</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {supervisors.length > 0 ? (
                  supervisors.map((sup) => (
                    <tr key={sup._id}>
                      <td>{sup.name}</td>
                      <td>{sup.email}</td>
                      <td>{sup.phone}</td>
                      <td>
                        <span className={`badge ${sup.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {sup.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center' }}>
                      No supervisors available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="card">
            <h2 style={{ marginBottom: '20px' }}>Attendance Records</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Supervisor</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((att) => (
                    <tr key={att._id}>
                      <td>{att.employeeId?.name}</td>
                      <td>{new Date(att.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'danger' : 'warning'}`}>
                          {att.status}
                        </span>
                      </td>
                      <td>{att.supervisorId?.name}</td>
                      <td>{att.checkInTime || '-'}</td>
                      <td>{att.checkOutTime || '-'}</td>
                      <td>{att.remarks || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center' }}>
                      No attendance records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Salary Records</h2>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Generate Salary
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month/Year</th>
                  <th>Days Worked</th>
                  <th>Daily Salary</th>
                  <th>Total Earnings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {salaries.length > 0 ? (
                  salaries.map((sal) => (
                    <tr key={sal._id}>
                      <td>{sal.employeeId?.name}</td>
                      <td>{sal.month}/{sal.year}</td>
                      <td>{sal.daysWorked}</td>
                      <td>₹{sal.dailySalary}</td>
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
                      No salary records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && modalType === 'salary' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Generate Salary</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleGenerateSalary}>
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={salaryForm.employeeId}
                    onChange={handleEmployeeChange}
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

                {salaryForm.assignmentId && (
                  <div className="form-group">
                    <label>Daily Salary</label>
                    <input
                      type="text"
                      value={
                        assignments.find(a => a._id === salaryForm.assignmentId)?.dailySalary || ''
                      }
                      disabled
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Month</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={salaryForm.year}
                    onChange={(e) => setSalaryForm({ ...salaryForm, year: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Salary'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && !modalType && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Generate Salary</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleGenerateSalary}>
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={salaryForm.employeeId}
                    onChange={handleEmployeeChange}
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

                {salaryForm.assignmentId && (
                  <div className="form-group">
                    <label>Daily Salary</label>
                    <input
                      type="text"
                      value={
                        assignments.find(a => a._id === salaryForm.assignmentId)?.dailySalary || ''
                      }
                      disabled
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Month</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={salaryForm.year}
                    onChange={(e) => setSalaryForm({ ...salaryForm, year: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Salary'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDashboard;
