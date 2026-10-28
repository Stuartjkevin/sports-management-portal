// Each user only ever sees and changes their OWN notifications.
import { notificationRepository } from '../repositories/index.js';
import AppError from '../utils/AppError.js';

async function findOwnOr404(id, userId) {
  const notification = await notificationRepository.findById(id);
  if (!notification || notification.userId !== userId) throw new AppError(404, 'Notification not found.');
  return notification;
}

// GET /api/notifications?unread=true
export async function listNotifications(req, res) {
  const filter = { userId: req.user.id, ...(req.query.unread === 'true' && { read: false }) };
  const list = await notificationRepository.findAll(filter);
  res.json({ unreadCount: await notificationRepository.count({ userId: req.user.id, read: false }), notifications: list });
}

// PATCH /api/notifications/:id/read
export async function markAsRead(req, res) {
  const notification = await findOwnOr404(req.params.id, req.user.id);
  res.json(await notificationRepository.update(notification.id, { read: true }));
}

// PATCH /api/notifications/read-all
export async function markAllAsRead(req, res) {
  const updated = await notificationRepository.updateMany({ userId: req.user.id, read: false }, { read: true });
  res.json({ updated });
}

// DELETE /api/notifications/:id
export async function deleteNotification(req, res) {
  const notification = await findOwnOr404(req.params.id, req.user.id);
  await notificationRepository.remove(notification.id);
  res.status(204).end();
}
