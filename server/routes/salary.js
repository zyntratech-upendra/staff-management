const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { authenticate, authorize } = require('../middleware/auth');

router.post(
  '/generate',
  authenticate,
  authorize('admin'),
  salaryController.generateSalary
);

router.get(
  '/all',
  authenticate,
  authorize('company','admin'),
  salaryController.getAllSalaries
);

router.get(
  '/employee/:employeeId',
  authenticate,
  authorize('company','admin'),
  salaryController.getSalaryByEmployee
);

router.get(
  '/my-payslips',
  authenticate,
  authorize('employee','admins'),
  salaryController.getMyPayslips
);

module.exports = router;
