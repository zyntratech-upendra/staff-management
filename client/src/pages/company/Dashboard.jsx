import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { companyAPI, salaryAPI } from '../../services/api';

function CompanyDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    aadhaar: '',
    pan: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      bankName: '',
      accountHolderName: ''
    },
    salaryStructure: {
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      grossSalary: 0,
      pfApplicable: false,
      pfAmount: 0,
      esiApplicable: false,
      esiAmount: 0
    }
  });

  const [supervisorForm, setSupervisorForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [salaryForm, setSalaryForm] = useState({
    employeeId: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    totalWorkingDays: 26
  });

  useEffect(() => {
    loadEmployees();
    loadSupervisors();
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

  const handlePromote = async (employeeId) => {
    if (!window.confirm('Promote this employee to supervisor?')) return;
    setLoading(true);
    setMessage('');
    try {
      await companyAPI.promoteEmployee(employeeId);
      setMessage('Employee promoted to supervisor');
      loadEmployees();
      loadSupervisors();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to promote employee');
    } finally {
      setLoading(false);
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

  const handleEmployeeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const formData = { ...employeeForm };
      formData.salaryStructure.grossSalary =
        parseFloat(formData.salaryStructure.basicSalary) +
        parseFloat(formData.salaryStructure.hra) +
        parseFloat(formData.salaryStructure.allowances);

      await companyAPI.registerEmployee(formData);
      setMessage('Employee registered successfully');
      setShowModal(false);
      resetEmployeeForm();
      loadEmployees();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to register employee');
    } finally {
      setLoading(false);
    }
  };

  const handleSupervisorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await companyAPI.registerSupervisor(supervisorForm);
      setMessage('Supervisor registered successfully');
      setShowModal(false);
      resetSupervisorForm();
      loadSupervisors();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to register supervisor');
    } finally {
      setLoading(false);
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
      loadSalaries();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate salary');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAllSalaries = async (e) => {
    // if called from a button without event
    if (e && e.preventDefault) e.preventDefault();
    if (!window.confirm('Generate salaries for ALL employees for the selected month?')) return;
    setLoading(true);
    setMessage('');

    try {
      await salaryAPI.generateAllSalaries({
        month: salaryForm.month,
        year: salaryForm.year,
        totalWorkingDays: salaryForm.totalWorkingDays
      });
      setMessage('Salaries generated for all employees');
      setShowModal(false);
      loadSalaries();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to generate salaries');
    } finally {
      setLoading(false);
    }
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      aadhaar: '',
      pan: '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        bankName: '',
        accountHolderName: ''
      },
      salaryStructure: {
        basicSalary: 0,
        hra: 0,
        allowances: 0,
        grossSalary: 0,
        pfApplicable: false,
        pfAmount: 0,
        esiApplicable: false,
        esiAmount: 0
      }
    });
  };

  const resetSupervisorForm = () => {
    setSupervisorForm({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: ''
    });
  };

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
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

        <div style={{ marginBottom: '20px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Employees</h2>
              <button className="btn btn-primary" onClick={() => openModal('employee')}>
                Add Employee
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gross Salary</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone}</td>
                    <td>₹{emp.salaryStructure?.grossSalary || 0}</td>
                    <td>
                      <span className={`badge ${emp.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => handlePromote(emp._id)} disabled={loading}>
                        Promote
                      </button>
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
                Add Supervisor
              </button>
            </div>

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
                {supervisors.map((sup) => (
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
                ))}
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
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((att) => (
                  <tr key={att._id}>
                    <td>{att.employeeId?.name}</td>
                    <td>{new Date(att.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${att.status === 'Present' ? 'success' : att.status === 'Absent' ? 'danger' : 'warning'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{att.supervisorId?.name}</td>
                    <td>{att.remarks || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Salary Records</h2>
              <button className="btn btn-primary" onClick={() => openModal('salary')}>
                Generate Salary
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Month/Year</th>
                  <th>Days Worked</th>
                  <th>Gross Salary</th>
                  <th>Net Salary</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((sal) => (
                  <tr key={sal._id}>
                    <td>{sal.employeeId?.name}</td>
                    <td>{sal.month}/{sal.year}</td>
                    <td>{sal.daysWorked}</td>
                    <td>₹{sal.grossSalary}</td>
                    <td>₹{sal.netSalary.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${sal.status === 'generated' ? 'success' : 'warning'}`}>
                        {sal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && modalType === 'employee' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Employee</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleEmployeeSubmit}>
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
                  <label>Basic Salary</label>
                  <input
                    type="number"
                    value={employeeForm.salaryStructure.basicSalary}
                    onChange={(e) => setEmployeeForm({
                      ...employeeForm,
                      salaryStructure: { ...employeeForm.salaryStructure, basicSalary: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>HRA</label>
                  <input
                    type="number"
                    value={employeeForm.salaryStructure.hra}
                    onChange={(e) => setEmployeeForm({
                      ...employeeForm,
                      salaryStructure: { ...employeeForm.salaryStructure, hra: e.target.value }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Allowances</label>
                  <input
                    type="number"
                    value={employeeForm.salaryStructure.allowances}
                    onChange={(e) => setEmployeeForm({
                      ...employeeForm,
                      salaryStructure: { ...employeeForm.salaryStructure, allowances: e.target.value }
                    })}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Employee'}
                </button>
              </form>
            </div>
          </div>
        )}

        {showModal && modalType === 'supervisor' && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Add Supervisor</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleSupervisorSubmit}>
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

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Supervisor'}
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
                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>

              <form onSubmit={handleGenerateSalary}>
                <div className="form-group">
                  <label>Employee</label>
                  <select
                    value={salaryForm.employeeId}
                    onChange={(e) => setSalaryForm({ ...salaryForm, employeeId: e.target.value })}
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
                  <label>Month</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
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

                <div className="form-group">
                  <label>Total Working Days</label>
                  <input
                    type="number"
                    value={salaryForm.totalWorkingDays}
                    onChange={(e) => setSalaryForm({ ...salaryForm, totalWorkingDays: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Salary'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleGenerateAllSalaries} disabled={loading} style={{ marginLeft: '10px' }}>
                  {loading ? 'Generating...' : 'Generate All Salaries'}
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
