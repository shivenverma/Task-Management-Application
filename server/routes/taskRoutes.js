const express = require('express');
const { body } = require('express-validator');
const {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(protect);

const taskValidation = [
  body('title').notEmpty().withMessage('Task title is required').trim(),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Invalid date format'),
  body('status').optional().isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority value'),
  validate,
];

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.get('/stats', getTaskStats);

router.route('/:id')
  .get(getTaskById)
  .put(taskValidation, updateTask)
  .delete(deleteTask);

router.patch('/:id/status', [
  body('status').isIn(['Pending', 'In Progress', 'Completed']).withMessage('Invalid status value'),
  validate,
], updateTaskStatus);

module.exports = router;
