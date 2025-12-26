import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI, assignmentAPI, salaryAPI, attendanceAPI } from '../../services/api';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [freeEmployees, setFreeEmployees] = useState([]);
  const [employeeSummary, setEmployeeSummary] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const now = new Date();
  const [summaryRange, setSummaryRange] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear()
  });
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [presentEmployees, setPresentEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstNumber: '',
    password: ''
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    aadhaar: '',
    pan: ''
  });

  const [supervisorForm, setSupervisorForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    companyId: ''
  });
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [reassignCompanyId, setReassignCompanyId] = useState('');

  const [assignmentForm, setAssignmentForm] = useState({
    employeeId: '',
    companyId: '',
    startDate: '',
    endDate: '',
    dailySalary: '',
    notes: ''
  });

  const [salaryForm, setSalaryForm] = useState({
    assignmentId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    loadStats();
    loadCompanies();
    loadEmployees();
    loadSupervisors();
    loadAssignments();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadCompanies = async () => {
    try {
      const response = await adminAPI.getCompanies();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await adminAPI.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const loadSupervisors = async () => {
    try {
      const response = await adminAPI.getSupervisors();
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error loading supervisors:', error);
    }
  };

  const loadAssignments = async () => {
    try {
      const response = await assignmentAPI.getAllAssignments();
      setAssignments(response.data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const loadEmployeeSummary = async (month, year) => {
    setSummaryLoading(true);
    setEmployeeSummary([]);
    try {
      const empResp = await adminAPI.getEmployees();
      const emps = empResp.data || [];
      const summaryPromises = emps.map(async (emp) => {
        try {
          const attResp = await attendanceAPI.getAttendanceByEmployee(emp._id, {
            month,
            year
          });
          const attendanceRecords = attResp.data || [];
          const daysPresent =
            attendanceRecords.filter(
              (r) => r.status && r.status.toLowerCase().includes('present')
            ).length || attendanceRecords.length;
          const salResp = await salaryAPI.getSalaryByEmployee(emp._id, {
            month,
            year
          });
          const salaries = salResp.data || [];
          const totalSalary = salaries.reduce(
            (s, x) => s + (x.totalEarnings || x.totalAmount || x.amount || 0),
            0
          );
          return { employee: emp, daysPresent, totalSalary };
        } catch (err) {
          return { employee: emp, daysPresent: 0, totalSalary: 0 };
        }
      });
      const summaries = await Promise.all(summaryPromises);
      setEmployeeSummary(summaries);
    } catch (error) {
      console.error('Error loading employee summary:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  const loadPresentEmployeesByDate = async (date) => {
    try {
      const resp = await adminAPI.getAttendanceByDate({ date });
      const records = resp.data || [];
      const present = records.map((r) => ({
        _id: r.employeeId?._id || r.employeeId,
        name: r.employeeId?.name,
        email: r.employeeId?.email,
        phone: r.employeeId?.phone
      }));
      setPresentEmployees(present);
    } catch (error) {
      console.error('Error loading present employees for date:', error);
      setPresentEmployees([]);
    }
  };

  const loadFreeEmployees = async () => {
    try {
      const response = await assignmentAPI.getFreeEmployees();
      setFreeEmployees(response.data);
    } catch (error) {
      console.error('Error loading free employees:', error);
    }
  };

  const handleInputChange = (e) => {
    setCompanyForm({
      ...companyForm,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterCompany = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.registerCompany(companyForm);
      setMessage('Company registered successfully');
      setShowModal(false);
      setCompanyForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        gstNumber: '',
        password: ''
      });
      loadCompanies();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to register company'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.registerEmployee(employeeForm);
      setMessage('Employee registered successfully');
      setShowModal(false);
      setEmployeeForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        aadhaar: '',
        pan: ''
      });
      loadEmployees();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to register employee'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSupervisor = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await adminAPI.registerSupervisor(supervisorForm);
      setMessage('Supervisor registered successfully');
      setShowModal(false);
      setSupervisorForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        companyId: ''
      });
      loadSupervisors();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to register supervisor'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupervisor = async (supervisorId) => {
    if (!window.confirm('Delete this supervisor? This action cannot be undone.'))
      return;
    setLoading(true);
    setMessage('');
    try {
      await adminAPI.deleteSupervisor(supervisorId);
      setMessage('Supervisor deleted successfully');
      loadSupervisors();
      loadCompanies();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to delete supervisor'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReassignSupervisor = async (e) => {
    e.preventDefault();
    if (!selectedSupervisor) return;
    setLoading(true);
    setMessage('');
    try {
      await adminAPI.updateSupervisor(selectedSupervisor._id, {
        companyId: reassignCompanyId
      });
      setMessage('Supervisor reassigned successfully');
      setShowModal(false);
      setSelectedSupervisor(null);
      setReassignCompanyId('');
      loadSupervisors();
      loadCompanies();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to reassign supervisor'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await assignmentAPI.createAssignment(assignmentForm);
      setMessage('Assignment created successfully');
      setShowModal(false);
      setAssignmentForm({
        employeeId: '',
        companyId: '',
        startDate: '',
        endDate: '',
        dailySalary: '',
        notes: ''
      });
      loadAssignments();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to create assignment'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const assignment = assignments.find(
        (a) => a._id === salaryForm.assignmentId
      );
      if (!assignment) throw new Error('Assignment not found');

      const payload = {
        employeeId: assignment.employeeId?._id || assignment.employeeId,
        assignmentId: salaryForm.assignmentId,
        month: salaryForm.month,
        year: salaryForm.year,
        companyId: assignment.companyId?._id || assignment.companyId
      };

      await salaryAPI.generateSalary(payload);
      setMessage('Salary generated successfully');
      setShowModal(false);
      setSalaryForm({
        assignmentId: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          'Failed to generate salary'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (companyId) => {
    try {
      await adminAPI.toggleCompanyStatus(companyId);
      setMessage('Company status updated successfully');
      loadCompanies();
      loadStats();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to update status'
      );
    }
  };

  const openModal = (type, extra = {}) => {
    if (type === 'assignment') {
      loadFreeEmployees();
    }
    if (type === 'reassign-supervisor' && extra.supervisor) {
      setSelectedSupervisor(extra.supervisor);
      setReassignCompanyId(extra.supervisor.companyId?._id || '');
    }
    setModalType(type);
    setShowModal(true);
  };

  const openEmployeeSummary = () => {
    setActiveTab('employee-summary');
    loadEmployeeSummary(summaryRange.month, summaryRange.year);
  };

  const openAttendanceByDate = (dateParam) => {
    const dateToUse = dateParam || attendanceDate;
    setActiveTab('attendance-by-date');
    loadPresentEmployeesByDate(dateToUse);
  };

  return (
    <div className="admin-page">
      <Navbar user={user} onLogout={onLogout} />

      <div className="admin-shell">
        

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

        <div className="tab-strip">
          <button
            className={`chip-tab ${
              activeTab === 'stats' ? 'chip-tab-active' : ''
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'companies' ? 'chip-tab-active' : ''
            }`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'employees' ? 'chip-tab-active' : ''
            }`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'supervisors' ? 'chip-tab-active' : ''
            }`}
            onClick={() => setActiveTab('supervisors')}
          >
            Supervisors
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'assignments' ? 'chip-tab-active' : ''
            }`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'employee-summary' ? 'chip-tab-active' : ''
            }`}
            onClick={openEmployeeSummary}
          >
            Employee Summary
          </button>
          <button
            className={`chip-tab ${
              activeTab === 'attendance-by-date' ? 'chip-tab-active' : ''
            }`}
            onClick={() => openAttendanceByDate()}
          >
            Attendance By Date
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="dashboard-grid">
            <div className="stat-card glass">
              <p className="stat-label">Total Companies</p>
              <p className="stat-value">{stats.totalCompanies}</p>
            </div>
            <div className="stat-card glass">
              <p className="stat-label">Active Companies</p>
              <p className="stat-value">{stats.activeCompanies}</p>
            </div>
            <div className="stat-card glass">
              <p className="stat-label">Total Employees</p>
              <p className="stat-value">{stats.totalEmployees}</p>
            </div>
            <div className="stat-card glass">
              <p className="stat-label">Total Supervisors</p>
              <p className="stat-value">{stats.totalSupervisors}</p>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Companies</h2>
              <button
                className="btn-primary"
                onClick={() => openModal('company')}
              >
                + Register Company
              </button>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Code</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company._id}>
                      <td>{company.name}</td>
                      <td>{company.email}</td>
                      <td>{company.phone}</td>
                      <td>{company.companyCode}</td>
                      <td>
                        <span
                          className={`pill ${
                            company.isActive ? 'pill-success' : 'pill-danger'
                          }`}
                        >
                          {company.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className={`btn-soft ${
                            company.isActive ? 'btn-soft-danger' : 'btn-soft-ok'
                          }`}
                          onClick={() => handleToggleStatus(company._id)}
                        >
                          {company.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!companies.length && (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No companies yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Employees</h2>
              <button
                className="btn-primary"
                onClick={() => openModal('employee')}
              >
                + Register Employee
              </button>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Aadhaar</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.aadhaar || '-'}</td>
                      <td>
                        <span
                          className={`pill ${
                            emp.isActive ? 'pill-success' : 'pill-danger'
                          }`}
                        >
                          {emp.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!employees.length && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No employees yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'supervisors' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Supervisors</h2>
              <button
                className="btn-primary"
                onClick={() => openModal('supervisor')}
              >
                + Register Supervisor
              </button>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Company</th>
                    <th>Actions</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisors.map((sup) => (
                    <tr key={sup._id}>
                      <td>{sup.name}</td>
                      <td>{sup.email}</td>
                      <td>{sup.phone}</td>
                      <td>{sup.companyId?.name || '-'}</td>
                      <td className="actions-cell">
                        <button
                          className="btn-soft"
                          onClick={() =>
                            openModal('reassign-supervisor', {
                              supervisor: sup
                            })
                          }
                        >
                          Reassign
                        </button>
                        <button
                          className="btn-soft btn-soft-danger"
                          onClick={() => handleDeleteSupervisor(sup._id)}
                        >
                          Delete
                        </button>
                      </td>
                      <td>
                        <span
                          className={`pill ${
                            sup.isActive ? 'pill-success' : 'pill-danger'
                          }`}
                        >
                          {sup.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!supervisors.length && (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No supervisors yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Assignments</h2>
              <div className="panel-actions">
                <button
                  className="btn-primary"
                  onClick={() => openModal('assignment')}
                >
                  + Create Assignment
                </button>
                <button
                  className="btn-outline"
                  onClick={() => openModal('salary')}
                >
                  Generate Salary
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Company</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Daily Salary</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assign) => (
                    <tr key={assign._id}>
                      <td>{assign.employeeId?.name}</td>
                      <td>{assign.companyId?.name}</td>
                      <td>
                        {new Date(
                          assign.startDate
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {new Date(assign.endDate).toLocaleDateString()}
                      </td>
                      <td>₹{assign.dailySalary}</td>
                      <td>
                        <span
                          className={`pill ${
                            assign.status === 'active'
                              ? 'pill-success'
                              : assign.status === 'completed'
                              ? 'pill-neutral'
                              : 'pill-danger'
                          }`}
                        >
                          {assign.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!assignments.length && (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No assignments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'employee-summary' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Employee Summary</h2>
              <div className="filter-row">
                <label>Month</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={summaryRange.month}
                  onChange={(e) =>
                    setSummaryRange({
                      ...summaryRange,
                      month: parseInt(e.target.value || 0, 10)
                    })
                  }
                />
                <label>Year</label>
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  value={summaryRange.year}
                  onChange={(e) =>
                    setSummaryRange({
                      ...summaryRange,
                      year: parseInt(e.target.value || 0, 10)
                    })
                  }
                />
                <button
                  className="btn-primary"
                  onClick={() =>
                    loadEmployeeSummary(
                      summaryRange.month,
                      summaryRange.year
                    )
                  }
                >
                  {summaryLoading ? 'Loading...' : 'Load Summary'}
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Days Present</th>
                    <th>Total Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeSummary.map((s) => (
                    <tr key={s.employee._id}>
                      <td>{s.employee.name}</td>
                      <td>{s.employee.email}</td>
                      <td>{s.daysPresent}</td>
                      <td>₹{s.totalSalary}</td>
                    </tr>
                  ))}
                  {!employeeSummary.length && (
                    <tr>
                      <td colSpan="4" className="empty-state">
                        No summary for selected period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance-by-date' && (
          <div className="card-panel">
            <div className="panel-header">
              <h2>Attendance By Date</h2>
              <div className="filter-row">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                />
                <button
                  className="btn-primary"
                  onClick={() =>
                    loadPresentEmployeesByDate(attendanceDate)
                  }
                >
                  Load
                </button>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="table-modern">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {presentEmployees.map((emp) => (
                    <tr key={emp._id}>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone || '-'}</td>
                    </tr>
                  ))}
                  {!presentEmployees.length && (
                    <tr>
                      <td colSpan="3" className="empty-state">
                        No attendance found for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODALS */}

        {showModal && modalType === 'company' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Register New Company</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterCompany} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Company Name</label>
                    <input
                      type="text"
                      name="name"
                      value={companyForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={companyForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={companyForm.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Address</label>
                    <textarea
                      name="address"
                      value={companyForm.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={companyForm.gstNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      name="password"
                      value={companyForm.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Company'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'employee' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Register New Employee</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleRegisterEmployee}
                className="modal-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={employeeForm.name}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          name: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={employeeForm.email}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          email: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={employeeForm.password}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          password: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={employeeForm.phone}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          phone: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Address</label>
                    <textarea
                      value={employeeForm.address}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          address: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Aadhaar</label>
                    <input
                      type="text"
                      value={employeeForm.aadhaar}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          aadhaar: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>PAN</label>
                    <input
                      type="text"
                      value={employeeForm.pan}
                      onChange={(e) =>
                        setEmployeeForm({
                          ...employeeForm,
                          pan: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Employee'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'supervisor' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Register New Supervisor</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleRegisterSupervisor}
                className="modal-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={supervisorForm.name}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          name: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={supervisorForm.email}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          email: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={supervisorForm.password}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          password: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={supervisorForm.phone}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          phone: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Address</label>
                    <textarea
                      value={supervisorForm.address}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          address: e.target.value
                        })
                      }
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Company</label>
                    <select
                      value={supervisorForm.companyId}
                      onChange={(e) =>
                        setSupervisorForm({
                          ...supervisorForm,
                          companyId: e.target.value
                        })
                      }
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Registering...' : 'Register Supervisor'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'assignment' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Create Assignment</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleCreateAssignment}
                className="modal-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee</label>
                    <select
                      value={assignmentForm.employeeId}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          employeeId: e.target.value
                        })
                      }
                      required
                    >
                      <option value="">Select Free Employee</option>
                      {freeEmployees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <select
                      value={assignmentForm.companyId}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          companyId: e.target.value
                        })
                      }
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={assignmentForm.startDate}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          startDate: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={assignmentForm.endDate}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          endDate: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Daily Salary</label>
                    <input
                      type="number"
                      value={assignmentForm.dailySalary}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          dailySalary: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Notes</label>
                    <textarea
                      value={assignmentForm.notes}
                      onChange={(e) =>
                        setAssignmentForm({
                          ...assignmentForm,
                          notes: e.target.value
                        })
                      }
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'salary' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Generate Salary</h3>
                <button
                  className="icon-btn"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleGenerateSalary}
                className="modal-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Assignment</label>
                    <select
                      value={salaryForm.assignmentId}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          assignmentId: e.target.value
                        })
                      }
                      required
                    >
                      <option value="">Select Active Assignment</option>
                      {assignments
                        .filter((a) => a.status === 'active')
                        .map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.employeeId?.name || a.employeeId} -{' '}
                            {a.companyId?.name || a.companyId}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Month</label>
                    <input
                      type="number"
                      value={salaryForm.month}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          month: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      value={salaryForm.year}
                      onChange={(e) =>
                        setSalaryForm({
                          ...salaryForm,
                          year: e.target.value
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Salary'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'reassign-supervisor' && (
          <div className="modal-overlay">
            <div className="modal-shell">
              <div className="modal-header">
                <h3>Reassign Supervisor to Company</h3>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSupervisor(null);
                  }}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleReassignSupervisor}
                className="modal-form"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Supervisor</label>
                    <input
                      type="text"
                      value={selectedSupervisor?.name || ''}
                      readOnly
                    />
                  </div>

                  <div className="form-group form-group-full">
                    <label>Company</label>
                    <select
                      value={reassignCompanyId}
                      onChange={(e) =>
                        setReassignCompanyId(e.target.value)
                      }
                      required
                    >
                      <option value="">Select Company</option>
                      {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Reassign'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
