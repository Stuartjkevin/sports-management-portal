// Shares the logged-in user's notifications between the top navbar (unread badge)
// and the Notifications page. Data comes from /api/notifications.
import { createContext, useCallback, useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { notificationService } from '../services/resourceServices';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const userId = user?.id;

  const refresh = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }
    try {
      const data = await notificationService.list();
      setNotifications(data.notifications);
      setError(null);
    } catch (err) {
      setError(err);
    }
  }, [userId]);

  useEffect(() => { refresh(); }, [refresh]);

  // Update the screen first, then tell the server. If the server fails, reload the real list.
  const markAsRead = (id) => {
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    notificationService.markAsRead(id).catch(refresh);
  };

  const markAllAsRead = () => {
    setNotifications((list) => list.map((n) => ({ ...n, read: true })));
    notificationService.markAllAsRead().catch(refresh);
  };

  const removeNotification = (id) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
    notificationService.remove(id).catch(refresh);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, error, refresh, markAsRead, markAllAsRead, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}
