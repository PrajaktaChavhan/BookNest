import { Conversation } from './conversation.model.js';
import { Message } from './message.model.js';
import { Listing } from '../listings/listing.model.js';
import { ApiError } from '../../utils/ApiError.js';

function assertParticipant(conversation, userId) {
  const isParticipant = conversation.participants.some((p) => p.toString() === userId.toString());
  if (!isParticipant) {
    throw ApiError.forbidden('You are not part of this conversation');
  }
}

/**
 * Idempotent - per Phase 8 decision. If a conversation already exists
 * between this user and the listing's owner for this listing, return it
 * instead of creating a duplicate (handles "user clicks message seller twice").
 */
export async function startConversation(userId, listingId) {
  const listing = await Listing.findById(listingId);
  if (!listing) throw ApiError.notFound('Listing not found');

  if (listing.owner.toString() === userId.toString()) {
    throw ApiError.badRequest('You cannot message yourself about your own listing');
  }

  const existing = await Conversation.findOne({
    listing: listingId,
    participants: { $all: [userId, listing.owner] },
  });
  if (existing) return existing;

  const conversation = await Conversation.create({
    listing: listingId,
    participants: [userId, listing.owner],
  });
  return conversation;
}

export async function getUserConversations(userId) {
  return Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1 })
    .populate('listing', 'title images status')
    .populate('participants', 'name profilePicture');
}

/**
 * Cursor-based pagination: pass `before` (a message _id or timestamp) to
 * get the page of messages just older than that point. Avoids the
 * skipped/duplicated-message problem that offset pagination has when new
 * messages arrive while a user is scrolling up through history.
 */
export async function getMessages(conversationId, userId, { before, limit = 20 } = {}) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound('Conversation not found');
  assertParticipant(conversation, userId);

  const query = { conversation: conversationId };
  if (before) query.createdAt = { $lt: new Date(before) };

  const messages = await Message.find(query).sort({ createdAt: -1 }).limit(limit);
  return messages.reverse(); // return oldest-first for natural chat rendering
}

/**
 * Called from BOTH chat.controller.js (if we ever add a REST fallback) and
 * chat.socket.js (the primary path, since messages are real-time/event-shaped
 * per our Phase 6 architecture decision) - this is the single source of
 * truth for "what happens when a message is sent."
 */
export async function createMessage(conversationId, senderId, text) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw ApiError.notFound('Conversation not found');
  assertParticipant(conversation, senderId);

  const message = await Message.create({ conversation: conversationId, sender: senderId, text });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message;
}