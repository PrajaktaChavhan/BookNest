import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext(null);

// One shared Socket.io connection for the whole app, created only once a
// user session is confirmed. withCredentials sends the same httpOnly auth
// cookie the REST API uses - the backend's handshake middleware reads it
// directly, so this requires no separate socket login (per our Phase 8
// backend decision, unchanged here).
export function SocketProvider({ children }) {
  const { user, isLoading } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      setSocket((current) => {
        current?.disconnect();
        return null;
      });
      setIsConnected(false);
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });
    newSocket.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, isLoading]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocket must be used within a SocketProvider');
  return ctx;
}
