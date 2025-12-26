const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/employees', authenticate, authorize('company'), companyController.getAssignedEmployees);
router.get('/employees/:employeeId', authenticate, authorize('company'), companyController.viewEmployeeDetails);
router.get('/assignments', authenticate, authorize('company'), companyController.getAllAssignments);

router.get('/supervisors', authenticate, authorize('company'), companyController.getSupervisors);

router.get('/attendance', authenticate, authorize('company'), companyController.getAttendanceSummary);

module.exports = router;
