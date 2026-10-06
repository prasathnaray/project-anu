const { Server } = require('socket.io');

let io = null;

const initSocket = (httpServer) => {
  if (io) return io;

  io = new Server(httpServer, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    // Client connected
    socket.on('subscribe:superadmin', () => {
      socket.join('superadmin_room');
    });

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  return io;
};

const getIo = () => io;

const broadcastActivity = (activity) => {
  if (!io) return;
  try {
    io.emit('activity:new', activity);
    io.to('superadmin_room').emit('activity:new', activity);
  } catch (err) {
    console.error('Error broadcasting activity socket:', err.message);
  }
};

const broadcastStatsUpdate = (stats) => {
  if (!io) return;
  try {
    io.emit('stats:update', stats);
    io.to('superadmin_room').emit('stats:update', stats);
  } catch (err) {
    console.error('Error broadcasting stats update socket:', err.message);
  }
};

module.exports = {
  initSocket,
  getIo,
  broadcastActivity,
  broadcastStatsUpdate
};
