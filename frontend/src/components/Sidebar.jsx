import { Link, NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getNavItems } from '../utils/roles';

// Left navigation. Links are filtered by the current role.
// On mobile it slides in when "open" is true.
export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const items = getNavItems(user.role);

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
      <Link to="/" className="sidebar-brand">
        <i className="bi bi-trophy-fill text-warning" />
        <span>SportTeam Portal</span>
      </Link>
      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className={`bi ${item.icon}`} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">Phase 1 · Frontend demo (mock data)</div>
    </aside>
  );
}
