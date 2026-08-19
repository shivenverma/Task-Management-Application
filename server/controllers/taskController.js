const Task = require('../models/Task');
const { getIO } = require('../socket/socketHandler');

// Helper to notify user via Socket.IO
const notifySocketUser = (userId, eventName, data) => {
  try {
    const io = getIO();
    if (io) {
      io.to(`user:${userId.toString()}`).emit(eventName, data);
    }
  } catch (err) {
    // Socket emit fail shouldn't break HTTP request
    console.warn('[Socket Notification Warn]:', err.message);
  }
};

// @desc    Get all tasks for current user with filtering & sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, overdue, sortBy } = req.query;

    // Build query scoped strictly to authenticated user
    const query = { userId: req.user._id };

    // Search by title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Status filter
    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    // Priority filter
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    // Overdue filter
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Completed' };
    }

    // Sort configuration
    let sortOptions = { createdAt: -1 }; // default newest first
    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'priority') {
      // Custom priority order handle
      sortOptions = { priority: -1, createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    return res.json(tasks);
  } catch (error) {
    console.error('[getTasks Controller Error]:', error);
    return res.status(500).json({ message: 'Server error retrieving tasks', error: error.message });
  }
};

// @desc    Get dynamic summary statistics for current user
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Pending' }),
      Task.countDocuments({ userId, status: 'In Progress' }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({ userId, dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
    ]);

    return res.json({
      total,
      pending,
      inProgress,
      completed,
      overdue,
    });
  } catch (error) {
    console.error('[getTaskStats Controller Error]:', error);
    return res.status(500).json({ message: 'Server error retrieving task stats' });
  }
};

// @desc    Get single task details
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this task' });
    }

    return res.json(task);
  } catch (error) {
    console.error('[getTaskById Controller Error]:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(500).json({ message: 'Server error retrieving task details' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      userId: req.user._id,
    });

    const createdTask = await task.save();

    // Socket notification
    notifySocketUser(req.user._id, 'taskCreated', createdTask);

    return res.status(201).json(createdTask);
  } catch (error) {
    console.error('[createTask Controller Error]:', error);
    return res.status(500).json({ message: 'Server error creating task', error: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();

    // Socket notification
    notifySocketUser(req.user._id, 'taskUpdated', updatedTask);

    return res.json(updatedTask);
  } catch (error) {
    console.error('[updateTask Controller Error]:', error);
    return res.status(500).json({ message: 'Server error updating task', error: error.message });
  }
};

// @desc    Update task status only
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
    }

    task.status = status;
    const updatedTask = await task.save();

    // Socket notification
    notifySocketUser(req.user._id, 'taskStatusChanged', updatedTask);

    return res.json(updatedTask);
  } catch (error) {
    console.error('[updateTaskStatus Controller Error]:', error);
    return res.status(500).json({ message: 'Server error updating status' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify task ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot delete another user task' });
    }

    await task.deleteOne();

    // Socket notification
    notifySocketUser(req.user._id, 'taskDeleted', { taskId: req.params.id });

    return res.json({ message: 'Task successfully deleted', taskId: req.params.id });
  } catch (error) {
    console.error('[deleteTask Controller Error]:', error);
    return res.status(500).json({ message: 'Server error deleting task' });
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
