import { io } from 'socket.io-client';
import APP_URL from '../API/config';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(APP_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      socket.emit('subscribe:superadmin');
    });

    socket.on('connect_error', (err) => {
      // Graceful fallback to HTTP polling
      console.warn('Socket connection warning (using HTTP fallback):', err.message);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
