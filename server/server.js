require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSocket } = require('./socket/socketHandler');

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] Express & Socket.IO server running on port ${PORT}`);
});
