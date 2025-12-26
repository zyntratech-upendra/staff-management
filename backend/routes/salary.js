const express = require('express');
const router = express.Router();
const salaryController = require('../controllers/salaryController');
const { authenticate, authorize } = require('../middleware/auth');

router.post(
  '/generate',
  authenticate,
  authorize('company'),
  salaryController.generateSalary
);

router.get(
  '/all',
  authenticate,
  authorize('company'),
  salaryController.getAllSalaries
);

router.get(
  '/employee/:employeeId',
  authenticate,
  authorize('company'),
  salaryController.getSalaryByEmployee
);

router.get(
  '/my-payslips',
  authenticate,
  authorize('employee'),
  salaryController.getMyPayslips
);

module.exports = router;
