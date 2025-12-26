const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('supervisor','admin'), attendanceController.markAttendance);
router.get('/companies', authenticate, authorize('supervisor','admin'), attendanceController.getAllCompaniesForSupervisor);
router.get('/employees', authenticate, authorize('supervisor','admin'), attendanceController.getEmployeesForAttendance);
router.get('/today', authenticate, authorize('supervisor','admin'), attendanceController.getTodayAttendance);
router.get('/employee/:employeeId', authenticate, authorize('supervisor', 'company', 'employee','admin'), attendanceController.getAttendanceByEmployee);

module.exports = router;
