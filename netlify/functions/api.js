require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');

// Lazy-load DB connection
let isConnected = false;
const connectDB = require('../../server/config/db');

const authRoutes = require('../../server/routes/authRoutes');
const taskRoutes = require('../../server/routes/taskRoutes');
const { notFound, errorHandler } = require('../../server/middleware/errorMiddleware');

const app = express();

// Ensure DB connects once (reused across warm lambda invocations)
const ensureDB = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'Task Management API Service Operational', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports.handler = serverless(app);
