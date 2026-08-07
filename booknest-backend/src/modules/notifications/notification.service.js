import { Notification } from './notification.model.js';

/**
 * Called from OTHER modules' services (request, chat, rating, listing) -
 * this is the single entry point every notification gets created through,
 * per our Phase 6 "shared service layer" principle.
 */
export async function notify(recipientId, type, payload = {}) {
  return Notification.create({ recipient: recipientId, type, payload });
}

export async function getUserNotifications(userId) {
  return Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(50);
}

export async function markAsRead(notificationId, userId) {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { $set: { read: true } },
    { new: true }
  );
}

export async function markAllAsRead(userId) {
  await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
}