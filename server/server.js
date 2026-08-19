require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { initSocket } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Connect to Database (with in-memory fallback)
connectDB();

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Base Check
app.get('/api', (req, res) => {
  res.json({ message: 'Task Management API Service Operational', version: '1.0.0' });
});

// Route Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] Express & Socket.IO server running on port ${PORT}`);
});
