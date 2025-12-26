import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data)
};

export const adminAPI = {
  registerCompany: (data) => api.post('/admin/companies', data),
  getCompanies: () => api.get('/admin/companies'),
  toggleCompanyStatus: (companyId) => api.patch(`/admin/companies/${companyId}/toggle`),
  resetCompanyPassword: (companyId, data) => api.post(`/admin/companies/${companyId}/reset-password`, data),
  getStats: () => api.get('/admin/stats'),
  registerEmployee: (data) => api.post('/admin/employees', data),
  getEmployees: () => api.get('/admin/employees'),
  updateEmployee: (employeeId, data) => api.put(`/admin/employees/${employeeId}`, data),
  registerSupervisor: (data) => api.post('/admin/supervisors', data),
  getSupervisors: () => api.get('/admin/supervisors')
};

export const assignmentAPI = {
  createAssignment: (data) => api.post('/assignments', data),
  getAllAssignments: (params) => api.get('/assignments', { params }),
  getAssignmentById: (assignmentId) => api.get(`/assignments/${assignmentId}`),
  updateAssignment: (assignmentId, data) => api.put(`/assignments/${assignmentId}`, data),
  completeAssignment: (assignmentId) => api.patch(`/assignments/${assignmentId}/complete`),
  getFreeEmployees: () => api.get('/assignments/free-employees'),
  checkAssignmentStatus: () => api.get('/assignments/check-status'),
  getCompanyAssignments: (params) => api.get('/assignments/company', { params }),
  getActiveEmployees: () => api.get('/assignments/company/active-employees')
};

export const companyAPI = {
  getEmployees: () => api.get('/company/employees'),
  getEmployeeDetails: (employeeId) => api.get(`/company/employees/${employeeId}`),
  getAssignments: (params) => api.get('/company/assignments', { params }),
  getSupervisors: () => api.get('/company/supervisors'),
  getAttendance: (params) => api.get('/company/attendance', { params })
};

export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance', data),
  getCompanies: () => api.get('/attendance/companies'),
  getEmployees: (params) => api.get('/attendance/employees', { params }),
  getTodayAttendance: () => api.get('/attendance/today'),
  getAttendanceByEmployee: (employeeId, params) => api.get(`/attendance/employee/${employeeId}`, { params })
};

export const salaryAPI = {
  generateSalary: (data) => api.post('/salary/generate', data),
  getAllSalaries: (params) => api.get('/salary/all', { params }),
  getSalaryByEmployee: (employeeId, params) => api.get(`/salary/employee/${employeeId}`, { params }),
  getMyPayslips: () => api.get('/salary/my-payslips')
};

export default api;
