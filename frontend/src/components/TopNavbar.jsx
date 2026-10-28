import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import { ROLE_BADGE_CLASS, ROLE_LABELS } from '../utils/roles';
import { getInitials } from '../utils/format';

export default function TopNavbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <button type="button" className="btn btn-light d-lg-none" onClick={onToggleSidebar} aria-label="Toggle menu">
        <i className="bi bi-list fs-5" />
      </button>

      <div className="ms-auto d-flex align-items-center gap-2 gap-md-3">
        <Link to="/dashboard/notifications" className="btn btn-light position-relative" aria-label="Notifications">
          <i className="bi bi-bell" />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{unreadCount}</span>
          )}
        </Link>

        <Link to="/dashboard/profile" className="d-flex align-items-center gap-2 text-decoration-none text-reset">
          <div className="jersey" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{getInitials(user.name)}</div>
          <div className="d-none d-sm-block lh-sm">
            <div className="fw-semibold small">{user.name}</div>
            <span className={`badge ${ROLE_BADGE_CLASS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
          </div>
        </Link>

        <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right" />
          <span className="d-none d-md-inline ms-1">Logout</span>
        </button>
      </div>
    </header>
  );
}
