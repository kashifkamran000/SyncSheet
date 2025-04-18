import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SERVER_URL;

const socket = io(socketUrl, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  autoConnect: true,
  timeout: 10000,
});

export default socket;
