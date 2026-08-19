const jwt = require('jsonwebtoken');
const socketIO = require('socket.io');

let io = null;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });

  // Socket Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'task_management_app_jwt_secret_key_2026_super_secure'
      );
      socket.userId = decoded.id;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Token invalid'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected. User ID: ${socket.userId}`);

    // Join room specifically for this authenticated user
    const roomName = `user:${socket.userId}`;
    socket.join(roomName);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected. User ID: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = {
  initSocket,
  getIO,
};
