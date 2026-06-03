import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return;
    }

    const socketInstance = io(import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000', {
      auth: {
        token: token
      }
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, []);

  return { socket, isConnected };
};
