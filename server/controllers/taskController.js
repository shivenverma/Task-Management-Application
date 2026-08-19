const prisma = require('../config/prisma');
const Task = require('../models/Task');
const { getIO } = require('../socket/socketHandler');

const isPrisma = () => !!process.env.DATABASE_URL;

// Helper to notify user via Socket.IO
const notifySocketUser = (userId, eventName, data) => {
  try {
    const io = getIO();
    if (io) {
      io.to(`user:${userId.toString()}`).emit(eventName, data);
    }
  } catch (err) {
    console.warn('[Socket Notification Warn]:', err.message);
  }
};

// @desc    Get all tasks for current user with filtering & sorting
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { search, status, priority, overdue, sortBy } = req.query;
    const userId = req.user._id || req.user.id;

    if (isPrisma()) {
      const where = { userId };

      if (search && search.trim() !== '') {
        const queryStr = search.trim();
        where.OR = [
          { title: { contains: queryStr, mode: 'insensitive' } },
          { description: { contains: queryStr, mode: 'insensitive' } },
        ];
      }

      if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
        where.status = status;
      }

      if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
        where.priority = priority;
      }

      if (overdue === 'true') {
        where.dueDate = { lt: new Date() };
        where.status = { not: 'Completed' };
      }

      let orderBy = [{ createdAt: 'desc' }];
      if (sortBy === 'oldest') {
        orderBy = [{ createdAt: 'asc' }];
      } else if (sortBy === 'dueDate') {
        orderBy = [{ dueDate: 'asc' }];
      } else if (sortBy === 'priority') {
        orderBy = [{ priority: 'desc' }, { createdAt: 'desc' }];
      }

      const tasks = await prisma.task.findMany({ where, orderBy });
      const formattedTasks = tasks.map((t) => ({ ...t, _id: t.id }));
      return res.json(formattedTasks);
    }

    // Fallback Mongoose logic
    const query = { userId };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    if (status && ['Pending', 'In Progress', 'Completed'].includes(status)) {
      query.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      query.priority = priority;
    }

    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Completed' };
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      sortOptions = { dueDate: 1 };
    } else if (sortBy === 'priority') {
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
    const userId = req.user._id || req.user.id;
    const now = new Date();

    if (isPrisma()) {
      const [total, pending, inProgress, completed, overdue] = await Promise.all([
        prisma.task.count({ where: { userId } }),
        prisma.task.count({ where: { userId, status: 'Pending' } }),
        prisma.task.count({ where: { userId, status: 'In Progress' } }),
        prisma.task.count({ where: { userId, status: 'Completed' } }),
        prisma.task.count({ where: { userId, dueDate: { lt: now }, status: { not: 'Completed' } } }),
      ]);

      return res.json({ total, pending, inProgress, completed, overdue });
    }

    // Fallback Mongoose logic
    const [total, pending, inProgress, completed, overdue] = await Promise.all([
      Task.countDocuments({ userId }),
      Task.countDocuments({ userId, status: 'Pending' }),
      Task.countDocuments({ userId, status: 'In Progress' }),
      Task.countDocuments({ userId, status: 'Completed' }),
      Task.countDocuments({ userId, dueDate: { $lt: now }, status: { $ne: 'Completed' } }),
    ]);

    return res.json({ total, pending, inProgress, completed, overdue });
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
    const userId = req.user._id || req.user.id;

    if (isPrisma()) {
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You do not have access to this task' });
      }
      return res.json({ ...task, _id: task.id });
    }

    // Fallback Mongoose logic
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have access to this task' });
    }

    return res.json(task);
  } catch (error) {
    console.error('[getTaskById Controller Error]:', error);
    return res.status(500).json({ message: 'Server error retrieving task details' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user._id || req.user.id;

    if (isPrisma()) {
      const createdTask = await prisma.task.create({
        data: {
          title,
          description: description || '',
          status: status || 'Pending',
          priority: priority || 'Medium',
          dueDate: new Date(dueDate),
          userId,
        },
      });

      const formatted = { ...createdTask, _id: createdTask.id };
      notifySocketUser(userId, 'taskCreated', formatted);
      return res.status(201).json(formatted);
    }

    // Fallback Mongoose logic
    const task = new Task({
      title,
      description: description || '',
      status: status || 'Pending',
      priority: priority || 'Medium',
      dueDate,
      userId,
    });

    const createdTask = await task.save();
    notifySocketUser(userId, 'taskCreated', createdTask);
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
    const userId = req.user._id || req.user.id;
    const { title, description, status, priority, dueDate } = req.body;

    if (isPrisma()) {
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);

      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: updateData,
      });

      const formatted = { ...updatedTask, _id: updatedTask.id };
      notifySocketUser(userId, 'taskUpdated', formatted);
      return res.json(formatted);
    }

    // Fallback Mongoose logic
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    const updatedTask = await task.save();
    notifySocketUser(userId, 'taskUpdated', updatedTask);
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
    const userId = req.user._id || req.user.id;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    if (isPrisma()) {
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
      }

      const updatedTask = await prisma.task.update({
        where: { id: req.params.id },
        data: { status },
      });

      const formatted = { ...updatedTask, _id: updatedTask.id };
      notifySocketUser(userId, 'taskStatusChanged', formatted);
      return res.json(formatted);
    }

    // Fallback Mongoose logic
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot modify another user task' });
    }

    task.status = status;
    const updatedTask = await task.save();
    notifySocketUser(userId, 'taskStatusChanged', updatedTask);
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
    const userId = req.user._id || req.user.id;

    if (isPrisma()) {
      const task = await prisma.task.findUnique({ where: { id: req.params.id } });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      if (task.userId !== userId) {
        return res.status(403).json({ message: 'Forbidden: You cannot delete another user task' });
      }

      await prisma.task.delete({ where: { id: req.params.id } });
      notifySocketUser(userId, 'taskDeleted', { taskId: req.params.id });
      return res.json({ message: 'Task successfully deleted', taskId: req.params.id });
    }

    // Fallback Mongoose logic
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You cannot delete another user task' });
    }

    await task.deleteOne();
    notifySocketUser(userId, 'taskDeleted', { taskId: req.params.id });
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
