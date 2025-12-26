const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin'), assignmentController.createAssignment);
router.get('/', authenticate, authorize('admin'), assignmentController.getAllAssignments);
router.get('/free-employees', authenticate, authorize('admin'), assignmentController.getFreeEmployees);
router.get('/check-status', authenticate, authorize('admin'), assignmentController.checkAssignmentStatus);
router.get('/company', authenticate, authorize('company'), assignmentController.getCompanyAssignments);
router.get('/company/active-employees', authenticate, authorize('company'), assignmentController.getActiveEmployees);
router.get('/:assignmentId', authenticate, authorize('admin', 'company'), assignmentController.getAssignmentById);
router.put('/:assignmentId', authenticate, authorize('admin'), assignmentController.updateAssignment);
router.patch('/:assignmentId/complete', authenticate, authorize('admin'), assignmentController.completeAssignment);

module.exports = router;
