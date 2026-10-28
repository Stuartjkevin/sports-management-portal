import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getHomePath } from '../utils/roles';

// Layout for the landing, login and register pages: simple top navbar + footer.
export default function PublicLayout() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  return (
    <div className="d-flex flex-column min-vh-100 bg-white">
      <nav className="navbar navbar-expand-md public-navbar sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={close}>
            <i className="bi bi-trophy-fill text-warning" /> SportTeam Portal
          </Link>
          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? 'show' : ''}`}>
            <ul className="navbar-nav ms-auto align-items-md-center gap-md-2">
              <li className="nav-item"><a className="nav-link" href="/#features" onClick={close}>Features</a></li>
              {user ? (
                <li className="nav-item"><Link className="btn btn-navy btn-sm" to={getHomePath(user.role)} onClick={close}>Go to dashboard</Link></li>
              ) : (
                <>
                  <li className="nav-item"><NavLink className="nav-link" to="/login" onClick={close}>Login</NavLink></li>
                  <li className="nav-item"><Link className="btn btn-navy btn-sm" to="/register" onClick={close}>Get started</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="public-footer py-4">
        <div className="container d-flex flex-wrap justify-content-between gap-2">
          <span>© {new Date().getFullYear()} Sport Team Management Portal</span>
          <span>Multi-Sport Team Management and Performance Analytics System</span>
        </div>
      </footer>
    </div>
  );
}
