import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminAPI } from '../../services/api';

function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);
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

  useEffect(() => {
    loadStats();
    loadCompanies();
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

        <div style={{ marginBottom: '20px' }}>
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
          >
            Companies
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
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
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

        {showModal && (
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
      </div>
    </div>
  );
}

export default AdminDashboard;
