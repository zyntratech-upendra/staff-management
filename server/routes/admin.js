const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/companies', authenticate, authorize('admin'), adminController.registerCompany);
router.get('/companies', authenticate, authorize('admin'), adminController.getAllCompanies);
router.patch('/companies/:companyId/toggle', authenticate, authorize('admin'), adminController.toggleCompanyStatus);
router.post('/companies/:companyId/reset-password', authenticate, authorize('admin'), adminController.resetCompanyPassword);
router.get('/stats', authenticate, authorize('admin'), adminController.getStats);

router.post('/employees', authenticate, authorize('admin'), adminController.registerEmployee);
router.get('/employees', authenticate, authorize('admin'), adminController.getAllEmployees);
router.put('/employees/:employeeId', authenticate, authorize('admin'), adminController.updateEmployee);

router.post('/supervisors', authenticate, authorize('admin'), adminController.registerSupervisor);
router.get('/supervisors', authenticate, authorize('admin'), adminController.getAllSupervisors);

module.exports = router;
