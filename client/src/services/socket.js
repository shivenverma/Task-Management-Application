import { io } from 'socket.io-client';

let socket = null;

export const initSocketClient = (token) => {
  if (!token) return null;

  if (socket && socket.connected) {
    return socket;
  }

  // Connect to backend Socket server
  const serverUrl = window.location.origin.includes('5173')
    ? 'http://localhost:5000'
    : window.location.origin;

  socket = io(serverUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    autoConnect: true,
  });

  socket.on('connect', () => {
    console.log('[Socket Client] Real-time connection established');
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket Client Connection Error]:', err.message);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
