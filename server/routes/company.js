const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/employees', authenticate, authorize('company'), companyController.registerEmployee);
router.get('/employees', authenticate, authorize('company'), companyController.getEmployees);
router.put('/employees/:employeeId', authenticate, authorize('company'), companyController.updateEmployee);
router.post('/employees/:employeeId/documents', authenticate, authorize('company'), companyController.uploadDocument);

router.post('/supervisors', authenticate, authorize('company'), companyController.registerSupervisor);
router.get('/supervisors', authenticate, authorize('company'), companyController.getSupervisors);
router.patch('/employees/:employeeId/promote', authenticate, authorize('company'), companyController.promoteToSupervisor);

router.get('/attendance', authenticate, authorize('company'), companyController.getAttendanceSummary);

module.exports = router;
