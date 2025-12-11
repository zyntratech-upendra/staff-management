const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('supervisor'), attendanceController.markAttendance);
router.get('/employees', authenticate, authorize('supervisor'), attendanceController.getEmployeesForAttendance);
router.get('/today', authenticate, authorize('supervisor'), attendanceController.getTodayAttendance);
router.get('/employee/:employeeId', authenticate, authorize('supervisor', 'company', 'employee'), attendanceController.getAttendanceByEmployee);

module.exports = router;
