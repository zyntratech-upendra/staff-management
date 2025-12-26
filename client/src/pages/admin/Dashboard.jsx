import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI, assignmentAPI, salaryAPI } from '../../services/api';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [freeEmployees, setFreeEmployees] = useState([]);
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
      setMessage(error.response?.data?.message || 'Failed to register company');
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
      setMessage(error.response?.data?.message || 'Failed to register employee');
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
      setMessage(error.response?.data?.message || 'Failed to register supervisor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupervisor = async (supervisorId) => {
    if (!window.confirm('Delete this supervisor? This action cannot be undone.')) return;
    setLoading(true);
    setMessage('');
    try {
      await adminAPI.deleteSupervisor(supervisorId);
      setMessage('Supervisor deleted successfully');
      loadSupervisors();
      loadCompanies();
      loadStats();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete supervisor');
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
      await adminAPI.updateSupervisor(selectedSupervisor._id, { companyId: reassignCompanyId });
      setMessage('Supervisor reassigned successfully');
      setShowModal(false);
      setSelectedSupervisor(null);
      setReassignCompanyId('');
      loadSupervisors();
      loadCompanies();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to reassign supervisor');
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
      setMessage(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSalary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const assignment = assignments.find(a => a._id === salaryForm.assignmentId);
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
      setSalaryForm({ assignmentId: '', month: new Date().getMonth() + 1, year: new Date().getFullYear() });
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Failed to generate salary');
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
      setMessage(error.response?.data?.message || 'Failed to update status');
    }
  };

  const openModal = (type) => {
    if (type === 'assignment') {
      loadFreeEmployees();
    }
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div>
      <Navbar user={user} onLogout={onLogout} />

      <div className="container">
        <h1 style={{ marginBottom: '20px' }}>Admin Dashboard</h1>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div style={{ marginBottom: '20px', overflowX: 'auto' }}>
          <button
            className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('stats')}
            style={{ marginRight: '10px' }}
          >
            Statistics
          </button>
          <button
            className={`btn ${activeTab === 'companies' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('companies')}
            style={{ marginRight: '10px' }}
          >
            Companies
          </button>
          <button
            className={`btn ${activeTab === 'employees' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('employees')}
            style={{ marginRight: '10px' }}
          >
            Employees
          </button>
          <button
            className={`btn ${activeTab === 'supervisors' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('supervisors')}
            style={{ marginRight: '10px' }}
          >
            Supervisors
          </button>
          <button
            className={`btn ${activeTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('assignments')}
          >
            Assignments
          </button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="dashboard-grid">
            <div className="stat-card">
              <h3>Total Companies</h3>
              <div className="value">{stats.totalCompanies}</div>
            </div>
            <div className="stat-card">
              <h3>Active Companies</h3>
              <div className="value">{stats.activeCompanies}</div>
            </div>
            <div className="stat-card">
              <h3>Total Employees</h3>
              <div className="value">{stats.totalEmployees}</div>
            </div>
            <div className="stat-card">
              <h3>Total Supervisors</h3>
              <div className="value">{stats.totalSupervisors}</div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Companies</h2>
              <button className="btn btn-primary" onClick={() => openModal('company')}>
                Register Company
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Company Code</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                      <span className={`badge ${company.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {company.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn ${company.isActive ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => handleToggleStatus(company._id)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        {company.isActive ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'employees' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Employees</h2>
              <button className="btn btn-primary" onClick={() => openModal('employee')}>
                Register Employee
              </button>
            </div>

            <table className="table">
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
                      <span className={`badge ${emp.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'supervisors' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Supervisors</h2>
              <button className="btn btn-primary" onClick={() => openModal('supervisor')}>
                Register Supervisor
              </button>
            </div>

            <table className="table">
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
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => openModal('reassign-supervisor') || (setSelectedSupervisor(sup), setReassignCompanyId(sup.companyId?._id || ''))} style={{ marginRight: '8px' }}>
                        Reassign
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSupervisor(sup._id)}>
                        Delete
                      </button>
                    </td>
                    <td>
                      <span className={`badge ${sup.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {sup.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Assignments</h2>
              <div>
                <button className="btn btn-primary" onClick={() => openModal('assignment')} style={{ marginRight: '8px' }}>
                  Create Assignment
                </button>
                <button className="btn btn-secondary" onClick={() => openModal('salary')}>
                  Generate Salary
                </button>
              </div>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Company</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Daily Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assign) => (
                  <tr key={assign._id}>
                    <td>{assign.employeeId?.name}</td>
                    <td>{assign.companyId?.name}</td>
                    <td>{new Date(assign.startDate).toLocaleDateString()}</td>
                    <td>{new Date(assign.endDate).toLocaleDateString()}</td>
                    <td>₹{assign.dailySalary}</td>
                    <td>
                      <span className={`badge badge-${assign.status === 'active' ? 'success' : assign.status === 'completed' ? 'secondary' : 'danger'}`}>
                        {assign.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && modalType === 'company' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Register New Company</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterCompany}>
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

                <div className="form-group">
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Company'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'employee' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Register New Employee</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterEmployee}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={employeeForm.password}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={employeeForm.address}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Aadhaar</label>
                  <input
                    type="text"
                    value={employeeForm.aadhaar}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, aadhaar: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>PAN</label>
                  <input
                    type="text"
                    value={employeeForm.pan}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, pan: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Employee'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'supervisor' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Register New Supervisor</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleRegisterSupervisor}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={supervisorForm.name}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={supervisorForm.email}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={supervisorForm.password}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={supervisorForm.phone}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={supervisorForm.address}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <select
                    value={supervisorForm.companyId}
                    onChange={(e) => setSupervisorForm({ ...supervisorForm, companyId: e.target.value })}
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Supervisor'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'assignment' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Assignment</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleCreateAssignment}>
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={assignmentForm.employeeId}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, employeeId: e.target.value })}
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
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, companyId: e.target.value })}
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
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={assignmentForm.endDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, endDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Daily Salary</label>
                  <input
                    type="number"
                    value={assignmentForm.dailySalary}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, dailySalary: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={assignmentForm.notes}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Assignment'}
                </button>
              </form>
            </div>
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
                  <label>Assignment</label>
                  <select
                    value={salaryForm.assignmentId}
                    onChange={(e) => setSalaryForm({ ...salaryForm, assignmentId: e.target.value })}
                    required
                  >
                    <option value="">Select Active Assignment</option>
                    {assignments.filter(a => a.status === 'active').map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.employeeId?.name || a.employeeId} - {a.companyId?.name || a.companyId}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Month</label>
                  <input
                    type="number"
                    value={salaryForm.month}
                    onChange={(e) => setSalaryForm({ ...salaryForm, month: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <input
                    type="number"
                    value={salaryForm.year}
                    onChange={(e) => setSalaryForm({ ...salaryForm, year: e.target.value })}
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
        {showModal && modalType === 'reassign-supervisor' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Reassign Supervisor to Company</h3>
                <button className="close-btn" onClick={() => { setShowModal(false); setSelectedSupervisor(null); }}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleReassignSupervisor}>
                <div className="form-group">
                  <label>Supervisor</label>
                  <input type="text" value={selectedSupervisor?.name || ''} readOnly />
                </div>

                <div className="form-group">
                  <label>Company</label>
                  <select value={reassignCompanyId} onChange={(e) => setReassignCompanyId(e.target.value)} required>
                    <option value="">Select Company</option>
                    {companies.map((comp) => (
                      <option key={comp._id} value={comp._id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
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
