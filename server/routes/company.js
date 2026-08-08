const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/employees', authenticate, authorize('company'), companyController.getAssignedEmployees);
router.get('/employees/:employeeId', authenticate, authorize('company'), companyController.viewEmployeeDetails);
router.get('/assignments', authenticate, authorize('company'), companyController.getAllAssignments);

router.get('/supervisors', authenticate, authorize('company'), companyController.getSupervisors);
router.post('/supervisors', authenticate, authorize('company'), upload.fields([{ name: 'aadhaarPhoto', maxCount: 1 }, { name: 'panPhoto', maxCount: 1 }]), companyController.registerSupervisor);

router.get('/attendance', authenticate, authorize('company'), companyController.getAttendanceSummary);

module.exports = router;
