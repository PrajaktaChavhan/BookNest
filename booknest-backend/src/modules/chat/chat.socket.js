import { createMessage } from './chat.service.js';
import { Conversation } from './conversation.model.js';
import { notify } from '../notifications/notification.service.js';

export function registerChatHandlers(io, socket) {
  socket.on('join_conversation', async ({ conversationId }) => {
    // Verify the user is actually a participant before letting them join
    // the room - otherwise anyone could listen in on any conversation by
    // guessing an ID.
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return;
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === socket.user._id.toString()
    );
    if (!isParticipant) return;

    socket.join(conversationId);
  });

  socket.on('send_message', async ({ conversationId, text }) => {
    try {
      // Same service function a REST endpoint would call - this is the
      // "shared service layer" principle from Phase 6 in practice.
      const message = await createMessage(conversationId, socket.user._id, text);
      const conversation = await Conversation.findById(conversationId);

      // Broadcast to everyone in the room (both participants), including
      // the sender, so every connected client stays in sync from one
      // source of truth rather than the sender optimistically rendering
      // its own message locally.
      io.to(conversationId).emit('new_message', { message });

      // Notify the OTHER participant (not the sender) - fires regardless
      // of whether they're currently connected, so they see it in their
      // notification center even if they're offline right now.
      const recipientId = conversation.participants.find(
        (p) => p.toString() !== socket.user._id.toString()
      );
      if (recipientId) {
        await notify(recipientId, 'new_message', { conversationId, text });
      }
    } catch (err) {
      socket.emit('error_message', { message: err.message || 'Failed to send message' });
    }
  });

  socket.on('typing', ({ conversationId }) => {
    socket.to(conversationId).emit('typing', { conversationId, userId: socket.user._id });
  });
}