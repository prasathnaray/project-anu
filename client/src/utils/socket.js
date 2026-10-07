import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
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
      try {
        const token = localStorage.getItem('user_token');
        if (token) {
          const decoded = jwtDecode(token);
          if (decoded?.user_mail) {
            socket.emit('subscribe:user', decoded.user_mail);
          }
        }
      } catch (_) {}
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
