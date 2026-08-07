import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../modules/users/user.model.js';
import { registerChatHandlers } from '../modules/chat/chat.socket.js';

// Minimal cookie parser - avoids pulling in a new dependency just to read
// one cookie value out of the raw handshake header.
function parseCookie(cookieHeader = '', name) {
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : null;
}

// Tracks which userId maps to which socket(s), so we can broadcast
// online/offline presence and support a user with multiple tabs/devices open.
const onlineUsers = new Map(); // userId -> Set of socket ids

export function initSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_URL, credentials: true },
  });

  // Auth middleware for the socket handshake - reuses the SAME JWT cookie
  // as REST auth (Phase 8 decision: no separate socket login system).
  io.use(async (socket, next) => {
    try {
      const token = parseCookie(socket.handshake.headers.cookie, env.COOKIE_NAME);
      if (!token) return next(new Error('Authentication required'));

      const payload = jwt.verify(token, env.JWT_SECRET);
      const user = await User.findById(payload.sub);
      if (!user || user.isSuspended) return next(new Error('Authentication required'));

      socket.user = user;
      next();
    } catch {
      next(new Error('Authentication required'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    // Only broadcast "online" the first time this user connects (not on
    // every extra tab/device), so the status doesn't flicker.
    if (onlineUsers.get(userId).size === 1) {
      io.emit('user_online', { userId });
    }

    registerChatHandlers(io, socket);

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);
      sockets?.delete(socket.id);
      if (sockets && sockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit('user_offline', { userId });
      }
    });
  });

  return io;
}