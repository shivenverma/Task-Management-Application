require('dotenv').config();
const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
const path = require('path');

// Resolve server directory relative to repo root
const serverDir = path.resolve(__dirname, '../../server');

const connectDB = require(path.join(serverDir, 'config/db'));
const authRoutes = require(path.join(serverDir, 'routes/authRoutes'));
const taskRoutes = require(path.join(serverDir, 'routes/taskRoutes'));
const { notFound, errorHandler } = require(path.join(serverDir, 'middleware/errorMiddleware'));

const app = express();

let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
  }
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({ message: 'Task Management API Service Operational', version: '1.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports.handler = serverless(app);
