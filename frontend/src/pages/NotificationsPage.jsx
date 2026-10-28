import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import useNotifications from '../hooks/useNotifications';

const TYPE_ICONS = {
  MATCH: 'bi-calendar-event text-primary',
  TRAINING: 'bi-clipboard-check text-success',
  SELECTION: 'bi-stars text-warning',
  TOURNAMENT: 'bi-trophy text-danger',
  SYSTEM: 'bi-info-circle text-secondary',
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [filter, setFilter] = useState('ALL');

  const visible = filter === 'UNREAD' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        actions={<button type="button" className="btn btn-outline-secondary" onClick={markAllAsRead} disabled={unreadCount === 0}><i className="bi bi-check2-all me-1" />Mark all as read</button>}
      />

      <div className="btn-group mb-3">
        {['ALL', 'UNREAD'].map((f) => (
          <button key={f} type="button" className={`btn btn-sm ${filter === f ? 'btn-navy' : 'btn-outline-secondary'}`} onClick={() => setFilter(f)}>
            {f === 'ALL' ? 'All' : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      <div className="card">
        {visible.length === 0 ? (
          <EmptyState icon="bi-bell-slash" title="You're all caught up" message="No notifications to show." />
        ) : (
          <ul className="list-group list-group-flush">
            {visible.map((n) => (
              <li key={n.id} className={`list-group-item notification-item d-flex gap-3 py-3 ${n.read ? '' : 'unread'}`}>
                <i className={`bi ${TYPE_ICONS[n.type]} fs-5`} />
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between gap-2">
                    <span className="notification-title">{n.title}</span>
                    <span className="small text-muted-soft text-nowrap">{n.time}</span>
                  </div>
                  <div className="small text-muted-soft">{n.message}</div>
                  <div className="mt-2 d-flex gap-3">
                    {!n.read && <button type="button" className="btn btn-link btn-sm p-0" onClick={() => markAsRead(n.id)}>Mark as read</button>}
                    <button type="button" className="btn btn-link btn-sm p-0 text-danger" onClick={() => removeNotification(n.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
