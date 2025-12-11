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
  getStats: () => api.get('/admin/stats')
};

export const companyAPI = {
  registerEmployee: (data) => api.post('/company/employees', data),
  getEmployees: () => api.get('/company/employees'),
  updateEmployee: (employeeId, data) => api.put(`/company/employees/${employeeId}`, data),
  uploadDocument: (employeeId, data) => api.post(`/company/employees/${employeeId}/documents`, data),
  registerSupervisor: (data) => api.post('/company/supervisors', data),
  getSupervisors: () => api.get('/company/supervisors'),
  promoteEmployee: (employeeId) => api.patch(`/company/employees/${employeeId}/promote`),
  getAttendance: (params) => api.get('/company/attendance', { params })
};

export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance', data),
  getEmployees: () => api.get('/attendance/employees'),
  getTodayAttendance: () => api.get('/attendance/today'),
  getAttendanceByEmployee: (employeeId, params) => api.get(`/attendance/employee/${employeeId}`, { params })
};

export const salaryAPI = {
  generateSalary: (data) => api.post('/salary/generate', data),
  generateAllSalaries: (data) => api.post('/salary/generate-all', data),
  getAllSalaries: (params) => api.get('/salary/all', { params }),
  getSalaryByEmployee: (employeeId, params) => api.get(`/salary/employee/${employeeId}`, { params }),
  getMyPayslips: () => api.get('/salary/my-payslips')
};

export default api;
